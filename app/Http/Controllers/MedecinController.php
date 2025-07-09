<?php

namespace App\Http\Controllers;

use DateTime;
use Carbon\Carbon;
use App\Models\Medecin;
use App\Models\RendezVous;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\CreneauHoraire;
use App\Events\NotificationSent;
use Illuminate\Support\Facades\Hash;

class MedecinController extends Controller
{
    //
    public function register(Request $request){
        $validated = $request->validate([
            'adresseMail' => 'required|email|unique:patients,adresseMail',
            'motDePasse' => 'required|min:6',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'specialite' => 'required|string|max:255',
        ]);
        $medecin = Medecin::create([
            'adresseMail' => $validated['adresseMail'],
            'motDePasse' => bcrypt($validated['motDePasse']),
            'prenom' => $validated['prenom'],
            'nom' => $validated['nom'],
            'specialite' => $validated['specialite'],
        ]);
        return response()->json([
            'message' => 'Medecin enregistré avec succès',
            'patient' => $medecin
        ]);
    }
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $medecin = Medecin::where('adresseMail', $request->email)->first();

         if ($medecin->statut == 'inactif') {
            return response()->json([
                'message' => 'Votre compte a été désactivé. Veuillez contacter l\'administrateur afin de le réactiver.'
            ], 400);
        }

        if (!$medecin || !Hash::check($request->password, $medecin->motDePasse)) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 400);
        }

        $token = $medecin->createToken('auth_token', ['*'], now()->addMinutes(60))->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'id' => $medecin->_id,
            'prenom' => $medecin->prenom,
            'nom' => $medecin->nom,
            'email' => $medecin->adresseMail,
        ]);
    }

    public function profile(Request $request) {
        $medecin = $request->user('medecin');
        return response()->json([
            'nom' => $medecin->nom,
            'prenom' => $medecin->prenom,
            'email' => $medecin->adresseMail,
            'specialite' => $medecin->specialite,
            'anneeCreation' => Carbon::parse($medecin->createdAt)->format('Y')
        ]);
    }

    public function addSchedule(Request $request) {
        $request->validate([
            'creneaux' => 'required|array|min:1',
            'creneaux.*.jour' => 'required',
            'creneaux.*.heureDebut' => 'required|date_format:H:i',
            'creneaux.*.heureFin' => 'required|date_format:H:i',
            'creneaux.*.nbreLimitePatient' => 'required|integer|min:1'
        ]);
        $medecin = $request->user('medecin');
         $creneauxFormates = [];

    // Formatage avec foreach
        foreach ($request->creneaux as $creneau) {
            $creneauxFormates[] = [
                'idCreneau' => 'creneau' . uniqid(),
                'jour' => $creneau['jour'],
                'heureDebut' => $creneau['heureDebut'],
                'heureFin' => $creneau['heureFin'],
                'nbreLimitePatient' => $creneau['nbreLimitePatient'],
                'est_disponible' => true
            ];
        }

        foreach ($creneauxFormates as $creneau) {
            $conflict = CreneauHoraire::where('idMedecin', $medecin->_id)
                ->where('jours.jour', $creneau['jour'])
                ->where(function($q) use ($creneau) {
                    $q->where('jours.heureDebut', '<', $creneau['heureFin'])
                      ->where('jours.heureFin', '>', $creneau['heureDebut']);
                })->exists();

            if ($conflict) {
                return response()->json([
                    'message' => 'Conflit détecté pour le créneau : ' . $creneau['jour'] . ' ' .
                             $creneau['heureDebut'] . '-' . $creneau['heureFin']
                ], 409);
            }
        }

        $groupeCreneaux = CreneauHoraire::create([
            'idMedecin' => $medecin->_id,
            'jours' => $creneauxFormates
        ]);

        return response()->json([
            'message' => count($creneauxFormates) . ' créneau(x) groupés ajoutés',
            'data' => $groupeCreneaux
        ], 201);
    }

    public function getAppointments(Request $request){
        $medecin = $request->user('medecin');
        $rendezVous = RendezVous::where('medecin', 'Dr. ' . $medecin->prenom . ' ' . $medecin->nom)->get();
        return response()->json($rendezVous, 200);
    }

    public function getSchedule(Request $request){
        $medecin = $request->user('medecin');
        $creneaux = CreneauHoraire::where('idMedecin', $medecin->_id)
                                   ->get(['_id', 'idMedecin', 'jours']);

        return response()->json($creneaux, 200);
    }

    public function deleteSchedule(Request $request) {
        $request->validate([
            'idCreneau' => 'required|string',
            'id' => 'required|string'

        ]);
        $medecin = $request->user('medecin');
        $schedule = CreneauHoraire::where('_id', $request->id)
                       ->where('jours.idCreneau', $request->idCreneau)   
                       ->where('idMedecin', $medecin->_id)
                       ->first();
        if ($schedule) {
             $schedule->pull(
                'jours', [
                    'idCreneau' => $request->idCreneau
                ]);
        }
        $empty = CreneauHoraire::where('_id', $request->id)->first();
        if(count($empty->jours) <= 0) {
            $empty->delete();
        }
        $appointmentsToCancel = RendezVous::where('idCreneau', $request->idCreneau)->get();
        foreach ($appointmentsToCancel as $appointmentToCancel) {
            $appointmentToCancel->update([
                'statut' => 'cancelled'
            ]);
        }
        foreach($appointmentsToCancel as $rdv) {
            $date = new DateTime($rdv->date);
            $formatter = new \IntlDateFormatter('fr_FR', \IntlDateFormatter::LONG, \IntlDateFormatter::NONE);
            $formattedDate = $formatter->format($date);
            $existingNotification = Notification::where('idPatient', $rdv->idPatient)
                                                 ->where('relatedId', $rdv->_id)
                                                 ->first();
            if(!$existingNotification) { 
                Notification::create([
                    'idPatient' => $rdv->idPatient,
                    'title' => 'Rendez-vous annulé',
                    'type' => 'appointment',
                    'isRead' => false,
                    'message' => "Le " . $rdv->medecin . " a annulé votre rendez-vous prévu le " . $formattedDate . " au créneau " . $rdv->creneau . ".",
                    'relatedId' => $rdv->_id,
                ]);
                $unreadCount = Notification::where('idPatient', $rdv->idPatient)
                                            ->where('isRead', false)
                                            ->count();
                broadcast(new NotificationSent($rdv->idPatient, $unreadCount));
            }       
        };
        return response()->json([
            'message' => 'Le créneau horaire a été supprimé avec succès.'
        ], 200);
    }

    public function completeAppointment(Request $request) {
        $request->validate([
            'idRdv' => 'required|string',
        ]);
        $appointment = RendezVous::where('_id', $request->idRdv)->first();
        if ($appointment) {
            $appointment->update([
                'statut' => 'completed'
            ]);
        }
        return response()->json([
            'message' => 'Rendez-vous marqué comme effectué'
        ], 200);
    }
}
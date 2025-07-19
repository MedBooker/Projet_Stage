<?php

namespace App\Http\Controllers;

use App\Mail\AppointmentCancelledMail;
use DateTime;
use Carbon\Carbon;
use App\Models\Suivi;
use App\Models\Medecin;
use App\Models\Patient;
use App\Models\RendezVous;
use App\Mail\ResetPassword;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\CreneauHoraire;
use App\Models\DossierMedical;
use App\Events\NotificationSent;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;

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

    public function verifyMail(Request $request) {
        $request->validate([
            'email' => 'required|email'
        ]);
        $medecin = Medecin::where('adresseMail', $request->email)->first();
        if ($medecin) {
            $token = $medecin->createToken('mail_token')->plainTextToken;
            $url = env('FRONTEND_URL_DOCTOR') . '/reset-password?token=' . $token;
            Mail::to($medecin->adresseMail)->send(new ResetPassword($medecin->nom, $medecin->prenom, $url));
            return response()->json([
                'message' => 'Un mail a ete envoye a votre adresse'
            ], 200);
        }
        return response()->json([
            'message' => 'Mail invalide'
        ], 400);
    }

    public function modifyPassword(Request $request, $token) {
        $request->validate([
            'password' => 'required'
        ]);
        $personalToken = PersonalAccessToken::findToken($token);
        if (!$personalToken) {
            return response()->json([
                'message' => 'Token invalide ou expiré.'
            ], 400);
        }
        $medecin = $personalToken->tokenable;
        $medecin->update([
            'motDePasse' => bcrypt($request->password)
        ]);
        $personalToken->delete();
        return response()->json([
             'message' => 'Votre mot de passe a été modifié avec succès !',
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
        if (!$schedule) {
            return response()->json([
                'message' => 'Créneau non trouvé'
            ], 404);
        }
        $schedule->pull('jours', ['idCreneau' => $request->idCreneau]);
        
        $empty = CreneauHoraire::where('_id', $request->id)->first();
        if($empty && count($empty->jours) <= 0) {
            $empty->delete();
        }
        $appointmentsToCancel = RendezVous::where('idCreneau', $request->idCreneau)->get();
        foreach ($appointmentsToCancel as $appointmentToCancel) {
            $appointmentToCancel->update([
                'statut' => 'cancelled'
            ]);
        }
        foreach($appointmentsToCancel as $rdv) {
            $patient = Patient::find( $rdv->idPatient);
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
                Mail::to($patient->adresseMail)->send(new AppointmentCancelledMail($patient->nom, $patient->prenom, $rdv->creneau, $rdv->medecin, $rdv->date));
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

    public function getMedicalRecords(Request $request) {
        $medecin = $request->user('medecin');
        $records = DossierMedical::all();
        return response()->json($records, 200);
    }
    
    public function createMedicalRecord(Request $request) {
        $medecin = $request->user('medecin');
        $request->validate([
            'patient_id' => 'required',
            'appointment_id' => 'required',
            'diagnosis' => 'required',
            'prescription' => 'required',
            'patient_name' => 'required',
            'appointment_date' => 'required',
            'notes' => 'required',
            'documents' => 'sometimes|array|min:1', 
            'documents.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240'
        ]);
        $documentPaths = [];
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $document) {
                $path = $document->store('documents', 'public');
                $documentPaths[] = [
                    'id' => 'file' . uniqid(),
                    'name' => $document->getClientOriginalName(),
                    'path' => $path,
                    'type' => $document->getMimeType(),
                ];
            }
        }
        $medicalRecord = DossierMedical::create([
            'idPatient' => $request->patient_id,
            'idRdv' => $request->appointment_id,
            'diagnostic' => $request->diagnosis,
            'prescription' => $request->prescription,
            'notes' => $request->notes,
            'nomPatient' => $request->patient_name,
            'dateRdv' => $request->appointment_date,
            'documents' => $documentPaths
        ]);
        $idMedecins = [];
        $idMedecins[] = [
            'idMedecin' => $medecin->_id
        ];
        Suivi::create([
            'idDossier' => $medicalRecord->_id,
            'idMedecins' => $idMedecins
        ]);
        return response()->json([
            'message' => 'Le dossier medical a ete creer avec succes',
            'id' => $medicalRecord->_id,
            'idPatient' => $medicalRecord->idPatient,
            'idRdv' => $medicalRecord->idRdv,
            'nomPatient' => $medicalRecord->nomPatient,
            'dateRdv' => $medicalRecord->dateRdv,
            'diagnostic' => $medicalRecord->diagnostic,
            'prescription' => $medicalRecord->prescription,
            'notes' => $medicalRecord->notes,
            'documents' => $medicalRecord->documents,
        ], 200);
    }

    public function updateMedicalRecord(Request $request) {
        $medecin = $request->user('medecin');
        $request->validate([
            'diagnosis' => 'required',
            'prescription' => 'required',
            'notes' => 'required',
            'idRecord' => 'required',
            'documents' => 'sometimes|array|min:1', 
            'documents.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240'
        ]);
        $record = DossierMedical::where('_id', $request->idRecord)->first();
        $documentPaths = $record->documents ?? []; 
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $document) {
                $path = $document->store('documents', 'public');
                $documentPaths[] = [
                    'id' => 'file' . uniqid(),
                    'name' => $document->getClientOriginalName(),
                    'path' => $path,
                    'type' => $document->getMimeType(),
                ];
            }
        }
        $record->update([
            'diagnostic' => $request->diagnosis,
            'prescription' => $request->prescription,
            'notes' => $request->notes,
            'documents' => $documentPaths
        ]);
        $suivi = Suivi::where('idDossier', $request->idRecord)->first();
        if ($suivi) {
            $existingMedecins = array_column($suivi->idMedecins, 'idMedecin');
            if (!in_array($medecin->_id, $existingMedecins)) {
                $suivi->idMedecins[] = [
                    'idMedecin' => $medecin->_id
                ];
                $suivi->save();
            }
            return response()->json($record, 200);
        }
    }

    public function deleteFile(Request $request) {
        $request->validate([
            'documentId' => 'required|string' 
        ]);
        $file = DossierMedical::where('documents.id', $request->documentId)->first();
        if ($file) {
            $file->pull(
                'documents', [
                    'id' => $request->documentId 
                ]);
        }
        return response()->json([
            'message' => 'Fichier supprimé avec succès'
        ], 200);
    }
}
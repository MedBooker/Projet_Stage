<?php

namespace App\Http\Controllers;

use DateTime;
use Carbon\Carbon;
use App\Models\Medecin;
use App\Models\Patient;
use App\Mail\ConfirmMail;
use App\Models\RendezVous;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\CreneauHoraire;
use App\Models\PendingPatient;
use App\Events\NotificationSent;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\PersonalAccessToken;

class PatientController extends Controller
{
    //
    public function registerRequest(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed:confirmPassword',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'numeroDeTelephone' => 'required|string|max:255',
            'sexe' => 'required|in:homme,femme',
            'dateDeNaissance' => 'required|date',
            'assurance' => 'nullable|string|max:255',
        ]);
        if (Patient::where('adresseMail', $request->email)->exists()) {
            return response()->json([
                'message' => 'Un patient avec cette adresse mail existe déjà. Veuillez la changer.'
            ],400);
        }
        $pendingPatient = PendingPatient::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'adresseMail' => $request->email,
            'motDePasse' => bcrypt($request->password),
            'sexe' => $request->sexe,
            'dateDeNaissance' => $request->dateDeNaissance,
            'numeroDeTelephone' => $request->numeroDeTelephone,
            'adresse' => $request->adresse,
            'assurance' => $request->assurance
        ]);
        $token = $pendingPatient->createToken('verify_token')->plainTextToken;
        $url = env('FRONTEND_URL') . '/verify-email?token=' . $token;
        Mail::to($pendingPatient->adresseMail)->send(new ConfirmMail($pendingPatient->nom, $pendingPatient->prenom, $url));
        return response()->json([
            'message' => 'Patient créé avec succès',
            'patient' => $pendingPatient
        ]);
    }

    public function verifyEMail($token) {
        $personalToken = PersonalAccessToken::findToken($token);
        if (!$personalToken) {
            return response()->json([
                'message' => 'Token invalide ou expiré.'
            ], 400);
        }
        $pendingPatient = $personalToken->tokenable;
        $data = [
            'prenom' => $pendingPatient->prenom,
            'nom' => $pendingPatient->nom,
            'adresseMail' => $pendingPatient->adresseMail,
            'motDePasse' => $pendingPatient->motDePasse,
            'sexe' => $pendingPatient->sexe,
            'dateDeNaissance' => $pendingPatient->dateDeNaissance,
            'numeroDeTelephone' => $pendingPatient->numeroDeTelephone,
            'adresse' => $pendingPatient->adresse,
            'statut' => 'actif'
        ];
        if ($pendingPatient->assurance !== 'Aucune') {
            $data['assurance'] = $pendingPatient->assurance;
        }
        $patient = Patient::create($data);
        $pendingPatient->getConnection()->getCollection('pending_patients')->drop();
        $personalToken->delete();
        return response()->json([
             'message' => 'Votre compte a été validé avec succès !',
             'patient' => $patient
        ]);
    }

    public function login(Request $request){
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $patient = Patient::where('adresseMail', $request->email)->first();

        if ($patient->statut == 'inactif') {
            return response()->json([
                'message' => 'Votre compte a ete desactiver'
            ], 400);
        }

        if (!$patient || !Hash::check($request->password, $patient->motDePasse)) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 400);
        }

        $token = $patient->createToken('auth_token', ['*'], now()->addMinutes(60))->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'id' => $patient->_id,
            'prenom' => $patient->prenom,
            'nom' => $patient->nom,
            'email' => $patient->adresseMail,
        ]);
    }

    public function profile(Request $request) {
        $patient = $request->user('patient');
        return response()->json([
            'nom' => $patient->nom,
            'prenom' => $patient->prenom,
            'email' => $patient->adresseMail,
            'telephone' => $patient->numeroDeTelephone,
            'ddn' => $patient->dateDeNaissance,
            'adresse' => $patient->adresse,
            'anneeCreation' => Carbon::parse($patient->createdAt)->format('Y')
        ]);
    }

    public function updateProfile(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'birthDate' => 'required|date',
        ]);
        $patient = $request->user('patient');
        $patient->update([
            'prenom' => $request->firstName,
            'nom' => $request->lastName,
            'adresseMail' => $request->email,
            'dateDeNaissance' => $request->birthDate,
            'numeroDeTelephone' => $request->phone,
            'adresse' => $request->address,
        ]);
        return response()->json([
            'message' => 'Patient modifié avec succès',
            'patient' => $patient
        ]);
    }

    public function getSpecialties() {
        $specialties = Medecin::raw(function($collection) {
            return $collection->distinct('specialite');
        });
        return response()->json([
            'success' => true,
            'specialties' => $specialties
        ], 200);
    }

    public function getDoctors() {
        $medecins = Medecin::with('creneaux')->get();
        foreach ($medecins as $medecin) {
            $horairesParJour = [];
            foreach ($medecin->creneaux as $creneau) {
                foreach ($creneau->jours as $horaire) {
                    if ($horaire['est_disponible']) {
                        $jour = $horaire['jour'];
                        $horairesParJour[$jour][] = [
                            'idCreneau' => $horaire['idCreneau'],
                            'heure' => $horaire['heureDebut'] . ' - ' . $horaire['heureFin']
                        ];
                    }
                }
            }
            $medecin->horaires_par_jour = $horairesParJour;
        }
        return response()->json($medecins);
    }

    public function patientLimit(Request $request) {
        $request->validate([
            'creneauId' => 'required|string'
        ]);
        $nbrePatients = RendezVous::where('idCreneau', $request->creneauId)->count();
        $creneau = CreneauHoraire::where('jours.idCreneau', $request->creneauId)->first();
        foreach ($creneau->jours as $index => $horaire) {
            if ($horaire['idCreneau'] == $request->creneauId) {
                if ($nbrePatients >= $horaire['nbreLimitePatient']) {
                    $jours = $creneau->jours;
                    $jours[$index]['est_disponible'] = false;
                    $creneau->update([
                        'jours' => $jours
                    ]);
                    return response()->json([
                        'message' => 'Le nombre limite de patients pour ce créneau a été atteint'
                    ], 200);
                }
            }
        }
        return response()->json([
            'message' => 'Le nombre limite de patients pour ce créneau n\'a pas encore été atteint'
        ], 200);
    }

    public function createAppointment(Request $request){
        $validated = $request->validate([
            'personalInfo.fullName' => 'required|string|min:3',
            'personalInfo.email' => 'required|email',
            'personalInfo.phone' => 'required|string|min:10|max:15',
            'appointmentInfo.consultationType' => 'required|string',
            'appointmentInfo.specialty' => 'required|string',
            'appointmentInfo.doctor' => 'required|string',
            'appointmentInfo.date' => 'required|date',
            'appointmentInfo.time' => 'required|string',
            'appointmentInfo.creneauId' => 'required|string',
            'reason' => 'required|string|min:10',
        ]);
        $patient = $request->user('patient');
        $appointment = RendezVous::create([
            'prenomNom' => $validated['personalInfo']['fullName'],
            'adresseMail' => $validated['personalInfo']['email'],
            'numeroDeTelephone' => $validated['personalInfo']['phone'],
            'typeDeRendezVous' => $validated['appointmentInfo']['consultationType'],
            'specialite' => $validated['appointmentInfo']['specialty'],
            'medecin' => $validated['appointmentInfo']['doctor'],
            'date' => $validated['appointmentInfo']['date'],
            'creneau' => $validated['appointmentInfo']['time'],
            'idCreneau' => $validated['appointmentInfo']['creneauId'],
            'raison' => $validated['reason'],
            'statut' => 'upcoming',
            'idPatient' => $patient->_id
        ]);
        return response()->json([
            'message' => 'Rendez-vous créé avec succès',
            'rendez-vous' => $appointment
        ],200);
    }

    public function getAppointments(Request $request) {
        $patient = $request->user('patient');
        $appointments = RendezVous::where('idPatient', $patient->_id)->get();
        return response()->json($appointments, 200);
    }

    public function deleteAppointments(Request $request) {
        $request->validate([
            'id' => 'required',
            'idCreneau' => 'required'
        ]);
        $appointment = RendezVous::where('_id', $request->id)->first();
        $appointment->delete();
        $nbrePatients = RendezVous::where('idCreneau', $request->idCreneau)->count();
        $creneau = CreneauHoraire::where('jours.idCreneau', $request->idCreneau)->first();
        if($creneau) {
            foreach ($creneau->jours as $index => $horaire) {
                if ($horaire['idCreneau'] == $request->idCreneau) {
                    if ($nbrePatients < $horaire['nbreLimitePatient'] && !$horaire['est_disponible']) {
                        $jours = $creneau->jours;
                        $jours[$index]['est_disponible'] = true;
                        $creneau->update([
                            'jours' => $jours
                        ]);
                    }
                }
            }
        }
        Notification::where('relatedId', $request->id)->first()->delete();
        return response()->json([
            'message' => 'Rendez-vous supprimé avec succès'
        ], 200);
    }

    public function countNotifications(Request $request) {
        $patient =$request->user('patient');
        $unreadCount = Notification::where('idPatient', $patient->_id)
                                      ->where('isRead', false)
                                      ->count();
        return response()->json([
            'unreadCount' => $unreadCount, 
        ], 200);   
    }

    public function notifications(Request $request) {
        $patient =$request->user('patient');
        $notifications = Notification::where('idPatient', $patient->_id)->get();
        return response()->json($notifications, 200);   
    }

    public function markAsRead(Request $request) {
        $request->validate([
            'id_notification' => 'required|string'
        ]);
        $patient = $request->user('patient');
        $notification = Notification::where('idPatient', $patient->_id)
                                     ->where('_id', $request->id_notification)
                                     ->first();
        $notification->update([
            'isRead' => true
        ]);
        $unreadCount = Notification::where('idPatient', $patient->_id)
                                            ->where('isRead', false)
                                            ->count();
        broadcast(new NotificationSent($patient->_id, $unreadCount));  
        return response()->json([
            'message' => 'La notification a été marquée comme lue',
            'notification' => $notification
        ], 200);
    }

     public function markAllRead(Request $request) {
        $patient = $request->user('patient');
        $notifications = Notification::where('idPatient', $patient->_id)
                                     ->where('isRead', false)
                                     ->get();
        
        foreach($notifications as $notification) {
             $notification->update([
                'isRead' => true
            ]);
        };
        broadcast(new NotificationSent($patient->_id, 0));                         
        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues',
            'notification' => $notifications
        ], 200);
    }
}

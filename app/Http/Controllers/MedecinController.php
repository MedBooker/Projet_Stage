<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Medecin;
use Illuminate\Http\Request;
use App\Models\CreneauHoraire;
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
}

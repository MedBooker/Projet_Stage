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
            'date' => 'required|date',  
            'heureDebut' => 'required|date_format:H:i',
            'heureFin' => 'required|date_format:H:i',
        ]);
        $medecin = $request->user('medecin');
        $data= [
            'date' => $request->date,
            'heureDebut' => $request->heureDebut,
            'heureFin' => $request->heureFin,
            'est_disponible' => true,
            'idMedecin' => $medecin->_id
        ];
        $debut = Carbon::createFromFormat('H:i', $request->heureDebut);
        $fin = Carbon::createFromFormat('H:i', $request->heureFin);
        $creneauExiste = CreneauHoraire::where('date', $request->date)
                                        ->where('heureDebut', $request->heureDebut)
                                        ->where('heureFin', $request->heureFin)
                                        ->where('idMedecin', $medecin->_id)
                                        ->exists();
        if ($creneauExiste) {
            return response()->json([
                'message' => 'Ce créneau horaire existe déjà'
            ], 400);
        }
        $chevauchement = CreneauHoraire::where('date', $request->date)
        ->where('idMedecin', $medecin->_id)
        ->where(function ($query) use ($debut, $fin) {
            // Cas 1: Pour un chevauchement partiel (ex: 8h-8h30 vs 8h15-8h45)
            $query->where('heureDebut', '<', $fin->format('H:i'))
                  ->where('heureFin', '>', $debut->format('H:i'));
        })
        ->orWhere(function ($query) use ($debut, $fin) {
            // Cas 2: Pour un créneau englobé (ex: 8h-9h vs 8h15-8h45)
            $query->where('heureDebut', '>=', $debut->format('H:i'))
                  ->where('heureFin', '<=', $fin->format('H:i'));
        })
        ->exists();
        if ($chevauchement) {
            return response()->json([
                'message' => 'Ce créneau chevauche un créneau existant'
            ], 400);
        }
        $creneau = CreneauHoraire::create($data);
        return response()->json([
            'message' => 'Créneau horaire ajouté avec succès',
            'creneau' => $creneau
        ]);
    }
}

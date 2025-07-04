<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Medecin;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    //
    public function register (Request $request) {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'adresseMail' => 'required|email|max:255',
            'motDePasse' => 'required|string',
        ]);
        $admin = Admin::create([
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'],
            'adresseMail' => $validatedData['adresseMail'],
            'motDePasse' => bcrypt($validatedData['motDePasse']), 
        ]);
        return response()->json([
            'message' => 'Admin enregistré avec succès.',
            'user' => $admin
        ]);
    }

    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = Admin::where('adresseMail', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->motDePasse)) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 400);
        }

        $token = $admin->createToken('auth_token', ['*'], now()->addMinutes(60))->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'id' => $admin->_id,
            'prenom' => $admin->prenom,
            'nom' => $admin->nom,
            'email' => $admin->adresseMail,
        ]);
    }

    public function registerDoctor(Request $request) {
        $request->validate([
            'email' => 'required|email|unique:medecins,adresseMail',
            'password' => 'required|min:6',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'specialite' => 'required|string|max:255',
        ]);
        $medecin = Medecin::create([
            'adresseMail' => $request->email,
            'motDePasse' => bcrypt($request->password), 
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'specialite' => $request->specialite,
            'statut' => 'actif'
        ]);
        return response()->json([
            'message' => 'Medecin enregistré avec succès',
            'patient' => $medecin
        ]);
    }

    public function getMedecins(Request $request) {
        $admin = $request->user('admin');
            if (!$admin) {
                return response()->json([
                    'message' => 'Vous n\'etes pas autorisé à accéder à cette page'
                ], 401);
            }
            $medecins = Medecin::all();
            return response()->json($medecins);
    }

     public function toggleStatus(Request $request){
        $request->validate([
            'id' => 'required|string'
        ]);
        $admin = $request->user('admin');
        if (!$admin) {
            return response()->json([
                'message' => 'Vous n\'etes pas autorisé à accéder à cette page'
            ], 401);
        }
        $medecin = Medecin::findOrFail($request->id);
        $medecin->statut = $medecin->statut === 'actif' ? 'inactif' : 'actif';
        $medecin->save();

        return response()->json([
            'message' => 'Statut mis à jour',
            'new_status' => $medecin->statut
        ], 200);
    }

    public function getPatients(Request $request) {
        $admin = $request->user('admin');
        if (!$admin) {
            return response()->json([
                'message' => 'Vous n\'etes pas autorisé à accéder à cette page'
            ], 401);
        }
        $patients = Patient::all();
        return response()->json($patients);
    }

}

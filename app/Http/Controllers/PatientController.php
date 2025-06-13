<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PatientController extends Controller
{
    //
    public function create(Request $request) {
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
        $patient = Patient::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'adresseMail' => $request->email,
            'motDePasse' => bcrypt($request->password),
            'sexe' => $request->sexe,
            'dateDeNaissance' => $request->dateDeNaissance,
            'numeroDeTelephone' => $request->numeroDeTelephone,
            'adresse' => $request->adresse,
            'assurance' => $request->assurance ?? null
        ]);
        return response()->json([
            'message' => 'Patient créé avec succès',
            'patient' => $patient
        ]);
    }

public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $patient = Patient::where('adresseMail', $request->email)->first();

    if (!$patient || !Hash::check($request->password, $patient->motDePasse)) {
        return response()->json([
            'message' => 'Identifiants invalides'
        ], 400);
    }

    $token = $patient->createToken('auth_token')->plainTextToken;

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
        $patient = $request->user();
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
        $patient = $request->user();
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
}

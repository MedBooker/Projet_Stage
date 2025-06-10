<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    //
    public function index(Request $request) {
        $validated = $request->validate([
            'adresseMail' => 'required|email|unique:patients,adresseMail',
            'motDePasse' => 'required|min:6',
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'sexe' => 'required|in:homme,femme,autre',
            'dateDeNaissance' => 'required|date',
            'assurance' => 'nullable|string|max:255'
        ]);
        $validated['motDePasse'] = bcrypt($validated['motDePasse']);

        $patient = Patient::create($validated);

        return response()->json([
            'message' => 'Patient créé avec succès',
            'patient' => $patient
        ]);
    }

    public function get() {
        $patient = Patient::where('prenom', 'Jean')->first();
        return response()->json([
            'id' => $patient->_id
        ]);
    }
}

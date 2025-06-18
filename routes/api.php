<?php

use App\Http\Controllers\MedecinController;
use App\Http\Controllers\PatientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route pour les patients
Route::prefix('Patients')->group(function () {
    Route::post('register', [PatientController::class, 'create']);
    Route::post('login', [PatientController::class, 'login']);

    Route::middleware('auth:patient')->group(function () {
        Route::get('profile', [PatientController::class, 'profile']);
        Route::put('update-profile', [PatientController::class, 'updateProfile']);
    });
});

//Route pour les medecins
Route::prefix('Medecins')->group(function () {
    Route::post('login', [MedecinController::class, 'login']);

    Route::middleware('auth:medecin')->group(function () {
        Route::get('profile', [MedecinController::class, 'profile']);
        Route::post('add-schedule', [MedecinController::class, 'addSchedule']);
    });
});

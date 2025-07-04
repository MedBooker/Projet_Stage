<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\PatientController;

// Route pour les patients
Route::prefix('Patients')->group(function () {
    Route::post('register-request', [PatientController::class, 'registerRequest']);
    Route::post('/verify-email/{token}', [PatientController::class, 'verifyEmail']);
    Route::post('login', [PatientController::class, 'login']);

    Route::middleware('auth:patient')->group(function () {
        Route::get('profile', [PatientController::class, 'profile']);
        Route::put('update-profile', [PatientController::class, 'updateProfile']);
        Route::get('get-specialties', [PatientController::class, 'getSpecialties']);
        Route::get('get-doctors', [PatientController::class, 'getDoctors']);
        Route::post('patient-limit', [PatientController::class, 'patientLimit']);
        Route::post('create-appointment', [PatientController::class, 'createAppointment']);
        Route::get('get-appointments', [PatientController::class, 'getAppointments']);
        Route::delete('delete-appointments', [PatientController::class, 'deleteAppointments']);
        Route::get('notifications', [PatientController::class, 'Notifications']);
    });
});

//Route pour les medecins
Route::prefix('Medecins')->group(function () {
    Route::post('register', [MedecinController::class, 'register']);
    Route::post('login', [MedecinController::class, 'login']);

    Route::middleware('auth:medecin')->group(function () {
        Route::get('profile', [MedecinController::class, 'profile']);
        Route::post('add-schedule', [MedecinController::class, 'addSchedule']);
        Route::get('get-appointments', [MedecinController::class, 'getAppointments']);
        Route::get('get-schedule', [MedecinController::class, 'getSchedule']);
    });
});

//Route pour l'Admin
Route::prefix('Admin')->group(function () {
    Route::post('register', [AdminController::class, 'register']);
    Route::post('login', [AdminController::class, 'login']);
    Route::get('stats', [AdminController::class, 'getStats']);

    Route::middleware('auth:admin')->group(function () {
        Route::post('register-doctor', [AdminController::class, 'registerDoctor']);
        Route::get('get-medecins', [AdminController::class, 'getMedecins']);
        Route::post('toggle-status', [AdminController::class, 'toggleStatus']);
        Route::get('get-patients', [AdminController::class, 'getPatients']);  
    });
});

<?php

use App\Http\Controllers\PatientController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route pour les patients
Route::prefix('Patients')->group(function () {
    Route::post('register', [PatientController::class, 'create']);
    Route::post('login', [PatientController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('profile', [PatientController::class, 'profile']);
        Route::put('update-profile', [PatientController::class, 'updateProfile']);
    });
});
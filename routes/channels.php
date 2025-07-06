<?php

use App\Models\Patient;
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:patient']]);

Broadcast::channel('patient.{patientId}', function (Patient $patient, string $patientId) {
    return $patient->_id === $patientId; // 
});

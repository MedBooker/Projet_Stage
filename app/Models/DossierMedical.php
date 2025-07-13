<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class DossierMedical extends Model
{
    //
    protected $connexion = 'mongodb';
    protected $collection = 'dossier_medicaux';
    protected $fillable = [
        'idPatient',
        'idRdv',
        'diagnostic',
        'prescription',
        'notes',
        'documents',
        'nomPatient',
        'dateRdv' 
    ];
}

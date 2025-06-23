<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class RendezVous extends Model
{
    //
    protected $connexion = 'mongodb';
    protected $collection = 'rendez_vous';
    protected $fillable = [
        'prenomNom',
        'adresseMail',
        'numeroDeTelephone',
        'typeDeRendezVous',
        'specialite',
        'medecin',
        'date',
        'creneau',
        'raison',
        'idPatient',
        'idCreneau'
    ];
}

<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CreneauHoraire extends Model
{
    //
    protected $connexion = 'mongodb';
    protected $collection = 'creneaux_horaires';
    protected $fillable = [
        'date',
        'heureDebut',
        'heureFin',
        'est_disponible',
        'idMedecin'
    ];
}

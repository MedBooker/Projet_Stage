<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Suivi extends Model
{
    //
    protected $connexion = 'mongodb';
    protected $collection = 'suivis';
    protected $fillable = [
        'idDossier',
        'idMedecins',
    ];
}

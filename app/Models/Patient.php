<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Patient extends Model
{
    //
    protected $connexion = 'mongodb';
    protected $collection = 'patients';
    protected $fillable = [
        'adresseMail',
        'motDePasse',
        'prenom',
        'nom',
        'sexe',
        'dateDeNaissance',
        'assurance'
    ];
}

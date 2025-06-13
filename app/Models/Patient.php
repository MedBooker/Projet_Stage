<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
class Patient extends Authenticatable
{
    //
    use HasApiTokens;

    protected $connexion = 'mongodb';
    protected $collection = 'patients';
    protected $fillable = [
        'adresseMail',
        'motDePasse',
        'prenom',
        'nom',
        'sexe',
        'dateDeNaissance',
        'numeroDeTelephone',
        'adresse',
        'assurance'
    ];
}

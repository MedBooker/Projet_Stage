<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Medecin extends Authenticatable
{
    //
    use HasApiTokens;

    protected $connexion = 'mongodb';
    protected $collection = 'medecins';
    protected $fillable = [
        'adresseMail',
        'motDePasse',
        'prenom',
        'nom',
        'specialite',
        'statut'
    ];

    public function creneaux() {
        return $this->hasMany(CreneauHoraire::class, 'idMedecin', '_id');
    }
}

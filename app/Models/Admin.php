<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    //
     use HasApiTokens;

    protected $connexion = 'mongodb';
    protected $collection = 'admins';
    protected $fillable = [
        'adresseMail',
        'motDePasse',
        'prenom',
        'nom',
    ];
}

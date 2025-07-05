<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Notification extends Model
{
    //
    protected $connexion = 'mongodb';
    protected $collection = 'notifications';
     protected $fillable = [
        'idPatient',
        'title',
        'type',
        'isRead',
        'message',
        'relatedId',
    ];
}

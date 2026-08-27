<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'username';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'fullname',
        'role',
        'avatar',
        'signature',
        'show_status_prop',
        'dept',
        'access_permissions',
        'is_active',
        'section',
        'totp_secret',
    ];

    protected $hidden = [
        'password',
        'totp_secret',
    ];

    protected $casts = [
        'show_status_prop'   => 'integer',
        'is_active'          => 'integer',
        'access_permissions' => 'string',
    ];
}

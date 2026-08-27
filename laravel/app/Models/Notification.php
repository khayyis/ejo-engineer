<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'target_username',
        'ejo_id',
        'message',
        'timestamp',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'integer',
    ];
}

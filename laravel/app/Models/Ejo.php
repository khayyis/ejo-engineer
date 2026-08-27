<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ejo extends Model
{
    protected $table = 'ejos';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'title',
        'dept',
        'category',
        'priority',
        'location',
        'targetDate',
        'status',
        'engineer',
        'estCost',
        'actCost',
        'description',
        'logs',
        'requester',
        'createdDate',
        'mid',
    ];

    protected $casts = [
        'logs'    => 'array',
        'estCost' => 'integer',
        'actCost' => 'integer',
    ];
}

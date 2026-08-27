<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Drawing extends Model
{
    protected $table = 'drawings';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'ejo_id',
        'title',
        'file_path',
        'uploader',
        'uploaded_at',
        'status',
        'approvals',
        'logs',
        'dept',
        'category',
        'priority',
        'location',
        'targetDate',
        'description',
        'requester',
        'engineer',
        'estDate',
        'drawing_type',
        'sub_status',
        'etiket_category',
        'etiket_orientation',
        'is_archived',
    ];

    protected $casts = [
        'logs'        => 'array',
        'approvals'   => 'array',
        'is_archived' => 'integer',
    ];
}

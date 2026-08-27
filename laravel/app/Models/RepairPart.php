<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairPart extends Model
{
    protected $table = 'repair_parts';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'name',
        'code',
        'stock',
        'location',
        'ejo_id',
        'description',
        'image',
        'price',
        'cost_saving',
        'original_price',
        'uploader',
    ];

    protected $casts = [
        'stock'          => 'integer',
        'price'          => 'float',
        'cost_saving'    => 'float',
        'original_price' => 'float',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WspMaterial extends Model
{
    protected $table = 'wsp_materials';
    protected $primaryKey = 'material';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'material',
        'description',
        'price',
    ];

    protected $casts = [
        'price' => 'float',
    ];
}

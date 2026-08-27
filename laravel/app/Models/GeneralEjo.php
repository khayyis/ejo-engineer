<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GeneralEjo extends Model
{
    protected $table = 'general_ejos';
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
        'estDate',
        'status',
        'engineer',
        'estCost',
        'actCost',
        'description',
        'logs',
        'requester',
        'is_archived',
        'approvals',
        'createdDate',
        'quantity',
        'qty_needed',
        'qty_stock',
        'usage_type',
        'purpose',
        'qty_stock_target',
        'mid',
        'part_price_new',
        'repair_duration',
        'repair_cost_per_day',
        'photo_before',
        'qty_needed_target',
        'qty_needed_actual',
        'qty_work_confirmed',
        'qty_work_confirmed_date',
        'qty_work_done_date',
    ];

    protected $casts = [
        'logs'                => 'array',
        'approvals'           => 'array',
        'is_archived'         => 'integer',
        'estCost'             => 'integer',
        'actCost'             => 'integer',
        'quantity'            => 'integer',
        'qty_needed'          => 'integer',
        'qty_stock'           => 'integer',
        'qty_stock_target'    => 'integer',
        'part_price_new'      => 'float',
        'repair_duration'     => 'integer',
        'repair_cost_per_day' => 'float',
        'qty_needed_target'   => 'integer',
        'qty_needed_actual'   => 'integer',
        'qty_work_confirmed'  => 'integer',
    ];
}

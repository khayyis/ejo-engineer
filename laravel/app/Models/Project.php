<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';
    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'title',
        'dept',
        'budget',
        'targetDate',
        'pic',
        'desc',
        'phase',
        'approvals',
        'docs',
        'pr_percent',
        'po_percent',
        'gr_percent',
        'no_io',
        'no_moc',
        'execution_docs',
        'custom_status',
        'handover_docs',
        'handover_approvals',
        'drawing_id',
        'drawing_file',
        'is_review_only',
        'pr_total_items',
        'pr_ready_stock',
        'pr_all_material',
        'timeline',
    ];

    protected $casts = [
        'approvals'          => 'array',
        'docs'               => 'array',
        'execution_docs'     => 'array',
        'handover_docs'      => 'array',
        'handover_approvals' => 'array',
        'budget'             => 'integer',
        'phase'              => 'integer',
        'is_review_only'     => 'integer',
        'pr_percent'         => 'integer',
        'po_percent'         => 'integer',
        'gr_percent'         => 'integer',
        'pr_total_items'     => 'integer',
        'pr_ready_stock'     => 'integer',
        'pr_all_material'    => 'integer',
    ];
}

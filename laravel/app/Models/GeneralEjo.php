<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class GeneralEjo extends Model {
    protected $table = 'general_ejos';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id','title','dept','category','priority','location','targetDate','estDate','status','engineer','estCost','actCost','description','logs','requester','is_archived','approvals','createdDate','mid','part_price_new','repair_duration','repair_cost_per_day'];
    protected $casts = ['logs' => 'array', 'approvals' => 'array', 'is_archived' => 'boolean', 'estCost' => 'integer', 'actCost' => 'integer', 'part_price_new' => 'float', 'repair_duration' => 'integer', 'repair_cost_per_day' => 'float'];
}

<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class RepairPart extends Model {
    protected $table = 'repair_parts';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id','name','code','stock','location','ejo_id','description','image','price','cost_saving','original_price'];
    protected $casts = ['stock' => 'integer', 'price' => 'float', 'cost_saving' => 'float', 'original_price' => 'float'];
}

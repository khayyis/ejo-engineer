<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Drawing extends Model {
    protected $table = 'drawings';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id','ejo_id','title','file_path','uploader','uploaded_at','status','approvals','logs','dept','category','priority','location','targetDate','description','requester','engineer','estDate','drawing_type','sub_status'];
    protected $casts = ['logs' => 'array', 'approvals' => 'array'];
}

<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Project extends Model {
    protected $table = 'projects';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id','title','dept','budget','targetDate','pic','desc','custom_status','phase','approvals','docs','execution_docs','drawing_id','drawing_file','is_review_only','pr_percent','po_percent','gr_percent'];
    protected $casts = ['approvals' => 'array', 'docs' => 'array', 'execution_docs' => 'array', 'budget' => 'integer', 'phase' => 'integer', 'is_review_only' => 'integer', 'pr_percent' => 'integer', 'po_percent' => 'integer', 'gr_percent' => 'integer'];
}

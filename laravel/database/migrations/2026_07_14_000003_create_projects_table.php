<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('dept')->nullable();
            $table->bigInteger('budget')->nullable()->default(0);
            $table->string('targetDate')->nullable();
            $table->string('pic')->nullable();
            $table->text('desc')->nullable();
            $table->integer('phase')->default(1);
            $table->text('approvals')->nullable();
            $table->text('docs')->nullable();
            $table->integer('pr_percent')->default(0);
            $table->integer('po_percent')->default(0);
            $table->integer('gr_percent')->default(0);
            $table->string('no_io')->nullable();
            $table->string('no_moc')->nullable();
            $table->text('execution_docs')->nullable();
            $table->string('custom_status')->nullable();
            $table->text('handover_docs')->nullable();
            $table->text('handover_approvals')->nullable();
            $table->string('drawing_id')->nullable();
            $table->string('drawing_file')->nullable();
            $table->integer('is_review_only')->default(0);
            $table->integer('pr_total_items')->default(0);
            $table->integer('pr_ready_stock')->default(0);
            $table->integer('pr_all_material')->default(0);
            $table->text('timeline')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('general_ejos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('dept')->nullable();
            $table->string('category')->nullable();
            $table->string('priority')->nullable();
            $table->string('location')->nullable();
            $table->string('targetDate')->nullable();
            $table->string('estDate')->nullable();
            $table->string('status')->nullable();
            $table->string('engineer')->nullable();
            $table->bigInteger('estCost')->nullable()->default(0);
            $table->bigInteger('actCost')->nullable()->default(0);
            $table->text('description')->nullable();
            $table->text('logs')->nullable();
            $table->string('requester')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->text('approvals')->nullable();
            $table->string('createdDate')->nullable();
            $table->integer('quantity')->default(1);
            $table->integer('qty_needed')->default(0);
            $table->integer('qty_stock')->default(0);
            $table->string('usage_type')->default('Kebutuhan Mesin');
            $table->string('purpose')->default('Kebutuhan Mesin');
            $table->integer('qty_stock_target')->default(0);
            $table->string('mid')->nullable();
            $table->double('part_price_new')->default(0.0);
            $table->integer('repair_duration')->default(0);
            $table->double('repair_cost_per_day')->default(0.0);
            $table->text('photo_before')->nullable();
            $table->integer('qty_needed_target')->default(0);
            $table->integer('qty_needed_actual')->default(0);
            $table->integer('qty_work_confirmed')->default(0);
            $table->string('qty_work_confirmed_date')->nullable()->default('');
            $table->string('qty_work_done_date')->nullable()->default('');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('general_ejos');
    }
};

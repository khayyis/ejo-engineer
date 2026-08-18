<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_parts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('code')->nullable();
            $table->integer('stock')->default(0);
            $table->string('location')->nullable();
            $table->string('ejo_id')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->float('price')->default(0);
            $table->float('cost_saving')->default(0);
            $table->float('original_price')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_parts');
    }
};

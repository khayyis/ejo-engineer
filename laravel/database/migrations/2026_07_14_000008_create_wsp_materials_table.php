<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wsp_materials', function (Blueprint $table) {
            $table->string('material')->primary();
            $table->text('description')->nullable();
            $table->double('price')->default(0.0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wsp_materials');
    }
};

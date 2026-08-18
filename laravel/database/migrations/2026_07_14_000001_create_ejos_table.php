<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ejos', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('dept')->nullable();
            $table->string('category')->nullable();
            $table->string('priority')->nullable();
            $table->string('location')->nullable();
            $table->string('targetDate')->nullable();
            $table->string('status')->nullable()->default('Requested');
            $table->string('engineer')->nullable();
            $table->integer('estCost')->default(0);
            $table->integer('actCost')->default(0);
            $table->text('description')->nullable();
            $table->text('logs')->nullable();
            $table->string('requester')->nullable();
            $table->string('createdDate')->nullable();
            $table->string('mid')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ejos');
    }
};

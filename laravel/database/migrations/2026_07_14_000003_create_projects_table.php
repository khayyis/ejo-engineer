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
            $table->integer('budget')->default(0);
            $table->string('targetDate')->nullable();
            $table->string('pic')->nullable();
            $table->text('desc')->nullable();
            $table->integer('phase')->default(1);
            $table->text('approvals')->nullable();
            $table->text('docs')->nullable();
            $table->text('execution_docs')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

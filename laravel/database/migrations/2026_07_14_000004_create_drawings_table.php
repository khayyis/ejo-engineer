<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drawings', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('ejo_id')->nullable();
            $table->string('title');
            $table->string('file_path')->nullable();
            $table->string('uploader')->nullable();
            $table->string('uploaded_at')->nullable();
            $table->string('status')->default('Pending Foreman Approval');
            $table->text('approvals')->nullable();
            $table->text('logs')->nullable();
            $table->string('dept')->nullable();
            $table->string('category')->nullable();
            $table->string('priority')->default('Low');
            $table->string('location')->nullable();
            $table->string('targetDate')->nullable();
            $table->text('description')->nullable();
            $table->string('requester')->nullable();
            $table->string('engineer')->nullable();
            $table->string('estDate')->nullable();
            $table->string('drawing_type')->default('request');
            $table->string('sub_status')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drawings');
    }
};

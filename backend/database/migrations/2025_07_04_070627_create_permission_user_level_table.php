<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePermissionUserLevelTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    // backend/database/migrations/..._create_permission_user_level_table.php
public function up(): void
{
    Schema::create('permission_user_level', function (Blueprint $table) {
        $table->primary(['permission_id', 'user_level_id']); // Kunci utama gabungan
        $table->foreignId('permission_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_level_id')->constrained('tblUserLevel')->onDelete('cascade');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('permission_user_level');
    }
}

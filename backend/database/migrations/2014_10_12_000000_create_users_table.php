<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tblUser', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_induk_karyawan', 50)->unique();
            $table->string('nama_karyawan', 100);
            $table->string('username', 50)->unique();
            $table->string('password_hashed');
            $table->unsignedBigInteger('level_id');
            $table->string('status_karyawan', 20)->default('aktif'); // 'aktif' atau 'tidak aktif'
            $table->rememberToken();
            $table->timestamps();

            // Foreign Key ke tblUserLevel
            // BARIS YANG BENAR
            $table->foreign('level_id')->references('id')->on('tblUserLevel');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tblUser');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('tblUserDocument', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_user')->constrained('tblUser')->onDelete('cascade');
            $table->string('document_type'); // cth: 'foto_profil', 'scan_ktp'
            $table->string('file_path', 2048);
            $table->string('original_filename', 2048);
            $table->timestamps(); // created_at akan menjadi tanggal upload
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_documents');
    }
}

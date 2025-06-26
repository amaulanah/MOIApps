<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_user_profiles_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tblUserProfile', function (Blueprint $table) {
            $table->id();

            // Foreign Key ke tblUser
            $table->foreignId('id_user')->unique()->constrained('tblUser')->onDelete('cascade');

            // Kolom-kolom baru
             $table->dateTime('tanggal_lahir')->nullable(); // Ganti dari date()
            $table->dateTime('joint_date')->nullable();    // Ganti dari date()
            $table->string('nomor_telp_utama', 20)->nullable(); // Ganti dari bigint
            $table->string('no_telp_sekunder', 20)->nullable(); // Ganti dari bigint
            $table->string('email')->nullable();
            $table->text('alamat_ktp')->nullable();
            $table->text('alamat_saat_ini')->nullable();
            $table->string('pendidikan_terakhir')->nullable();

            // // Kolom untuk file
            // $table->string('file_foto_profil', 2048)->nullable();
            // $table->string('file_scan_ktp', 2048)->nullable();
            // $table->string('file_scan_ijazah', 2048)->nullable();
            // $table->string('file_scan_sim_c', 2048)->nullable();
            // $table->string('file_scan_sim_a', 2048)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tblUserProfile');
    }
};
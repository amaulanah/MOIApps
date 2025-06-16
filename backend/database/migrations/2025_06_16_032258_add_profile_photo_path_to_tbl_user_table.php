<?php
// database/migrations/xxxx_xx_xx_xxxxxx_add_profile_photo_path_to_tblUser_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tblUser', function (Blueprint $table) {
            // Tambahkan kolom baru setelah kolom 'password_hashed'
            $table->string('profile_photo_path', 2048)->nullable()->after('password_hashed');
        });
    }

    public function down(): void
    {
        Schema::table('tblUser', function (Blueprint $table) {
            $table->dropColumn('profile_photo_path');
        });
    }
};
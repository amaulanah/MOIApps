<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Temukan nama default constraint secara dinamis
        $constraintName = DB::table('sys.default_constraints')
            ->where('parent_object_id', '=', DB::raw("object_id('price_lists')"))
            ->where('parent_column_id', '=', DB::raw("columnproperty(object_id('price_lists'), 'quantity', 'ColumnId')"))
            ->value('name');

        // 2. Jika constraint ditemukan, jalankan perintah untuk menghapusnya
        if ($constraintName) {
            DB::statement("ALTER TABLE price_lists DROP CONSTRAINT [{$constraintName}]");
        }

        // 3. Setelah constraint dihapus, sekarang aman untuk mengubah tipe kolom
        Schema::table('price_lists', function (Blueprint $table) {
            $table->integer('quantity')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('price_lists', function (Blueprint $table) {
            $table->decimal('quantity', 15, 2)->default(0)->change();
        });
    }
};
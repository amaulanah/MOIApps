<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePriceListsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
{
    Schema::create('price_lists', function (Blueprint $table) {
        $table->id();
        $table->string('kode_part')->unique();
        $table->string('nama_part');
        $table->longText('deskripsi_part')->nullable();
        $table->decimal('quantity', 15, 2)->default(0);
        $table->string('uom'); // Unit of Measure
        $table->decimal('harga', 19, 2)->default(0);
        $table->string('mata_uang', 10);
        $table->string('kategori');
        $table->string('brand')->nullable();

        // Kolom untuk Foreign Key ke tabel suppliers
        $table->unsignedBigInteger('supplier_id')->nullable();
        $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('set null');

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
        Schema::dropIfExists('price_lists');
    }
}

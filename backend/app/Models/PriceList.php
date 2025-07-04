<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceList extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_part',
        'nama_part',
        'deskripsi_part',
        'quantity',
        'uom',
        'harga',
        'mata_uang',
        'kategori',
        'brand',
        'supplier_id',
    ];

    /**
     * Mendefinisikan relasi ke model Supplier.
     */
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
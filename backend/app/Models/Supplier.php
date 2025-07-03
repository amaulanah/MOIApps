<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    /**
     * Atribut yang bisa diisi secara massal.
     *
     * @var array
     */
    protected $fillable = [
        'kode_supplier',
        'nama_supplier',
        'nomor_telepon_supplier',
        'email_supplier',
        'alamat_supplier',
    ];
}
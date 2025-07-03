<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UserProfile extends Model
{
    use HasFactory;

    protected $table = 'tblUserProfile';

    // Izinkan semua kolom untuk diisi secara massal (mass assignable)
    protected $fillable = [
        'id_user',
        'tanggal_lahir',
        'joint_date',
        'nomor_telp_utama',
        'no_telp_sekunder',
        'email',
        'alamat_ktp',
        'alamat_saat_ini',
        'pendidikan_terakhir',
    ];


    protected $appends = ['file_foto_profil_url'];

    // Accessor untuk URL foto profil
    public function getFileFotoProfilUrlAttribute()
    {
        if ($this->file_foto_profil) {
            return asset('storage/' . $this->file_foto_profil);
        }
        // Jika tidak ada foto, kembalikan null atau URL default
        return null;
    }

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
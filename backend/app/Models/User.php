<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'tblUser';

    protected $fillable = [
        'nomor_induk_karyawan',
        'nama_karyawan',
        'username',
        'password_hashed',
        'level_id',
        'status_karyawan',
        'profile_photo_path',
    ];

    protected $hidden = [
        'password_hashed',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Selalu sertakan accessor ini saat model diubah menjadi array/JSON.
     */
    protected $appends = ['profile_photo_url'];

    // --- DEFINISI RELASI ---

    public function level()
    {
        return $this->belongsTo(UserLevel::class, 'level_id');
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'id_user', 'id');
    }

    public function documents()
    {
        // Satu User bisa memiliki banyak UserDocument
        return $this->hasMany(UserDocument::class, 'id_user', 'id');
    }
    // --- FUNGSI BAWAAN AUTH ---

    public function getAuthPassword()
    {
        return $this->password_hashed;
    }

    // --- DEFINISI ACCESSOR (Method yang Hilang) ---

    /**
     * Fungsi ini yang akan membuat atribut 'profile_photo_url'.
     * Pastikan nama fungsinya persis seperti ini.
     */
    public function getProfilePhotoUrlAttribute()
    {
        if ($this->profile_photo_path) {
            return Storage::disk('public')->url($this->profile_photo_path);
        }
        
        // Default avatar jika tidak ada foto
        return 'https://ui-avatars.com/api/?name='.urlencode($this->nama_karyawan).'&color=7F9CF5&background=EBF4FF';
    }
}
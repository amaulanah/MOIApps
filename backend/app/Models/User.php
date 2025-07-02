<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage; 
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'joint_date',
    ];

    protected $hidden = [
        'password_hashed',
        'remember_token',
    ];

    // Override default password field
    public function getAuthPassword()
    {
        return $this->password_hashed;
    }

    protected $visible = [
        'id',
        'nama_karyawan',
        'nomor_induk_karyawan',
        'username',
        'status_karyawan',
        'level',
        'profile',
        'profile_photo_url', // <-- KUNCI UTAMANYA DI SINI
        'joint_date',
    ];
    // ------------------------------------

    protected $appends = ['profile_photo_url'];

    public function level()
    {
        return $this->belongsTo(UserLevel::class, 'level_id');
    }

    public function profile() { return $this->hasOne(UserProfile::class, 'id_user'); }
    public function documents() { return $this->hasMany(UserDocument::class, 'id_user'); }
}

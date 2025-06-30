<?php
// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage; 

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

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

    public function level()
    {
        return $this->belongsTo(UserLevel::class, 'level_id');
    }

    public function profile() { return $this->hasOne(UserProfile::class, 'id_user'); }
    public function documents() { return $this->hasMany(UserDocument::class, 'id_user'); }
}

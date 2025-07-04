<?php

// app/Models/UserLevel.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLevel extends Model
{
    use HasFactory;
    protected $table = 'tblUserLevel';
    protected $fillable = ['user_level'];

    public function users()
    {
        return $this->hasMany(User::class, 'level_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user_level');
    }
}
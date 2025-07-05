<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password_hashed) || $user->status_karyawan !== 'aktif') {
            return response()->json(['message' => 'Username atau Password salah atau akun tidak aktif.'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // PERUBAHAN: Selalu load semua relasi penting saat login
        $user->load(['level.permissions', 'profile', 'documents']);

        return response()->json([
            'message'      => 'Login berhasil',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ]);
    }

    public function user(Request $request)
    {
        // PERUBAHAN: Selalu load semua relasi penting saat refresh
        return $request->user()->load(['level', 'profile', 'documents']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil']);
    }
}
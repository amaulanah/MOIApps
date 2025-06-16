<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules as PasswordRules;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return User::with('level')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nomor_induk_karyawan' => 'required|string|max:50|unique:tblUser',
            'nama_karyawan' => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:tblUser',
            'level_id' => 'required|exists:tblUserLevel,id',
            'status_karyawan' => 'required|string|in:aktif,tidak aktif',
            'joint_date' => 'required|date',
            'password' => ['required', 'confirmed', PasswordRules\Password::defaults()],
        ]);

        $user = User::create([
            'nomor_induk_karyawan' => $validatedData['nomor_induk_karyawan'],
            'nama_karyawan' => $validatedData['nama_karyawan'],
            'username' => $validatedData['username'],
            'level_id' => $validatedData['level_id'],
            'status_karyawan' => $validatedData['status_karyawan'],
            'joint_date' => $validatedData['joint_date'],
            'password_hashed' => Hash::make($validatedData['password']),
        ]);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user->load('level');
    }

    /**
     * Update the specified resource in storage.
     * --- INI FUNGSI YANG HILANG DAN PERLU DITAMBAHKAN ---
     */
    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'nomor_induk_karyawan' => ['required', 'string', 'max:50', Rule::unique('tblUser')->ignore($user->id)],
            'nama_karyawan' => 'required|string|max:100',
            'username' => ['required', 'string', 'max:50', Rule::unique('tblUser')->ignore($user->id)],
            'level_id' => 'required|exists:tblUserLevel,id',
            'status_karyawan' => 'required|string|in:aktif,tidak aktif',
            'joint_date' => 'required|date',
            'password' => ['nullable', 'confirmed', PasswordRules\Password::defaults()],
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'delete_photo' => 'nullable|boolean',
        ]);

        // Update data teks
        $user->fill($request->except(['password', 'photo', 'delete_photo']));

        // Update password jika diisi
        if (!empty($validatedData['password'])) {
            $user->password_hashed = Hash::make($validatedData['password']);
        }

        // Logika untuk menghapus foto jika dicentang
        if ($request->input('delete_photo') == 'true' || $request->input('delete_photo') == 1) {
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
                $user->profile_photo_path = null;
            }
        }

        // Logika untuk upload foto baru (akan menimpa foto lama jika ada)
        if ($request->hasFile('photo')) {
            // Hapus foto lama sebelum upload yang baru
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }
            $path = $request->file('photo')->store('profile-photos', 'public');
            $user->profile_photo_path = $path;
        }

        $user->save();

        return response()->json($user->load('level'));
    }

    /**
     * Remove the specified resource from storage.
     * --- INI JUGA SEBAIKNYA DITAMBAHKAN UNTUK FUNGSI HAPUS ---
     */
    public function destroy(User $user)
    {
        // Jangan hapus user admin
        if ($user->level && $user->level->user_level === 'admin') {
            return response()->json(['message' => 'User admin tidak dapat dihapus.'], 403);
        }

        // Hapus foto profil jika ada
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $user->delete();

        return response()->json(null, 204);
    }
}
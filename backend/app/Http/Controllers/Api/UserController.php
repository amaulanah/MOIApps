<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua user.
     * GET /api/users
     */
    public function index()
    {
        // Ambil semua user beserta data levelnya untuk menghindari N+1 problem
        $users = User::with('level')->orderBy('nama_karyawan', 'asc')->get();
        return response()->json($users);
    }

    /**
     * Menyimpan user baru ke database.
     * POST /api/users
     */
    public function store(Request $request)
    {
        // Validasi data yang masuk
        $validatedData = $request->validate([
            'nomor_induk_karyawan' => 'required|string|max:50|unique:tblUser,nomor_induk_karyawan',
            'nama_karyawan'        => 'required|string|max:100',
            'username'             => 'required|string|max:50|unique:tblUser,username',
            'password'             => 'required|string|min:6', // Password wajib saat membuat user baru
            'level_id'             => 'required|integer|exists:tblUserLevel,id',
            'status_karyawan'      => ['required', Rule::in(['aktif', 'tidak aktif'])],
            'joint_date'           => 'required|date',
        ]);

        // Buat user baru
        $user = User::create([
            'nomor_induk_karyawan' => $validatedData['nomor_induk_karyawan'],
            'nama_karyawan'        => $validatedData['nama_karyawan'],
            'username'             => $validatedData['username'],
            'password_hashed'      => Hash::make($validatedData['password']), // Hash password!
            'level_id'             => $validatedData['level_id'],
            'status_karyawan'      => $validatedData['status_karyawan'],
            'joint_date'           => $validatedData['joint_date'],
        ]);
        
        // Kembalikan response dengan data user yang baru dibuat beserta levelnya
        return response()->json($user->load('level'), 201); // 201 = Created
    }

    /**
     * Menampilkan detail satu user.
     * GET /api/users/{id}
     */
    public function show(User $user)
    {
        // Kembalikan data user beserta levelnya
        return response()->json($user->load('level'));
    }

    /**
     * Memperbarui data user yang ada.
     * PUT /api/users/{id}
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
        'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        
        // Validasi untuk foto dan opsi penghapusan
        'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Max 2MB
        'delete_photo' => 'nullable|boolean',
    ]);

    // Update data teks
    $user->nomor_induk_karyawan = $validatedData['nomor_induk_karyawan'];
    $user->nama_karyawan = $validatedData['nama_karyawan'];
    $user->username = $validatedData['username'];
    $user->level_id = $validatedData['level_id'];
    $user->status_karyawan = $validatedData['status_karyawan'];
    $user->joint_date = $validatedData['joint_date'];

    // Update password jika diisi
    if (!empty($validatedData['password'])) {
        $user->password_hashed = Hash::make($validatedData['password']);
    }

    // Logika untuk menghapus foto jika dicentang
    if ($request->input('delete_photo')) {
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
     * Menghapus user dari database.
     * DELETE /api/users/{id}
     */
    public function destroy(User $user)
    {
        // PROTEKSI BARU: Cek apakah level user yang akan dihapus adalah 'admin'
        if ($user->level && $user->level->user_level === 'admin') {
            return response()->json(['message' => 'Akun Administrator Utama tidak dapat dihapus.'], 403); // 403 = Forbidden
        }
        // Tambahkan proteksi agar user tidak bisa menghapus dirinya sendiri
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Anda tidak dapat menghapus akun Anda sendiri.'], 403); // 403 = Forbidden
        }

        $user->delete();

        return response()->json(null, 204); // 204 = No Content
    }
}
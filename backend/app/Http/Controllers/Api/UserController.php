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
    public function index()
    {
        // Ambil semua user beserta relasi level dan profilnya
        $users = User::with(['level', 'profile'])->get();
        return $users;
    }

    public function store(Request $request)
    {
        // Logika store Anda sudah benar, tidak perlu diubah
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
            'nama_karyawan' => $validatedData['nama_karyawan'],
            'nomor_induk_karyawan' => $validatedData['nomor_induk_karyawan'],
            'username' => $validatedData['username'],
            'password_hashed' => Hash::make($validatedData['password']),
            'level_id' => $validatedData['level_id'],
            'status_karyawan' => $validatedData['status_karyawan'],
        ]);
        
        $user->profile()->create([
            'joint_date' => $validatedData['joint_date']
        ]);

        return response()->json($user->load(['level', 'profile']), 201);
    }
    
    public function show(User $user)
    {
        return $user->load(['level', 'profile']);
    }

public function update(Request $request, User $user)
{
    // 1. Persiapkan dan Validasi data
    $request->merge([
        'delete_photo' => filter_var($request->input('delete_photo'), FILTER_VALIDATE_BOOLEAN),
    ]);

    $validatedData = $request->validate([
        'nama_karyawan' => 'sometimes|required|string|max:100',
        'username' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('tblUser')->ignore($user->id)],
        'joint_date' => 'sometimes|required|date',
        'password' => ['nullable', 'confirmed', PasswordRules\Password::defaults()],
        'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'delete_photo' => 'nullable|boolean',
        // Tambahkan validasi untuk dokumen lain, buat menjadi nullable
        'scan_ktp' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'scan_ijazah' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'scan_sim_a' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'scan_sim_c' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
    ]);

    // 2. Update data user & profile (logika ini sudah benar)
    $user->update($request->only(['nama_karyawan', 'username']));
    if (!empty($validatedData['password'])) {
        $user->password_hashed = Hash::make($validatedData['password']);
    }
    if ($request->has('joint_date')) {
         $user->profile()->updateOrCreate(['id_user' => $user->id], ['joint_date' => $validatedData['joint_date']]);
    }

    // 3. Handle foto profil (logika ini sudah benar)
    if ($validatedData['delete_photo'] ?? false) { /* ... */ }
    if ($request->hasFile('photo')) {
        if ($user->profile_photo_path) { Storage::disk('public')->delete($user->profile_photo_path); }
        $path = $request->file('photo')->store('profile-photos', 'public');
        $user->profile_photo_path = $path;
    }

    // --- TAMBAHKAN LOGIKA BARU UNTUK DOKUMEN LAIN DI SINI ---
    $documentTypes = ['scan_ktp', 'scan_ijazah', 'scan_sim_a', 'scan_sim_c'];

    foreach ($documentTypes as $type) {
        if ($request->hasFile($type)) {
            // Buat nama folder berdasarkan tipe dokumen, contoh: documents/scan_ktp
            $folder = 'documents/' . $type;
            
            $file = $request->file($type);
            $originalName = $file->getClientOriginalName();
            // Simpan file ke storage
            $path = $file->store($folder, 'public');

            // Buat atau update record di tabel tblUserDocument
            $user->documents()->updateOrCreate(
                [
                    'document_type' => $type, // Cari berdasarkan tipe
                ],
                [
                    'file_path' => $path, // Data untuk di-update atau dibuat
                    'original_filename' => $originalName,
                ]
            );
        }
    }
    // --- AKHIR BLOK BARU ---

    // Simpan semua perubahan pada model User (seperti profile_photo_path)
    $user->save();

    // Kembalikan data user yang sudah lengkap dengan semua relasi
    return response()->json($user->fresh()->load(['level', 'profile', 'documents']));
}

    public function destroy(User $user)
    {
        // Logika destroy Anda sudah benar, tidak perlu diubah
        if ($user->level && $user->level->user_level === 'admin') {
            return response()->json(['message' => 'User admin tidak dapat dihapus.'], 403);
        }
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }
        $user->delete();
        return response()->json(null, 204);
    }
}
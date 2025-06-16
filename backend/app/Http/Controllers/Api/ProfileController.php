<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;


class ProfileController extends Controller
{
    /**
     * Update detail utama user (username/password)
     */
    public function updateAuthDetails(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'username' => ['required', 'string', 'max:50', Rule::unique('tblUser')->ignore($user->id)],
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $user->username = $validatedData['username'];
        if (!empty($validatedData['password'])) {
            $user->password_hashed = Hash::make($validatedData['password']);
        }
        $user->save();

        // Kembalikan user dengan profilnya
        return response()->json($user->load('profile'));
    }
    
    /**
     * Update atau buat data profil user.
     */
    public function updateProfileDetails(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'tanggal_lahir' => 'nullable|date',
            'nomor_telp_utama' => 'nullable|numeric',
            'no_telp_sekunder' => 'nullable|numeric',
            'email' => 'nullable|email',
            'alamat_ktp' => 'nullable|string',
            'alamat_saat_ini' => 'nullable|string',
            'pendidikan_terakhir' => 'nullable|string',
            // joint_date tidak divalidasi karena tidak bisa diubah
        ]);

        // Gunakan updateOrCreate untuk menangani user baru yang belum punya profil
        $user->profile()->updateOrCreate(
            ['id_user' => $user->id], // Kondisi pencarian
            $validatedData // Data untuk di-update atau di-create
        );

        // Jika user baru dan joint_date belum ada, set saat profil pertama kali dibuat
        if (!$user->profile->joint_date) {
            $user->profile->joint_date = now();
            $user->profile->save();
        }

        return response()->json($user->load('profile'));
    }

    public function uploadFile(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'type' => ['required', 'string', Rule::in(['foto_profil', 'scan_ktp', 'scan_ijazah', 'scan_sim_c', 'scan_sim_a'])]
        ]);
        
        $type = $validatedData['type'];
        $file = $request->file('file');

        // Logic untuk membuat nama file baru (Jawaban #3)
        $namaLengkap = Str::slug($user->nama_karyawan, ''); // ganti spasi jadi kosong
        $nik = $user->nomor_induk_karyawan;
        $timestamp = now()->format('YmdHis');
        $extension = $file->getClientOriginalExtension();
        $newFilename = "{$user->id}_{$nik}_{$namaLengkap}_{$timestamp}.{$extension}";

        // Logic untuk menyimpan ke folder terpisah (Jawaban #2)
        $path = $file->storeAs("documents/{$type}", $newFilename, 'public');

        // Buat record baru di tblUserDocument (Jawaban #4, menyimpan riwayat)
        $user->documents()->create([
            'document_type'     => $type,
            'file_path'         => $path,
            'original_filename' => $file->getClientOriginalName(),
        ]);
        
        // Load relasi terbaru untuk dikirim ke frontend
        $user->load(['profile', 'documents']);

        return response()->json($user);
    }

    /**
     * Hapus file spesifik berdasarkan ID-nya.
     */
    public function deleteFile(Request $request)
    {
        $user = $request->user();
        $validatedData = $request->validate([
            'document_id' => 'required|integer|exists:tblUserDocument,id'
        ]);

        $document = $user->documents()->findOrFail($validatedData['document_id']);

        // Hapus file fisik dari storage
        Storage::disk('public')->delete($document->file_path);
        
        // Hapus record dari database
        $document->delete();

        $user->load(['profile', 'documents']);
        return response()->json($user);
    }
    
    /**
     * Ambil data user lengkap untuk profil.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user()->load(['profile', 'documents']);
        return response()->json($user);
    }
}
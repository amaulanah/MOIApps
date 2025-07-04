<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserLevel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserLevelController extends Controller
{
    /**
     * Menampilkan daftar semua level user.
     * GET /api/user-levels
     */
    public function index()
    {
        // return response()->json(UserLevel::orderBy('user_level', 'asc')->get());
        return UserLevel::with('permissions')->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_level' => 'required|string|unique:tblUserLevel',
            'permissions' => 'array|nullable' // Validasi bahwa permissions adalah array
        ]);

        $userLevel = UserLevel::create(['user_level' => $validatedData['user_level']]);

        // Sinkronkan permissions yang dipilih
        if (isset($validatedData['permissions'])) {
            $userLevel->permissions()->sync($validatedData['permissions']);
        }

        return response()->json($userLevel->load('permissions'), 201);
    }

    public function update(Request $request, UserLevel $userLevel)
    {
        $validatedData = $request->validate([
            'user_level' => ['required', 'string', Rule::unique('tblUserLevel')->ignore($userLevel->id)],
            'permissions' => 'array|nullable'
        ]);

        $userLevel->update(['user_level' => $validatedData['user_level']]);

        // Sinkronkan permissions yang dipilih
        $userLevel->permissions()->sync($validatedData['permissions'] ?? []);

        return response()->json($userLevel->load('permissions'));
    }

    /**
     * Menampilkan detail satu level user.
     * GET /api/user-levels/{id}
     */
    public function show(UserLevel $userLevel)
    {
        return response()->json($userLevel);
    }

        public function destroy(UserLevel $userLevel)
    {
        // Cek apakah ada user yang masih menggunakan level ini
        if ($userLevel->users()->count() > 0) {
            // Jika ada, kembalikan error dan jangan hapus
            return response()->json([
                'message' => 'Gagal menghapus! Role ini masih digunakan oleh user lain.'
            ], 409); // 409 Conflict
        }

        // Jika tidak ada user yang memakai, hapus role
        $userLevel->delete();

        // Kembalikan respons sukses tanpa konten
        return response()->json(null, 204);
    }

    /**
     * Memperbarui data level user.
     * PUT /api/user-levels/{id}
     */
    // public function update(Request $request, UserLevel $userLevel)
    // {
    //     // PROTEKSI BARU: Cek apakah level yang akan di-update adalah 'admin'
    //     if ($userLevel->user_level === 'admin') {
    //         return response()->json(['message' => 'Level Administrator tidak dapat diubah.'], 403); // 403 = Forbidden
    //     }
    //     $validatedData = $request->validate([
    //         'user_level' => ['required', 'string', 'max:50', Rule::unique('tblUserLevel')->ignore($userLevel->id)],
    //     ]);

    //     $userLevel->update($validatedData);

    //     return response()->json($userLevel);
    // }

    /**
     * Menghapus level user.
     * DELETE /api/user-levels/{id}
     */
    // public function destroy(UserLevel $userLevel)
    // {
    //     // PROTEKSI BARU: Cek apakah nama levelnya adalah 'admin'
    //     if ($userLevel->user_level === 'admin') {
    //         return response()->json(['message' => 'Level Administrator tidak dapat dihapus.'], 403);
    //     }
    //     // Proteksi: jangan hapus level jika masih ada user yang menggunakannya
    //     if ($userLevel->users()->exists()) {
    //         return response()->json(['message' => 'Tidak dapat menghapus level karena masih digunakan oleh user.'], 409); // 409 = Conflict
    //     }

    //     $userLevel->delete();

    //     return response()->json(null, 204);
    // }
}
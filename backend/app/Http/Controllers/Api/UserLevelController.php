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
        return response()->json(UserLevel::orderBy('user_level', 'asc')->get());
    }

    /**
     * Menyimpan level user baru.
     * POST /api/user-levels
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_level' => 'required|string|max:50|unique:tblUserLevel,user_level',
        ]);

        $userLevel = UserLevel::create($validatedData);

        return response()->json($userLevel, 201);
    }

    /**
     * Menampilkan detail satu level user.
     * GET /api/user-levels/{id}
     */
    public function show(UserLevel $userLevel)
    {
        return response()->json($userLevel);
    }

    /**
     * Memperbarui data level user.
     * PUT /api/user-levels/{id}
     */
    public function update(Request $request, UserLevel $userLevel)
    {
        // PROTEKSI BARU: Cek apakah level yang akan di-update adalah 'admin'
        if ($userLevel->user_level === 'admin') {
            return response()->json(['message' => 'Level Administrator tidak dapat diubah.'], 403); // 403 = Forbidden
        }
        $validatedData = $request->validate([
            'user_level' => ['required', 'string', 'max:50', Rule::unique('tblUserLevel')->ignore($userLevel->id)],
        ]);

        $userLevel->update($validatedData);

        return response()->json($userLevel);
    }

    /**
     * Menghapus level user.
     * DELETE /api/user-levels/{id}
     */
    public function destroy(UserLevel $userLevel)
    {
        // PROTEKSI BARU: Cek apakah nama levelnya adalah 'admin'
        if ($userLevel->user_level === 'admin') {
            return response()->json(['message' => 'Level Administrator tidak dapat dihapus.'], 403);
        }
        // Proteksi: jangan hapus level jika masih ada user yang menggunakannya
        if ($userLevel->users()->exists()) {
            return response()->json(['message' => 'Tidak dapat menghapus level karena masih digunakan oleh user.'], 409); // 409 = Conflict
        }

        $userLevel->delete();

        return response()->json(null, 204);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    /**
     * FUNGSI BARU: Untuk membuat kode supplier otomatis.
     */
    public function getNextCode()
    {
        // Cari supplier terakhir berdasarkan ID
        $lastSupplier = Supplier::latest('id')->first();
        $nextId = 1;

        if ($lastSupplier) {
            // Ambil nomor dari kode terakhir dan tambahkan 1
            $lastCode = $lastSupplier->kode_supplier;
            $lastNumber = (int) substr($lastCode, 4); // Mengambil angka setelah "SUPP"
            $nextId = $lastNumber + 1;
        }

        $newCode = 'SUPP' . $nextId;

        return response()->json(['next_code' => $newCode]);
    }

    public function index()
    {
        return Supplier::all();
    }

    /**
     * PERUBAHAN: Method store sekarang membuat kode supplier secara otomatis.
     */
    public function store(Request $request)
    {
        // Validasi, kode_supplier dihapus dari sini
        $validatedData = $request->validate([
            'nama_supplier' => 'required|string|max:255',
            'nomor_telepon_supplier' => 'nullable|string|max:20',
            'email_supplier' => 'nullable|email|unique:suppliers',
            'alamat_supplier' => 'nullable|string',
        ]);

        // Generate kode supplier di backend
        $lastSupplier = Supplier::latest('id')->first();
        $nextId = $lastSupplier ? ((int) substr($lastSupplier->kode_supplier, 4)) + 1 : 1;
        $validatedData['kode_supplier'] = 'SUPP' . $nextId;

        $supplier = Supplier::create($validatedData);
        return response()->json($supplier, 201);
    }

    public function show(Supplier $supplier)
    {
        return $supplier;
    }

    /**
     * PERUBAHAN: Method update sekarang melindungi kode_supplier agar tidak bisa diubah.
     */
    public function update(Request $request, Supplier $supplier)
    {
        // Validasi, kode_supplier dihapus dari sini
        $validatedData = $request->validate([
            'nama_supplier' => 'required|string|max:255',
            'nomor_telepon_supplier' => 'nullable|string|max:20',
            'email_supplier' => ['nullable', 'email', Rule::unique('suppliers')->ignore($supplier->id)],
            'alamat_supplier' => 'nullable|string',
        ]);
        
        // Hanya update field yang diizinkan, 'kode_supplier' akan diabaikan
        $supplier->update($validatedData);
        return response()->json($supplier);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(null, 204);
    }
}
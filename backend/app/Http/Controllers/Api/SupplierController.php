<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SupplierController extends Controller
{
    public function index()
    {
        return Supplier::all();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'kode_supplier' => 'required|string|unique:suppliers',
            'nama_supplier' => 'required|string|max:255',
            'nomor_telepon_supplier' => 'nullable|string|max:20',
            'email_supplier' => 'nullable|email|unique:suppliers',
            'alamat_supplier' => 'nullable|string',
        ]);

        $supplier = Supplier::create($validatedData);
        return response()->json($supplier, 201);
    }

    public function show(Supplier $supplier)
    {
        return $supplier;
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validatedData = $request->validate([
            'kode_supplier' => ['required', 'string', Rule::unique('suppliers')->ignore($supplier->id)],
            'nama_supplier' => 'required|string|max:255',
            'nomor_telepon_supplier' => 'nullable|string|max:20',
            'email_supplier' => ['nullable', 'email', Rule::unique('suppliers')->ignore($supplier->id)],
            'alamat_supplier' => 'nullable|string',
        ]);

        $supplier->update($validatedData);
        return response()->json($supplier);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(null, 204);
    }
}
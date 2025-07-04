<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PriceList;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PriceListController extends Controller
{
    public function getNextCode()
    {
        $lastItem = PriceList::latest('id')->first();
        $nextId = 1;
        if ($lastItem) {
            $lastCode = $lastItem->kode_part;
            $lastNumber = (int) substr($lastCode, 4);
            $nextId = $lastNumber + 1;
        }
        return response()->json(['next_code' => 'PART' . $nextId]);
    }

    public function index()
    {
        return PriceList::with('supplier')->latest()->get();
    }

    public function store(Request $request)
    {
        // Validasi, kita ubah 'required' menjadi 'nullable'
        $validatedData = $request->validate([
            'nama_part' => 'required|string|max:255',
            'deskripsi_part' => 'nullable|string',
            'quantity' => 'nullable|numeric|min:0',
            'uom' => 'nullable|string',
            'harga' => 'nullable|numeric|min:0',  
            'mata_uang' => 'required|string',
            'kategori' => 'required|string',
            'brand' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        // --- PENGKONDISIAN OTOMATIS (SOLUSI ANDA) ---
        // Jika quantity null atau tidak dikirim, set nilainya menjadi 0
        $validatedData['quantity'] = $validatedData['quantity'] ?? 0;
        // Jika harga null atau tidak dikirim, set nilainya menjadi 0
        $validatedData['harga'] = $validatedData['harga'] ?? 0;
        $validatedData['uom'] = $validatedData['uom'] ?? 'PCS';
        // ---------------------------------------------

        // Generate kode_part
        $lastItem = PriceList::latest('id')->first();
        $nextId = $lastItem ? ((int) substr($lastItem->kode_part, 4)) + 1 : 1;
        $validatedData['kode_part'] = 'PART' . $nextId;

        $priceList = PriceList::create($validatedData);
        return response()->json($priceList->load('supplier'), 201);
    }

    public function show(PriceList $priceList)
    {
        return $priceList->load('supplier');
    }

    public function update(Request $request, PriceList $priceList)
    {
        // Validasi, kita ubah 'required' menjadi 'nullable'
        $validatedData = $request->validate([
            'nama_part' => 'required|string|max:255',
            'deskripsi_part' => 'nullable|string',
            'quantity' => 'nullable|numeric|min:0', 
            'uom' => 'nullable|string',
            'harga' => 'nullable|numeric|min:0',   
            'mata_uang' => 'required|string',
            'kategori' => 'required|string',
            'brand' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        // --- PENGKONDISIAN OTOMATIS (SOLUSI ANDA) ---
        // Jika quantity null atau tidak dikirim, set nilainya menjadi 0
        $validatedData['quantity'] = $validatedData['quantity'] ?? 0;
        // Jika harga null atau tidak dikirim, set nilainya menjadi 0
        $validatedData['harga'] = $validatedData['harga'] ?? 0;
        $validatedData['uom'] = $validatedData['uom'] ?? 'PCS';
        // ---------------------------------------------

        $priceList->update($validatedData);
        return response()->json($priceList->load('supplier'));
    }
    public function updateStock(Request $request, PriceList $priceList)
        {
            // Validasi hanya untuk quantity dan uom
            $validatedData = $request->validate([
                'quantity' => 'present|numeric|min:0',
                'uom' => 'required|string',
            ]);

            // Update hanya field yang diizinkan
            $priceList->update($validatedData);

            // Kembalikan data yang sudah diupdate
            return response()->json($priceList->load('supplier'));
        }
    public function destroy(PriceList $priceList)
    {
        $priceList->delete();
        return response()->json(null, 204);
    }
}
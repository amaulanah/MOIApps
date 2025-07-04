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
        // Eager load relasi supplier untuk efisiensi
        return PriceList::with('supplier')->latest()->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_part' => 'required|string|max:255',
            'deskripsi_part' => 'nullable|string',
            'quantity' => 'required|numeric|min:0',
            'uom' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'mata_uang' => 'required|string',
            'kategori' => 'required|string',
            'brand' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        // Generate kode_part di backend
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
        $validatedData = $request->validate([
            'nama_part' => 'required|string|max:255',
            'deskripsi_part' => 'nullable|string',
            'quantity' => 'required|numeric|min:0',
            'uom' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'mata_uang' => 'required|string',
            'kategori' => 'required|string',
            'brand' => 'nullable|string|max:255',
            'supplier_id' => 'nullable|exists:suppliers,id',
        ]);

        $priceList->update($validatedData);
        return response()->json($priceList->load('supplier'));
    }

    public function destroy(PriceList $priceList)
    {
        $priceList->delete();
        return response()->json(null, 204);
    }
}
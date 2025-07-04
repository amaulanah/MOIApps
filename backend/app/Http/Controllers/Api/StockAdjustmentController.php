<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PriceList;
use Illuminate\Http\Request;

class StockAdjustmentController extends Controller
{
    /**
     * Update HANYA quantity dan uom untuk sebuah item PriceList.
     */
    public function update(Request $request, $id)
    {
        // 1. Cari data part secara manual berdasarkan ID
        $priceListItem = PriceList::find($id);

        if (!$priceListItem) {
            return response()->json(['message' => 'Data part tidak ditemukan.'], 404);
        }

        // 2. Validasi HANYA untuk quantity dan uom
        $validatedData = $request->validate([
            'quantity' => 'present|numeric|min:0',
            'uom' => 'required|string',
        ]);

        // 3. Update hanya field yang diizinkan
        $priceListItem->update($validatedData);

        // 4. Kembalikan data yang sudah diupdate
        return response()->json($priceListItem->load('supplier'));
    }
}
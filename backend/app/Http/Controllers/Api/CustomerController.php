<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function getNextCode()
    {
        $lastCustomer = Customer::latest('id')->first();
        $nextId = $lastCustomer ? ((int) substr($lastCustomer->kode_customer, 4)) + 1 : 1;
        return response()->json(['next_code' => 'CUST' . $nextId]);
    }

    public function index()
    {
        return Customer::latest()->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_customer' => 'required|string|max:255',
            'nomor_telepon_customer' => 'nullable|string|max:20',
            'email_customer' => 'nullable|email|unique:customers',
            'alamat_customer' => 'nullable|string',
        ]);

        $lastCustomer = Customer::latest('id')->first();
        $nextId = $lastCustomer ? ((int) substr($lastCustomer->kode_customer, 4)) + 1 : 1;
        $validatedData['kode_customer'] = 'CUST' . $nextId;

        $customer = Customer::create($validatedData);
        return response()->json($customer, 201);
    }

    public function show(Customer $customer)
    {
        return $customer;
    }

    public function update(Request $request, Customer $customer)
    {
        $validatedData = $request->validate([
            'nama_customer' => 'required|string|max:255',
            'nomor_telepon_customer' => 'nullable|string|max:20',
            'email_customer' => ['nullable', 'email', Rule::unique('customers')->ignore($customer->id)],
            'alamat_customer' => 'nullable|string',
        ]);

        $customer->update($validatedData);
        return response()->json($customer);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(null, 204);
    }
}
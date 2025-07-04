<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Daftar izin berdasarkan menu di aplikasi Anda
        $permissions = [
            ['name' => 'Akses Dasbor', 'slug' => 'view_dashboard'],
            ['name' => 'Manajemen Akun', 'slug' => 'manage_account_control'],
            ['name' => 'Halaman Work Order', 'slug' => 'work_order_page'],
            ['name' => 'Halaman Bill of Material', 'slug' => 'bill_of_material_page'],
            ['name' => 'Halaman Customer', 'slug' => 'customers_page'],
            ['name' => 'Halaman Purchase Request', 'slug' => 'purchase_request_page'],
            ['name' => 'Halaman Purchase Order', 'slug' => 'purchase_order_page'],
            ['name' => 'Halaman Supplier', 'slug' => 'suppliers_page'],
            ['name' => 'Halaman Price List', 'slug' => 'price_list_page'],
            ['name' => 'Halaman Master Part', 'slug' => 'master_parts_page'],
            ['name' => 'Halaman Incoming', 'slug' => 'incoming_page'],
            ['name' => 'Halaman Outgoing', 'slug' => 'outgoing_page'],
            ['name' => 'Halaman Return', 'slug' => 'return_page'],
            ['name' => 'Halaman Stock Adjustment', 'slug' => 'stock_adjustment_page'],
            ['name' => 'Halaman Balance Stock', 'slug' => 'balance_stock_page'],
        ];

        foreach ($permissions as $permission) {
            // Gunakan updateOrCreate untuk menghindari duplikasi
            Permission::updateOrCreate(
                ['slug' => $permission['slug']], // <-- Kondisi untuk mencari
                ['name' => $permission['name']]  // <-- Nilai untuk di-update atau dibuat
            );
        }
    }
}
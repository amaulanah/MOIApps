<?php
namespace App\Models;
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Daftar izin berdasarkan menu di aplikasi Anda
        $permissions = [
            ['name' => 'Dashboard Access Page', 'slug' => 'view_dashboard'],
            ['name' => 'Account Control Page', 'slug' => 'manage_account_control'],
            ['name' => 'Work Order Page', 'slug' => 'work_order_page'],
            ['name' => 'Bill of Material Page', 'slug' => 'bill_of_material_page'],
            ['name' => 'Customers Page', 'slug' => 'customers_page'],
            ['name' => 'Purchase Request Page', 'slug' => 'purchase_request_page'],
            ['name' => 'Purchase Order Page', 'slug' => 'purchase_order_page'],
            ['name' => 'Suppliers Page', 'slug' => 'suppliers_page'],
            ['name' => 'Price List Page', 'slug' => 'price_list_page'],
            ['name' => 'Master Parts Page', 'slug' => 'master_parts_page'],
            ['name' => 'Incoming Page', 'slug' => 'incoming_page'],
            ['name' => 'Outgoing Page', 'slug' => 'outgoing_page'],
            ['name' => 'Return Page', 'slug' => 'return_page'],
            ['name' => 'Stock Adjustment Page', 'slug' => 'stock_adjustment_page'],
            ['name' => 'Balance Stock Page', 'slug' => 'balance_stock_page'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
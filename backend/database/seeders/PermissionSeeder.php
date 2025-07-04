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
            ['name' => 'Akses Dasbor', 'slug' => 'view_dashboard'],
            ['name' => 'Manajemen Akun', 'slug' => 'manage_account_control'],
            ['name' => 'Manajemen Supplier', 'slug' => 'manage_suppliers'],
            ['name' => 'Manajemen Price List', 'slug' => 'manage_price_list'],
            ['name' => 'Manajemen Penyesuaian Stok', 'slug' => 'manage_stock_adjustment'],
            // Tambahkan izin lain jika perlu
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}
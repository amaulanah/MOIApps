<?php
// database/seeders/UserLevelSeeder.php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\UserLevel;

class UserLevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = ['admin', 'director', 'management', 'purchasing', 'manager', 'electrical', 'programmer', 'mechanical', 'sales', 'intern', 'other'];
        foreach ($levels as $level) {
            UserLevel::create(['user_level' => $level]);
        }
    }
}
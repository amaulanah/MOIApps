<?php

namespace App\Providers;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Laravel akan secara otomatis memberikan semua izin kepada user dengan level 'admin'
        Gate::before(function ($user, $ability) {
            if ($user->level->user_level === 'admin') {
                return true;
            }
        });

        // Hanya jalankan ini jika tabel permissions sudah ada (untuk menghindari error saat migrasi awal)
        if (Schema::hasTable('permissions')) {
            // Buat Gate untuk setiap permission yang ada di database
            foreach (Permission::all() as $permission) {
                Gate::define($permission->slug, function (User $user) use ($permission) {
                    // Cek apakah level user ini memiliki permission tersebut
                    return $user->level->permissions->contains($permission);
                });
            }
        }
    }
}
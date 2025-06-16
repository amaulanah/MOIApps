<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Gate untuk Dashboard (Bisa diakses semua user yang terautentikasi)
        Gate::define('access-dashboard', function (User $user) {
            return true; 
        });

        // Gate untuk Account Control (Hanya bisa diakses oleh Admin dan Director)
        Gate::define('access-account-control', function (User $user) {
            // Memanfaatkan relasi 'level' yang sudah kita buat di model User
            $userLevel = $user->level->user_level;
            return in_array($userLevel, ['admin', 'director']);
        });

        // Gate untuk Purchase Request (Bisa diakses semua)
        Gate::define('access-purchase-request', function (User $user) {
            return true;
        });
        
        // Gate untuk Purchase Order (Hanya Management dan Purchasing)
        // Admin dan Director juga kita ikutkan sebagai best practice
        Gate::define('access-purchase-order', function (User $user) {
            $userLevel = $user->level->user_level;
            return in_array($userLevel, ['admin', 'director', 'management', 'purchasing']);
        });

        // Gate untuk Master Part (Hanya Management dan Purchasing)
        Gate::define('access-master-part', function (User $user) {
            $userLevel = $user->level->user_level;
            return in_array($userLevel, ['admin', 'director', 'management', 'purchasing']);
        });
    }
}
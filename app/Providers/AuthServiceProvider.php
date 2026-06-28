<?php

namespace App\Providers;

use App\Models\User;
use App\Roles;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::before(Function (User $user, string $ability) {
            if ($user->hasRole(Roles::SuperAdmin)) return true;
        });

        Gate::define('admin', fn(User $user) => $user->hasRole(Roles::Admin));
        Gate::define('users', fn (User $user) => $user->hasRole(Roles::User));
        Gate::define('staff', fn(User $user) => $user->hasRole(Roles::Staff));  
    }
}

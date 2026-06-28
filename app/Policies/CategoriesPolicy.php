<?php

namespace App\Policies;

use App\Models\Categories;
use App\Models\User;
use App\Roles;

class CategoriesPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function before(User $user , string $ability) : bool|null {
        if($user->hasRole(Roles::SuperAdmin)) return true;
        return null;
    }

    public function viewAny(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(Categories $categories): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(Roles::Admin);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Categories $categories): bool
    {
        return $user->hasRole(Roles::Admin);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Categories $categories): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Categories $categories): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Categories $categories): bool
    {
        return false;
    }
}

<?php

namespace App;

enum Roles: string
{
    case SuperAdmin = 'superAdmin';
    case Admin = 'admin';
    case Staff = 'staff';
    case User = 'user';

    public function label(): string {
        return match($this) {
            Roles::SuperAdmin => 'Super Admin',
            Roles::Admin => 'Admin',
            Roles::Staff => 'Staff',
            Roles::User =>'User',
        };
    }
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Roles;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => Roles::class,
        ];
    }

    public function products() : HasMany {
        return $this->hasMany(Products::class);
    }

    public function address() : HasMany {
        return $this->hasMany(Address::class);
    }

    public function review() : HasMany {
        return $this->hasMany(Review::class);
    }

    public function profile() : HasOne {
        return $this->hasOne(Profile::class, 'user_id');
    }

    public function wishlist() : HasMany {
        return $this->hasMany(Wishlist::class, 'user_id');
    }

    public function hasRole(Roles|array $roles): bool {
        $roles = is_array($roles) ? $roles : [$roles];
        return in_array($this->role, $roles);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'label',
        'full_name',
        'phone',
        'address_line',
        'city',
        'state',
        'postal_code',
        'is_default',
    ];

    public function users() : BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function isDefault() : Attribute {
        return Attribute::make(
            set: fn ($value) => filter_var($value, FILTER_VALIDATE_BOOLEAN ) ? true : null,
        );
    }

    protected $casts = [
        'is_default' => 'boolean',
    ];
}

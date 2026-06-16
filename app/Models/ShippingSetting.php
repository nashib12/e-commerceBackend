<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingSetting extends Model
{
    protected $fillable = [
        'flat_rate_fee',
        'free_shipping_threshold',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

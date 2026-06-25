<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wishlist extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
    ];

    public function users() : BelongsTo{
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products() : BelongsTo{
        return $this->belongsTo(Products::class, 'product_id');
    }
}

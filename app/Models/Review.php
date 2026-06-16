<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'order_id',
        'rating',
        'comment',
        'is_approved',
    ];

    public function user() : BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products() : BelongsTo {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function orders() : BelongsTo {
        return $this->belongsTo(Orders::class, 'order_id');
    }
}

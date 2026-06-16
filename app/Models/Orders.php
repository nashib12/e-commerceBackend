<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Orders extends Model
{
    protected $fillable = [
        'user_id',
        'order_id',
        'coupon_code',
        'status',
        'subtotal',
        'discount_amount',
        'shipping_fee',
        'total',
        'notes',
    ];

    public function users() : BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products() :BelongsTo {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function coupons() :BelongsTO {
        return $this->belongsTo(Coupon::class, 'coupon_id');
    }

    public function orderItems () : HasMany {
        return $this->hasMany(OrderItems::class, 'order_id');
    }

    public function orderStatusHistories () : HasMany {
        return $this->hasMany(OrderStatusHistory::class, 'order_id');
    }

    public function reviews() : HasMany {
        return $this->hasMany(Review::class);
    }

    public static function booted() : void {
        static::creating(function (Orders $orders) {
            $orders->order_id = self::generateUniqueOrderNumber();
        });
    }

    private static function generateUniqueOrderNumber() : string {
        $datePart = now()->format('Ymd');
        $attempts = 0;
        
        do {
            $randomPart = mt_rand(1000, 9999);
            $orderNumber = "{$datePart}-{$randomPart}";
            $attempts++;
        } while(self::where('order_id', $orderNumber)->exists() && $attempts < 10);

        return $orderNumber;
    }
}
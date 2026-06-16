<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItems extends Model
{
    protected $fillable = [
        'order_id',
        'product_variant_id',
        'product_name',
        'variant_label',
        'unit_price',
        'quantity',
        'line_total',
    ];

    public function orders() : BelongsTo {
        return $this->belongsTo(Orders::class, 'order_id');
    }

    public function productVariants() : BelongsTo {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use function Illuminate\Support\now;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'sku',
        'price_override',
        'stock_qty',
        'low_stock_threshold',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];
    
    protected $hidden = ['product'];

    public function product() : BelongsTo {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function attributeValues() : BelongsToMany {
        return $this->belongsToMany(AttributeValue::class, 'attribute_value_product_variants', 'product_variant_id', 'attribute_value_id');
    }

    public function orderItems(): HasMany {
        return $this->hasMany(OrderItems::class, 'product_variant_id');
    }

    public static function booted(): void {
        static::creating(function ($productVariant) {
            if (empty($productVariant->sku)){
                $productVariant->sku = self::generateSku();
            }
        });
        //If deleting the row data fails then add this code
        // static::deleting( function (ProductVariant $productVariant) {
        //     $productVariant->attributeValues()->detach();
        // });
    } 

    private static function generateSku(): string {
        return strtoupper(Str::random(4).'-'.now()->format('ymd').'-'.rand(100, 999));
    }

    protected $appends = [
        'sales_amount'
    ];

    public function getSalesAmountAttribute() {
        $product = $this->product;
        if (!$product || !$product->sale_price || !$this->price_override) {
            return null;
        }
    
        return ($this->price_override - round($product->sale_price / 100 * $this->price_override));
    }

    protected function stockStatus(): Attribute {
        return Attribute::make( get: function() {
            if ($this->stock_qty === 0 ) {
                return 'Out of stock';
            }

            if ($this->stock_qty <= $this->low_stock_threshold) {
                return 'Low Stock';
            }

            return 'In stock';
        });
    }
}

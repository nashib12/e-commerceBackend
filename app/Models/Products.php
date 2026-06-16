<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Products extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'base_price',
        'sale_price',
        'is_active',
        'is_featured'
    ];

    public function categories() : BelongsTo {
        return $this->belongsTo(Categories::class, 'category_id');
    }

    public function productImage() : HasMany {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function productVariant() : HasMany {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }

    public function users() : HasMany {
        return $this->hasMany(User::class);
    }

    public function reviews() : HasMany {
        return $this->hasMany(Review::class);
    }

    public function primaryImage() : HasOne {
        return $this->hasOne(ProductImage::class, 'product_id')->whereNotNull('is_primary');
    }

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'sales_amount'
    ];

    public function getSalesAmountAttribute() {
        if (!$this->base_price || !$this->sale_price) {
            return null;
        }
        return ($this->base_price - ($this->sale_price / 100 * $this->base_price));
    }
}

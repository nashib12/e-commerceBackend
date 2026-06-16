<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AttributeValue extends Model
{
    protected $fillable = [
        'attribute_id',
        'value',
        'meta',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'meta' => 'array',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'image_url'
    ];

    public function getImageUrlAttribute() {
        return !empty($this->meta['swatch_image']) ? asset('storage/'.$this->meta['swatch_image']) : null;
    }

    public function attribute(): BelongsTo {
        return $this->belongsTo(Attributes::class, 'attribute_id');
    }

    public function productVariants(): BelongsToMany {
        return $this->belongsToMany(ProductVariant::class, 'attribute_value_product_variants', 'product_variant_id', 'attribute_value_id');
    } 

    public function getHexCodeAttribute(): ?string {
        return $this->meta['hex_code'] ?? null;
    }

    public function getSortPositionAttribute() : int {
        return $this->meta['sort_position'] ?? $this->display_order;
    }
}

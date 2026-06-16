<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'url',
        'is_primary',
        'sort_order'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        return $this->url ? asset('storage/'.$this->url) : null;
    }

    public function product() : BelongsTo {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public static function booted() : void {
        static::deleting(function ($productImage) {
            if($productImage->url){
                Storage::disk('public')->delete($productImage->url);
            }
        });
    }

    public function isPrimary() : Attribute {
        return Attribute::make(
            set: fn ($value) => $value === true ? true : null,
        );
    }
    
}

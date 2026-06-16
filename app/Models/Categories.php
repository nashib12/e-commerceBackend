<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Categories extends Model
{
    protected $fillable = [
        'parent_id',
        'title',
        'slug',
        'image',
        'is_active',
        'sort_order',
    ];

    public function parent(): BelongsTo {
        return $this->belongsTo(Categories::class, 'parent_id');
    } 

    public function children(): HasMany {
        return $this->hasMany(Categories::class, 'parent_id')->with(['children' => function ($query) {
            $query->where('is_active', true);
        }]);
    }

    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        return $this->image ? asset('storage/'.$this->image) : null;
    }

    protected static function booted () {
        static::creating(function ($categories) {
            $max = Categories::where('parent_id', $categories->parent_id)->max('sort_order');
            $categories->sort_order = $max ? $max + 1 : 1;
        });

        static::deleting(function ($categories) {
            if($categories->image){
                Storage::disk('public')->delete($categories->image);
            }
        });
    } 

    public function product(): HasMany {
        return $this->hasMany(Products::class, 'category_id');
    }

    protected $casts = [
        'is_active' => 'boolean',
    ];
}

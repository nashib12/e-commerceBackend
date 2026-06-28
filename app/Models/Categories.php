<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        return $this->hasMany(Categories::class, 'parent_id')->with(['parent','children' => function ($query) {
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
            $categories->slug = static::generateUniqueSlug($categories->title);
        });

        static::updating(function ($categories) {
            if($categories->isDirty('title')) {
                $categories->slug =  static::generateUniqueSlug($categories->title, $categories->id);
            }
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

    protected static function generateUniqueSlug(string $title, ?int $ignoreId = null): string {
        $base = Str::slug($title);
        $slug = $base;
        $count = 1;
        while( static::where('slug', $slug)->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function allChildren() : HasMany {
        return $this->hasMany(Categories::class, 'parent_id')->with('allChildren');
    }

    public function getAllDescendantIds() : array {
        $ids = [$this->id];

        $this->loadMissing('allChildren');

        foreach ($this->allChildren as $child) {
            $ids = array_merge($ids, $child->getAllDescendantIds());
        }

        return $ids;
    }
}

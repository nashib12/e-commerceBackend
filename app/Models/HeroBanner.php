<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class HeroBanner extends Model
{
    protected $fillable = [
        'title',
        'image',
        'is_active',
    ];

    protected $appends = [
        'image_url',
    ];

    public function getImageUrlAttribute() {
        return $this->image ? asset('storage/'.$this->image) : null;
    }

    protected static function booted(): void {
        static::deleting(function ($heroBanner) {
            if($heroBanner->image) {
                Storage::disk('public')->delete($heroBanner->image);
            }
        });
    }
}

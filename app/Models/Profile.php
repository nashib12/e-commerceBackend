<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'dob',
        'gender',
        'image',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        return $this->image ? asset('storage/'.$this->image) : null;
    }

    public function users() : BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function booted() : void {
        static::deleting(function ($profile) {
            if($profile->image) {
                Storage::disk('public')->delete($profile->image);
            }
        });
    }
}

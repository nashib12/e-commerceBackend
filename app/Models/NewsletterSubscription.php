<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsletterSubscription extends Model
{
    protected $fillable = [
        'email',
        'token',
        'status',
        'verified_at'
    ];

    public static function booted(): void {
        static::creating(function (NewsletterSubscription $newsletterSubscription) {
            $newsletterSubscription->token = Str::random(64);
        });
    }
}

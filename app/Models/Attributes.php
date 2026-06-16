<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attributes extends Model
{
    protected $fillable = [
        'name',
        'type',
        'meta',
        'is_active',
    ];

    protected $casts = [
        'meta' => 'array',
        'is_active' => 'boolean',
    ];

    public function attributeValue() : HasMany {
        return $this->hasMany(AttributeValue::class, 'attribute_id')
            ->where('is_active', true)->orderBy('display_order');
    }
}

<?php

namespace App\Services;

use App\Models\Attributes;
use Illuminate\Support\Arr;

class AttributeServices
{
    public function create(array $data): Attributes {
        return Attributes::create([
            'name' => $data['name'],
            'type' => $data['type'],
            'is_active' => $data['is_active'] ?? true,
            'meta' => $this->buildMeta($data['meta'] ?? []),
        ]);
    }

    public function update(Attributes $attributes, array $data) : Attributes {
        $attributes->update([
            'name' => $data['name'],
            'type' => $data['type'],
            'is_active' => $data['is_active'] ?? $attributes->is_active,
            'meta' => $this->buildMeta($data['meta'] ?? []),
        ]);

        return $attributes->fresh();
    }

    private function buildMeta(array $meta): array {
        return array_filter([
            'display_label' => Arr::get($meta, 'display_label'),
            'is_variant_forming' => Arr::get($meta, 'is_variant_forming', false),
            'is_filterable' => Arr::get($meta, 'is_filterable', false),
            'is_required'  => Arr::get($meta, 'is_required', false),
            'filter_display_type' => Arr::get($meta, 'filter_display_type'),
            'applicable_categories' => Arr::get($meta, 'applicable_categories', []),
            'sort_order' => Arr::get($meta, 'sort_order', []),
            'help_text' => Arr::get($meta, 'help_text'),
            'help_url' => Arr::get($meta, 'help_url'),
            'sku_key' => Arr::get($meta, 'sku_key')
                        ? strtoupper(Arr::get($meta, 'sku_key'))
                        : null,
        ], fn($value) => !is_null($value));
    }
}
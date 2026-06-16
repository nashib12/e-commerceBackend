<?php

namespace App\Services;

use App\Models\Attributes;
use App\Models\AttributeValue;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AttributeValueService {

    public function create(array $data) : AttributeValue {
        $attribute = Attributes::findOrFail($data['attribute_id']);
        
        $this->validateBusinessRules($attribute, $data);

        return AttributeValue::create($data);
    }

    public function update(AttributeValue $attributeValue, array $data) : AttributeValue {
        $this->validateBusinessRules($attributeValue->attribute, $data, $attributeValue);

        $attributeValue->update($data);

        return $attributeValue->fresh();
    }

    private function validateBusinessRules(Attributes $attribute, array $data, ?AttributeValue $existing = null) : void {
        $duplicate = AttributeValue::where('attribute_id', $attribute->id)->where('value', $data['value'])
                        ->when($existing, fn($q) => $q->where('id', '!=', $existing->id))->exists();
        if ($duplicate) {
            throw ValidationException::withMessages([
                'value' => "The value \"{$data['value']}\" already exists for attribute \"{$attribute->display_label}\".",
            ]);
        }

        if($attribute->type === 'color_swatch') {
            $hex = $data['meta']['hex_code'] ?? null;
            $image = $data['meta']['swatch_image'] ?? null;

            if (!$hex && !$image ) {
                throw ValidationException::withMessages([
                    'meta.hex_code' => 'A color swatch value must have either a hex code or a color swatch image.'
                ]);
            }

            if($image && isset($existing['swatch_image'])) {
                Storage::disk('public')->delete($existing['swatch_image']);
            }

            $meta = array_merge($data['meta'], ['swatch_image' => $image, ]);
        }

        if (isset($data['meta']['sort_position'])) {
            $positionTaken = AttributeValue::where('attribute_id', $attribute->id)->where('meta->sort_position', $data['meta']['sort_position'])
                            ->when($existing, fn($q) => $q->where('id', '!=', $existing->id))->exists();
        
            if($positionTaken) {
                throw ValidationException::withMessages([
                    'meta.sort_position' => 'This sort position is already taken by another value in this attribute.'
                ]);
            }
        }

    }
}
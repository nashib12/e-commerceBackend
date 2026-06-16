<?php

namespace App\Http\Requests;

use App\Models\Attributes;
use Illuminate\Contracts\Validation\ValidationRule;

class UpdateAttributeValueRequest extends StoreAttributeValueRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    private function baseRules(): array {
        return [
            'value' => 'sometimes|string|max:100',
            'display_order' => 'nullable|integer|max:0',
            'is_active' => 'nullable|boolean',
            'meta' => 'nullable|array',
        ];
    }

     protected function resolveAttribute(): ?Attributes {
        if (!$this->resolvedAttribute) {
            $attributeValue = $this->route('attribute_value');
            $this->resolvedAttribute = $attributeValue?->attribute;
        }
        return $this->resolvedAttribute;
    }
}

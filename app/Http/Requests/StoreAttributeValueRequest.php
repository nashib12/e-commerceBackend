<?php

namespace App\Http\Requests;

use App\Models\Attributes;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAttributeValueRequest extends FormRequest
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

    protected ?Attributes $resolvedAttribute = null;

    protected function resolveAttribute(): ?Attributes {
        if (!$this->resolvedAttribute) {
            $this->resolvedAttribute = Attributes::find($this->input('attribute_id'));
        }
        return $this->resolvedAttribute;
    }
    public function rules(): array
    {
        return array_merge(
            $this->baseRules(),
            $this->metaRules(),
        );
    }

    private function baseRules() : array {
        return [
            'attribute_id' => 'required|exists:attributes,id',
            'value' => 'required|string|max:100',
            'display_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
            'meta' => 'nullable|array'
        ];
    }

    private function metaRules() : array {
        $attribute = $this->resolveAttribute();

        if (!$attribute) {
            return [];
        }
        return match($attribute->type) {
            'color_swatch' => $this->colorSwatchMetaRules(),
            'select' => $this->selectMetaRules(),
            default => [],
        };
    }

    private function colorSwatchMetaRules(): array {
        return [
            'meta.hex_code' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'meta.swatch_image' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:2048',
        ];
    }

    private function selectMetaRules(): array {
        $attribute = $this->resolveAttribute();
        $isSizeAttr = $attribute && str_contains(strtolower($attribute->name), 'size');

        $rules = [ 
            'meta.sort_position' => 'nullable|integer|min:0',
         ];

         if ($isSizeAttr) {
            $rules = array_merge($rules, [
                'meta.equivalent_us' => 'nullable|string|max:10',
                'meta.equivalent_eu' => 'nullable|string|max:10',
                'meta.equivalent_uk' => 'nullable|string|max:10',
            ]);
         }
        return $rules;
    } 

    public function messages(): array {
        return [
            'meta.hex_code.regex' => 'Hex code must be a valid 6-digit hex color, e.g. #FF5733.',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAttributeRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100|unique:attributes,name',
            'type' => 'required|in:select,color_swatch,radio,text,number,boolean',
            'is_active' => 'boolean',
            'meta' => 'nullable|array',
            'meta.display_label' => 'nullable|string|max:100',
            'meta.is_variant_forming' => 'nullable|boolean',
            'meta.is_filterable' => 'nullable|boolean',
            'meta.is_required' => 'nullable|boolean',
            'meta.filter_display_type' => 'nullable|in:checkbox,button_group,color_swatch,range',
            'meta.applicable_categories.*' => 'string|max:50',
            'meta.sort_order' => 'nullable|array',
            'meta.sort_order.*' => 'string|max:20',
            'meta.help_text' => 'nullable|string|max:255',
            'meta.help_url' => 'nullable|string|max:255',
            'meta.sku_key' => 'nullable|string|max:10|alpha_num',
        ];
    }

    public function messages():array {
        return [
            'type.in' => 'Attribute type must be one of: select, color_swatch, radio, text, number, boolean.',
            'meta.filter_display_type.in' => 'Filter display type must be: checkbox, button_group, color_swatch or range.',
            'meta.sku_key.alpha_num' => 'SKU key must contain only numbers and letters.'
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateProductVariantRequest extends FormRequest
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
        $id = $this->route('productvariant');
        return [
            'product_id' => 'sometimes|exists:products,id',
            'sku' => ['nullable', 'string', Rule::unique('product_variants','sku')->ignore($id)],
            'price_override' => 'nullable|decimal:0,2|min:0|max:999999.99',
            'stock_qty' => 'integer|sometimes|min:0',
            'low_stock_threshold' => 'integer|sometimes|min:0',
            'attribute_values' => 'sometimes|array|max:2',
            'attribute_values.*' => 'exists:attribute_values,id',
        ];
    }

    public function messages() : array {
        return [
            'product_id.exists' => 'Selected id doesnot exists.',
            'price_override.min' => 'Price should be greater than 0.',
            'price_override.max' => 'Price cannot be gereater than 999999.99',
            'stock_qty.min' => 'Stock quantity should be greater than 0.', 
            'low_stock_threshold.integer' => 'Only integer value allowed.',
            'stock_qty.integer' => 'Only integer value allowed.',
            'low_stock_threshold.min' => 'Low stock threshold cannot be less than 0',
            'sku.unique' => 'The SKU already exists.'
        ];
    }

    protected function failedValidation(Validator $validator) : void {
        throw new HttpResponseException(
            response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}

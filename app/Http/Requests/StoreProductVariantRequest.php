<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductVariantRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'sku' => 'nullable|string|unique:product_variants,sku',
            'price_override' => 'nullable|decimal:0,2|min:0|max:999999.99',
            'stock_qty' => 'integer|required|min:0',
            'low_stock_threshold' => 'integer|required|min:0',
            'attribute_values' => 'required|array|max:2',
            'attribute_values.*' => 'exists:attribute_values,id',
        ];
    }

    public function messages() : array {
        return [
            'price_override.min' => 'Price should be greater than 0.',
            'price_override.max' => 'Price cannot be gereater than 999999.99',
            'stock_qty.required' => 'Stock quantity cannot be null.',
            'stock_qty.min' => 'Stock quantity should be greater than 0.', 
            'low_stock_threshold.integer' => 'Only integer value allowed.',
            'stock_qty.integer' => 'Only integer value allowed.',
            'low_stock_threshold.required' => 'Low stock threshold cannot be empty.',
            'low_stock_threshold.min' => 'Low stock threshold cannot be less than 0',
            'sku.unique' => 'The SKU already exists.',
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

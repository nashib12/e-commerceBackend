<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if (! $this->user()) {
            return false;
        }

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
            'coupon_code' => 'nullable|string',
            'notes' => 'nullable|string',
            'carts' => 'required|array|min:1',
            'carts.*.productId' => 'required|exists:products,id',
            'carts.*.items' => 'required|array|min:1',
            'carts.*.items.*.variantId' => 'required|exists:product_variants,id',
            'carts.*.items.*.quantity' => 'required|integer|min:1',    
        ];
    }

    public function messages(): array {
        return [
            'cart.min' => 'Add at least one item',
            'product_id.required' => 'Product id is required.',
            'product_id.exists' => 'Selected product does not exists.',
            'items.min' => 'Add at least one item.',
            'items.*.variantId.required' => 'Select a product variant.',
            'items.*.quantity.min' => 'Add at least one item.',
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

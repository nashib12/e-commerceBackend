<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateOrderRequest extends FormRequest
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
            'product_id' => 'sometimes|exists:products,id',
            'coupon_id' => 'nullable|exists:coupons,id',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|exists:product_variants,id',
            'items.*.quantiy' => 'required|integer|min:1',    
        ];
    }

    public function messages(): array {
        return [
            'product_id.exists' => 'Selected product does not exists.',
            'items.min' => 'Add at least one item.',
            'items.*.product_variant_id.required' => 'Select a product variant.',
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

<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;

class StoreCouponRequest extends FormRequest
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
            'code' => 'required|string|unique:coupons,code',
            'type' => ['required', Rule::in(['percentage', 'fixed'])],
            'value' => 'required|decimal:0,2|min:0|max:999999.99',
            'min_order_amount' => 'required|decimal:0,2|min:0|max:999999.99',
            'max_uses' => 'required|integer|min:0',
            'expires_at' =>'required|date|after_or_equal:today',
        ];
    }

    public function messages(): array {
        return [
            'code.required' => 'Coupon code is required.',
            'code.unique' => 'Coupon code already exists in the database.',
            'type.required' => 'Coupon type is required.',
            'type.in' => 'Selected item is invalid.',
            'min_order_amount.required' => 'Minimum order amount is required',
            'min_order_amount.min' => 'Minium order amount should be greater than 0.',
            'min_order_amount.max' => 'Minimum order amount cannot exceed 999999.99',
            'max_uses.required' => 'Maximum uses number is required for coupon.',
            'max_uses.min' => 'Maximum uses should be greater than 0.',
            'expires_at.after' => 'The expiery date should be set to future.',
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


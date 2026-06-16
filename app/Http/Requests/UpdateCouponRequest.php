<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class UpdateCouponRequest extends FormRequest
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
        $id = $this->route('coupon');

        return [
            'code' => ['sometimes', 'string', Rule::unique('coupons', 'code')->ignore($id)],
            'type' => ['sometimes', Rule::in(['percentage', 'fixed'])],
            'value' => 'sometimes|decimal:0,2|min:0|max:999999.99',
            'min_order_amount' => 'sometimes|decimal:0,2|min:0|max:999999.99',
            'max_uses' => 'sometimes|integer|min:0',
            'expires_at' =>'sometimes|date|after_or_equal:today',
        ];
    }

    public function messages(): array {
        return [
            'code.unique' => 'Coupon code already exists in the database.',
            'type.in' => 'Selected item is invalid.',
            'min_order_amount.min' => 'Minium order amount should be greater than 0.',
            'min_order_amount.max' => 'Minimum order amount cannot exceed 999999.99',
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

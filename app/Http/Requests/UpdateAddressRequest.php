<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateAddressRequest extends FormRequest
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
            'label' => 'sometimes|string|max:255',
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string',
            'address_line' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'is_default' => 'sometimes|boolean',
        ];
    }

    public function messages(): array {
        return [
            'label.max' => 'Label cannot be exceed 255 characters.',
            'full_name.max' => 'Full name cannot exceed 255 characters.',
            'address_line.max' => 'Address cannot exceed 255 characters.',
            'city.max' => 'City cannot exceed 255 characters.',
            'state.max' => 'State cannot exceed 255 characters.',
            'postal_code.max' => 'Postal code cannot exceed 20 characters.',
            'is_default.boolean' => 'Default type only allows boolean value.',
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

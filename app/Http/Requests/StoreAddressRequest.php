<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreAddressRequest extends FormRequest
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
            'label' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string',
            'address_line' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'is_default' => 'required|boolean',
        ];
    }

    public function messages(): array {
        return [
            'label.required' => 'Label is required.',
            'label.max' => 'Label cannot be exceed 255 characters.',
            'full_name.required' => 'Full name is required.',
            'full_name.max' => 'Full name cannot exceed 255 characters.',
            'phone.required' => 'Phone number is required/',
            'address_line.required' => 'Address is required.',
            'address_line.max' => 'Address cannot exceed 255 characters.',
            'city.required' => 'City name is required.',
            'city.max' => 'City cannot exceed 255 characters.',
            'state.required' => 'State name is required.',
            'state.max' => 'State cannot exceed 255 characters.',
            'postal_code.max' => 'Postal code cannot exceed 20 characters.',
            'is_default.required' => 'Default value is required',
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

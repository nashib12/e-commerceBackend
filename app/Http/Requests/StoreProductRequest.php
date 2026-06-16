<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreProductRequest extends FormRequest
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
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'base_price' => 'required|decimal:0,2|min:0|max:999999.99',
            'sale_price' => 'nullable|integer|min:0|max:100',
            'is_featured' => 'required|boolean',
        ];
    }

    public function messages(): array {
        return [
            'category_id.required' => 'Category id is requird.',
            'category_id.exists' => 'Selected category doenot exist in the database',
            'description.required' => 'Description is required.',
            'description.string' => 'Description must be type of string.',
            'base_price.required' => 'Base price cannot be null.',
            'base_price.min' => 'Base price cannot be less than 0.',
            'base_price.max' => 'Base price cannot exceed 999999.99',
            'sale_price.min' => 'Base price cannot be less than 0.',
            'sale_price.max' => 'Base price cannot exceed 100',
            'is_featured.boolean' => 'The feature type should be either true or false.',
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

<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateCategoryRequest extends FormRequest
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
            'parent_id' => 'nullable|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'image' => 'nullable|file|mimes:jpg,png,jpeg,webp|max:2048',
        ];
    }

    public function messages(): array {
        return [
            'parent_id.exists' => 'The selected id doesnot exists.',
            'title.string' => 'Title should be string',
            'title.max' => 'Title should not be more than 255 characters long.',
            'image.file' => 'Image should be file only.',
            'image.mimes' => 'Only jpg, png, jpeg and webp type allowed.',
            'image.max' => 'Image should not be greater than 2mb.'
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

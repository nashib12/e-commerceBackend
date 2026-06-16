<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreCategoryRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'image' =>'nullable|file|mimes:jpg,png,jpeg,webp|max:2048',
        ];
    }

    public function messages(): array {
        return [
            'parent_id.exists' => 'Selected categories doenot exist.',
            'title.required' => 'Title is required',
            'title.max' => 'Title cannot be long than 255 characters.',
            'image.file' => 'Image should be a file.',
            'image.mimes' => 'Only jpg, png, jpeg or webp format allowed.',
            'image.max' => 'Files cannot be larger than 2MB.'
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

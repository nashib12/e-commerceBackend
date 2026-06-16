<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttributeValueRequest;
use App\Http\Requests\UpdateAttributeValueRequest;
use App\Models\Attributes;
use App\Models\AttributeValue;
use App\Services\AttributeValueService;
use Illuminate\Http\Request;

class AttributeValueController extends Controller
{

    public function __construct(private AttributeValueService $attributeValueService) {}
    public function index() {
        
        return response()->json([
            'message' => 'Attrbiute value fetched successfully.',
            'data' => AttributeValue::with('attribute')->get(),
        ], 200);
    }

    public function show() {
        $attributes = Attributes::all()->flatmap(fn ($attribute) => $attribute->attributeValue);
        $grouped = $attributes->groupBy('attribute_id')->map(fn ($values) => 
            $values->unique('id')->values()->map(fn ($value) => [
                'id' => $value['id'],
                'value' => $value['value'],
                'meta' => $value['meta'],
            ]) );
        return response()->json([
            'message' => 'Attribute value fetched successfully',
            'data' => [
                'color' => $grouped->get(1, collect())->values()->toArray(),
                'sizes' => $grouped->get(2, collect())->values()->toArray(),
            ],
        ], 200);
    }

    public function create(StoreAttributeValueRequest $request) {
        // dd($request->all());
        $data = $request->validated();
        if($request->hasFile('meta.swatch_image')){
            $data['meta']['swatch_image'] = $request->file('meta.swatch_image')->store('attributes', 'public'); 
        }
        $this->attributeValueService->create($data);

        return response()->json([
            'message' => 'Attribute value added successfully.',
            'data' => AttributeValue::with('attribute')->get(),
        ], 200);
    }

    public function update(UpdateAttributeValueRequest $request, AttributeValue $attributeValue) {
        // dd($request->all());
        $this->attributeValueService->update($attributeValue, $request->validated());

        return response()->json([
            'message' => 'Attribute value updated successfully.',
            'data' => AttributeValue::with('attribute')->get(),
        ], 200);

    }

    public function destroy(AttributeValue $attributeValue) {
        $attributeValue->delete();

        return response()->json([
            'message' => 'Attrbiute value deleted successfully.'
        ], 200);
    }
}

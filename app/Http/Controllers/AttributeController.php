<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttributeRequest;
use App\Http\Requests\UpdateAttributeRequest;
use App\Models\Attributes;
use Illuminate\Http\Request;
use App\Services\AttributeServices;

class AttributeController extends Controller
{
    public function __construct(private AttributeServices $attributeServices) {}
    public function index() {
        $attribute = Attributes::select('id', 'name', 'type')->with(['attributeValue' => function ($query) {
            $query->select('id', 'value', 'attribute_id');
        }])->get();
        return response()->json([
            'message' => 'Attribute detail fetched successfully.',
            'data' => $attribute,
        ], 200);
    }

    public function create(StoreAttributeRequest $request) {
        // dd($request->all());
        $this->attributeServices->create($request->validated());

        return response()->json([
            'message' => 'Attribute created successfully.',
            'data' => Attributes::all(),
        ], 200);
    }

    public function update(UpdateAttributeRequest $request, Attributes $attribute){
        //  dd($request->all());
        $this->attributeServices->update($attribute, $request->validated());

        return response()->json([
            'message' => 'Attribute updated successfully',
            'data' => Attributes::all(),
        ], 200);
    }

    public function destroy(Attributes $attribute) {
        $attribute->delete();

        return response()->json([
            'message' => 'Attribute deleted successully.'
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductVariantRequest;
use App\Http\Requests\UpdateProductVariantRequest;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function index() {
        return response()->json([
            'message' => 'Data fetched successfully.',
            'data' => ProductVariant::with(['product', 'attributeValues'])->get(),
        ], 200);
    }

    public function create(StoreProductVariantRequest $request) {
        // dd($request->all());
        $validated = $request->validated();
        $result = ProductVariant::create($validated);

        if($request->has('attribute_values')){
            $result->attributeValues()->attach($request->attribute_values);
        }

        return response()->json([
            'message' => 'Product variant added successfully.',
            'data' => ProductVariant::with(['product', 'attributeValues'])->get(),
        ], 200);
    }

    public function update(UpdateProductVariantRequest $request, Productvariant $productvariant) {
        // dd($request->all());
        $validated = $request->validated();

        $productvariant->attributeValues()->sync($request->attribute_values ?? []);
        unset($validated['attribute_values']);

        $productvariant->update($validated);

        return response()->json([
            'message' => 'Product variant updated succsffully.',
            'data' => ProductVariant::with(['product', 'attributeValues'])->get(),
        ], 200);
    }

    public function destroy(ProductVariant $productvariant){
        $productvariant->delete();

        return response()->json([
            'message' => 'Product variant deleted successfully.'
        ], 200);
    }
}

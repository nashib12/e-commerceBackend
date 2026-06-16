<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use App\Models\Products;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    public function index(Products $product) {
        return response()->json([
            'message' => 'Product Image fetched successfully.',
            'data' => ProductImage::where('product_id', $product)->get(),
        ], 200);
    }
    public function show() {
        return response()->json([
            'message' => 'Product Image fetched successfully.',
            // 'data' => ProductImage::where('product_id', $product)->get(),
            'data' => ProductImage::all(),
        ], 200);
    }

    public function store(Request $request, Products $product){
        // dd($request->all());
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'file|mimes:jpg,png,jpeg,webp|max:2048',
            'primary_image_index' => 'nullable|integer',
        ]);

        $uploadedImages = [];

        foreach($request->file('images') as $index => $image){
            $path = $image->store('products', 'public');
             $uploadedImages[] = $product->productImage()->create([
                'url' => $path,
                'is_primary' => $index === (int) $request->primary_image_index ? true : false,
             ]);
        }

        return response()->json([
            'message' => 'Product image added successfully.',
            'data' => $uploadedImages,
        ], 200);
    }

    public function setPrimary(Products $product, ProductImage $image){
        $product->productImage()->update(['is_primary' => null]);
        $image->update(['is_primary' => true]);

        return response()->json([
            'message' => 'Primary image updated successfully',
            'data' => $product->load(['productImage', 'primaryImage']),
        ], 200);
    }

    public function removePrimary(ProductImage $image) {
        $image->update(['is_primary' => false]);
        return response()->json([
            'message' => 'Primary image removed successfully.'
        ], 200);
    }

    public function destroy(ProductImage $image){
        $image->delete();

        return response()->json([
            'message' => 'Image deleted successfully.',
        ]);
    }
}

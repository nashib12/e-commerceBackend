<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequset;
use App\Http\Resources\ProductResource;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected function generateSlug(string $title) : string {
        $slug = Str::slug($title);
        $original = $slug;
        $count = 1;

        while(Products::where('slug', $slug)->exists()) {
            $slug = $original.'-'.$count;
            $count++;
        }

        return $slug;
    }

    public function index() {
        return response()->json([
            'message' => 'Products data fetched successfully.',
            'data' => Products::with(['categories'])->get(),
        ], 200);
    }

    public function show() {
        $data = Products::select('id', 'name', 'base_price', 'sale_price', 'category_id', 'slug', 'is_featured')->where('is_active', true)
            ->with(['primaryImage:product_id,id,url', 'categories',])->paginate(5);
        return response()->json([
            'data' => $data,
        ], 200);
    }
    public function showFeatured() {
        $data = Products::select('id', 'name', 'base_price', 'sale_price', 'category_id', 'slug', 'is_featured')->where('is_active', true)
            ->where('is_featured', true)->with(['primaryImage:product_id,id,url', 'categories',])->paginate(3);
        return response()->json([
            'data' => $data,
        ], 200);
    }

    public function details($slug) {
        $product = Products::with(['productImage:product_id,id,url', 'categories:id,title', 'productVariant.attributeValues', 'primaryImage:id,product_id,url'])
                    ->where('slug', $slug)->where('is_active', true)
                    ->firstOrFail();
        return response()->json([
            'message' => 'Product detail fetched successfully.',
            'data' => new ProductResource($product),
        ], 200);
    }

    public function create(StoreProductRequest $request){
        $validated = $request->validated();

        $validated['slug'] = $this->generateSlug($validated['name']);

        Products::create($validated);

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => Products::with(['categories'])->get(),
        ], 200);
    }

    public function update(UpdateProductRequset $request, Products $product){
        $validated = $request->validated();

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => Products::with(['categories'])->get(),
        ], 200);
    }

    public function updateStatus(Request $request, Products $product){
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $product->update($validated);
        $status = $validated['is_active'] ? 'activated' : 'deactvated';

        return response()->json([
            'message' => "Product {$status} successfully",
            'data' => $product->is_active,
        ], 200);
    }


}

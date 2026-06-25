<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Products;
use Illuminate\Http\Request;

class FilterController extends Controller
{
    public function categoryFilter(string $slug) {
        // $data = Products::select('id', 'name', 'base_price', 'sale_price', 'is_featured', 'category_id', 'slug')
        //         ->where('slug', $slug)->where('is_active', true)
        //             ->with(['primaryImage:id,product_id,url', 'categories'])->paginate(5);
        $data = Categories::where('slug', $slug)->with(['product.primaryImage'])->paginate(5);

        return response()->json([
            'message' => 'Product fetched successfully',
            'data' => $data,
        ], 200);
    } 

    public function productFilter(int $id) {
        $ids = Categories::where('parent_id', $id)->orWhereIn('parent_id', function ($query) use ($id) {
            $query->select('id')->from('categories')->where('parent_id', $id);
        })->pluck('id')->push($id)->toArray();

        $data = Products::select('id', 'name', 'base_price', 'sale_price', 'is_featured', 'category_id', 'slug')
                ->whereIn('category_id', $ids)->where('is_active', true)->with(['primaryImage:id,product_id,url', 'categories'])->paginate(5);
        return response()->json([
            'message' => 'Product fetched successfully',
            'data' => $data,
        ], 200);
               
    }

    public function featuredProduct() {
        $data = Products::select('id', 'name', 'base_price', 'sale_price', 'is_featured', 'category_id', 'slug')
                ->where('is_featured', true)->where('is_active', true)->with(['primaryImage:id,product_id,url', 'categories'])->paginate(5);
        
        return response()->json([
            'message' => 'Product fetched successfully',
            'data' => $data,
        ], 200);       
    }

    public function filteredColor(int $id) {
       $data = Products::select('id', 'name', 'base_price', 'sale_price', 'is_featured', 'category_id', 'slug')
                ->where('is_active', true)->whereHas('productVariant.attributeValues', function ($query) use($id) {
                    $query->where('attribute_values.id', $id);
                })->with(['primaryImage:id,product_id,url', 'categories'])->paginate(5);
        
        return response()->json([
            'message' => 'Product fetched successfully',
            'data' => $data,
        ], 200);   
    }
}

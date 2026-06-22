<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{ 
    
    public function apiIndex() {
        $data = Categories::whereNull('parent_id')->where('is_active', true)->with(['children' => function ($query) {
            $query->where('is_active', true);
        }])->get();
        return response()->json([
            'message' => 'Category fetched successfully.',
            'data' => $data,
        ], 200);
    }
    public function index() {
        $data = Categories::with(['parent', 'children'])->get();
        return response()->json([
            'message' => 'Category fetched successfully.',
            'data' => $data,
        ], 200);
    }
    public function show() {
        return response()->json([
            'message' => 'Category fetched successfully.',
            'data' => Categories::whereNull('parent_id')->with('children')->get(),
        ], 200);
    }

    public function create(StoreCategoryRequest $request){
        $validated = $request->validated();

        if($request->hasFile('image')){
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        Categories::create($validated);

        return response()->json([
            'message' => 'Category added successfully.',
            'data' => Categories::with(['parent', 'children'])->get(),
        ], 200);
    }

    public function update(UpdateCategoryRequest $request, Categories $categories){
        $validated = $request->validated();
        if ($request->hasFile('image')){
            if($categories->image !== null ) {
                Storage::disk('public')->delete($categories->image);
            }
            $validated['image'] = $request->file('image')->store('categories', 'public');
        } else {
            unset($validated['image']);
        }

        $categories->update($validated);

        return response()->json([
            'message' => 'Category updated successfully.',
            'data' => Categories::with(['parent', 'children'])->get(),
        ], 200);
    }

    public function updateStatus(Request $request, Categories $categories){
        // dd($request->all());
        $validated = $request->validate([
            'is_active' => ['required', 'boolean'], 
        ]);

        $categories->update($validated);

        $categories->product()->update(['is_active' => $validated['is_active']]);

        $status = $validated['is_active'] ? 'activated' : 'deactivated';

        return response()->json([
            'message' => "Category {$status} successfully.",
            'data' => $categories->is_active,
        ], 200);
    }
}

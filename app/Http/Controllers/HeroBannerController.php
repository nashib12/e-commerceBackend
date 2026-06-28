<?php

namespace App\Http\Controllers;

use App\Models\HeroBanner;
use Illuminate\Http\Request;

class HeroBannerController extends Controller
{
    public function index() {
        $banner = HeroBanner::load('id' , 'title', 'image', 'is_active')->where('is_active', true)
                ->latest()->get();
        
        return response()->json([
            'message' => 'Banner fetched successfully',
            'data' => $banner,
        ]); 
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'file|required|mimes:jpg,jpeg,png,webp|max:5120',
            'is_active' => 'boolean|required',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('hero_banner', 'public');
        }

        HeroBanner::create($validated);

        return response()->json([
            'message' => 'Hero banner added successfully.',
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\WishlistResource;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        $wishlist = Wishlist::where('user_id', $user->id)->with('products.primaryImage')->get();

        return response()->json([
            'message' => 'Wishlist fetched successfully.',
            'data' => WishlistResource::collection($wishlist),
            // 'data' => $wishlist,
        ], 200);
    }
    public function create(Request $request){
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);
        $user = $request->user();

        $validated['user_id'] = $user->id;
        $result = Wishlist::create($validated);

        return response()->json([
            'message' => 'Product successfully added to the wishlist.',
            'data' => $result,
        ], 200);
    }

    public function destroy(Wishlist $wishlist){
        $wishlist->delete();

        return response()->json([
            'message' => 'Data deleted successfully.',
        ], 200);
    }
}

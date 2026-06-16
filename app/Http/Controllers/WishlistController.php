<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function create(Request $request){
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

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

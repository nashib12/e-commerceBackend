<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index() {
        return response()->json([
            'message' => 'Review data fetched successfully.',
            'data' => Review::with('user')->get(),
        ], 200);
    }

    public function create(Request $request) {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|max:5',
            'comment' => 'required|string'
        ]);

        $validated['user_id'] = auth()->id();

        $result = Review::create($validated);

        return response()->json([
            'message' => 'Review added successfully.',
            'data' => $result,
        ], 200);
    }

    public function update(Request $request, Review $review){
        if($review->user_id !== auth()->id()){
            abort(403, 'You are not allowed to update this reveiw.');
        }

        $validated = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'order_id' => 'sometimes|exists:orders,id',
            'rating' => 'sometimes|integer|max:5',
            'comment' => 'sometimes|string',
        ]);

        $review->update($validated);

        return response()->json([
            'message' => 'Review updated successfully.',
            'data' => $review,
        ], 200);
    }

    public function updateStatus(Request $request, Review $review){
        $validated = $request->validate([
            'is_approved' => 'required|boolean',
        ]);

        $review->update($validated);

        $status = $validated['is_approved'] ? 'activated' : 'deactivated';

        return response()->json([
            'message' => "Review {$status} successfully.",
            'data' => $review,
        ], 200);
    }

    public function destroy(Review $review) {
        if($review->user_id !== auth()->id()){
            abort(403, 'You are not allowed to delete this review.');
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully.',
        ], 200);
    }
}

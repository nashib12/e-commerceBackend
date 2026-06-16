<?php

namespace App\Http\Controllers;

use App\Models\ShippingSetting;
use Illuminate\Http\Request;

class ShippingFeeController extends Controller
{
    public function index() {
        return response()->json([
            'message' => 'Shipping fee details fetched.',
            'data' => ShippingSetting::all(),
        ], 200);
    }

    public function create(Request $request) {
        // dd($request->all());
        $validated = $request->validate([
            'flat_rate_fee' => 'required|decimal:0,2|min:0|max:999999.99',
            'free_shipping_threshold' => 'required|decimal:0,2|min:0|max:999999.99',
            'is_active' => 'nullable|boolean'
        ]);

        ShippingSetting::create($validated);

        return response()->json([
            'message' => 'Shipping fee added successfully.',
            'data' => ShippingSetting::all(),
        ], 200);
        
    }

    public function update(Request $request, ShippingSetting $fee) {
        $validated = $request->validate([
            'flat_rate_fee' => 'sometimes|decimal:0,2|min:0|max:999999.99',
            'free_shipping_threshold' => 'sometimes|decimal:0,2|min:0|max:999999.99',
            'is_active' => 'nullable|boolean'
        ]);

        $fee->update($validated);

        return response()->json([
            'message' => 'Shipping fee updated successfully',
            'data' => ShippingSetting::all(),
        ],200);
    }

    public function updateStatus(Request $request, ShippingSetting $fee) {
        $validated = $request->validate([
            'is_active' => 'reauired|boolean',
        ]);

        $fee->update($validated);
        $status = $validated['is_active'] ? 'activated' : 'deactivated';

        return response()->json([
            'message' => "Shipping fee {$status} successfully.",
        ], 200);
    }

    public function destroy(ShippingSetting $fee){
        $fee->delete();

        return response()->json([
            'message' => 'Shipping fee deleted successfully',
        ], 200);
    }
}

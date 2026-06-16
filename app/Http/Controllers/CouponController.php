<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCouponRequest;
use App\Http\Requests\UpdateCouponRequest;
use App\Models\Coupon;
use App\Services\CouponServices;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function __construct(private CouponServices $couponServices) {}

    public function index() {
        return response()->json([
            'message' => 'Coupon data fetched successfully.',
            'data' => Coupon::all(),
        ], 200);
    }

    public function create(StoreCouponRequest $request){
        $validated = $request->validated();
        $validated['used_count'] = 0;
        Coupon::create($validated);

        return response()->json([
            'message' => 'Coupon successfully created.',
            'data' => Coupon::all(),
        ], 200);
    }

    public function update(UpdateCouponRequest $request, Coupon $coupon){
        // dd($request->all());
        $coupon->update($request->validated());

        return response()->json([
            'message' => 'Coupon successfully updated.',
            'data' => Coupon::all(),
        ], 200);
    }

    public function destroy(Coupon $coupon){
        $coupon->delete();

        return response()->json([
            'message' => 'Coupon deleted successfully.'
        ], 200);
    }

    public function checkStatus(Request $request){
        // dd($request->all());
        $validated = $request->validate([
            'coupon' => 'required|string',
            'carts' => 'required|array|min:1',
            'carts.*.variantId' => 'required|exists:product_variants,id', 
            'carts.*.quantity' => 'required|integer|min:1',
            'carts.*.name' => 'string',
        ]); 

        $coupon = $this->couponServices->handleCoupon($validated);

        return response()->json([
            'message' => 'Coupon is valid.',
            'data' => $coupon
        ], 200);
    }

    public function updateStatus(Request $request, Coupon $coupon) {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $coupon->update($validated);

        $status = $validated['is_active'] ? 'activated' : 'deactivated';

        return response()->json([
            'message' => "Coupon {$status} successfully.",
            'data' => $coupon->is_active,
        ], 200);
    }
}

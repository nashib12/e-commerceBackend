<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Orders;
use App\Models\ProductVariant;
use App\Services\OrderServices;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function __construct(private OrderServices $orderServices) {}

    public function index() {
        return response()->json([
            'message' => 'Order detail fetched successfully',
            'data' => Orders::with('orderItems')->get(),
        ], 200);
    }

    public function create(StoreOrderRequest $request) {
        $validated = $request->validated();
        $id = $request->user()->id;
        $data = $this->orderServices->createOrder($validated, $id);
        return response()->json([
            'message' => 'Order created successfully',
            'data' => $data,
        ], 200);
    }

    public function checkStatus(Request $request) {
        $validated = $request->validate([
            'carts' => 'required|array|min:1',
            'carts.*.variantId' => 'required|exists:product_variants,id',
            'carts.*.quantity' => 'required|integer|min:1',
            'carts.*.name' => 'string',
        ]);

        $variantIds = collect($validated['carts'])->pluck('variantId');
        $variants = ProductVariant::whereIn('id', $variantIds)->get()->keyBy('id');

        foreach($validated['carts'] as $item){
            $variant = $variants->get($item['variantId']);
            if ($variant->stock_qty < $item['quantity']){
                throw ValidationException::withMessages([
                    'message' => 'Insufficient quantity for product: '.$item['name'].'.'
                ]);
            }
        }

        return response()->json([
            'message' => 'Product status validated successfully.'
        ], 200);
    }

    public function show() {
        $user = auth()->user();
        $order = Orders::where('user_id', $user->id)->with('orderItems')->get();

        return response()->json([
            'message' => 'Order fetched successfully',
            'data' => $order,
        ], 200);
    }
}

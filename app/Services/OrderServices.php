<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\Orders;
use App\Models\OrderStatusHistory;
use App\Models\Products;
use App\Models\ProductVariant;
use App\Models\ShippingSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderServices {
    public function createOrder (array $data) {
        return DB::transaction(function () use($data) {
            $total = 0;
            $orderItems = [];
            $discount = 0;
            foreach($data['carts'] as $cart) {
                $product = Products::findOrFail($cart['productId']);
                foreach($cart['items'] as $item) {
                    $variant = ProductVariant::lockForUpdate()->findOrFail($item['variantId']);
                    if ($variant->stock_qty < $item['quantity']) {
                        throw ValidationException::withMessages([
                            'message' => 'Insufficient product quantity.'
                        ]);
                    }

                    $price = $variant->sales_amount > 0 ? $variant->sales_amount : $variant->price_override;
                    $subTotal = $price * $item['quantity'];
                    $total += $subTotal; 
                    $variantLabel = "{$product->name}-{$variant->sku}";

                    $orderItems[] = [
                        'product_variant_id' => $variant['id'],
                        'product_name' => $product->name,
                        'variant_label' => $variantLabel,
                        'unit_price' => $price,
                        'quantity' => $item['quantity'],
                        'line_total' => $subTotal,
                    ];

                    $variant->decrement('stock_qty', $item['quantity']);
                }
            }
            if (!empty($data['coupon_code'])) {
                $discount = $this->validateCoupon($data['coupon'], $total);
            }

            $shippingFee = $this->getShippingFee($total);
            $subTotal = $total;
            $total = $total - $discount + $shippingFee;

            $order = Orders::create([
                'coupon_code' => $data['coupon_code'],
                'status' => 'pending',
                'subtotal' => $subTotal,
                'discount_amount' => $discount,
                'shipping_fee' => $shippingFee,
                'total' => $total,
                'notes' => $data['notes'],
            ]);

            $order->orderItems()->createMany($orderItems);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => 'pending',
                'note' => $data['notes'],
            ]);
            return $order;
        });
    }

    private function validateCoupon( string $data, float $total) : float {
        $coupon = Coupon::where('code', $data)->first();

        if(!$coupon) {
            throw ValidationException::withMessages([
                'message' => 'Invalid coupon code.'
            ]);
        }

        if($coupon->isExpired()){
            throw ValidationException::withMessages([
                'message' => 'Coupon has expired.'
            ]);
        }

        if($coupon->used_count >= $coupon->max_uses ){
            throw ValidationException::withMessages([
                'message' => 'Coupon has exceed its use limit.'
            ]);
        }

        if(!$coupon->is_active){
            throw ValidationException::withMessages([
                'message' => 'Coupon is currently inactive. Try again later.'
            ]);
        }

        if ($total < $coupon->min_order_amount) {
            throw ValidationException::withMessages([
                'coupon' => "Minumum order amount should be $ {$coupon->min_order_amount}."
            ]);
        }

        $coupon->increment('used_count', 1);

        return $coupon->type === 'percentage' ? round($coupon->value /  100 * $total, 2) : round($coupon->value, 2);
    }

    private function getShippingFee(float $total) : float {

        $shippingFee = ShippingSetting::firstWhere('is_active', true);
    
        return $shippingFee->free_shipping_threshold > $total ? $shippingFee->flat_rate_fee : 0;
    }

}
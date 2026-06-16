<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\ProductVariant;
use App\Models\ShippingSetting;
use Illuminate\Validation\ValidationException;

class CouponServices {
    public function handleCoupon($data) {
        $coupon = Coupon::where('code', $data['coupon'])->first();
        
        if(!$coupon) {
            throw ValidationException::withMessages([
                'coupon' => 'Invalid coupon code.'
            ]);
        }

        if($coupon->isExpired()){
            throw ValidationException::withMessages([
                'coupon' => 'Coupon has expired.'
            ]);
        }

        if($coupon->used_count >= $coupon->max_uses ){
            throw ValidationException::withMessages([
                'coupon' => 'Coupon has exceed its use limit.'
            ]);
        }

        if(!$coupon->is_active){
            throw ValidationException::withMessages([
                'coupon' => 'Coupon is currently inactive. Try again later.'
            ]);
        }

        $variantIds = collect($data['carts'])->pluck('variantId');
        $variants = ProductVariant::whereIn('id', $variantIds)->get()->keyBy('id');

        $subtotal = 0;

        foreach ($data['carts'] as $item) {
            $variant = $variants->get($item['variantId']);

            if ($variant->stock_qty < $item['quantity']) {
                throw ValidationException::withMessages([
                    'coupon' => "Insufficient quantity for product {$item['name']}. Available quantity: {$variant->stock_qty}",
                ]);
            }

            $price = $variant->sales_amount > 0 ? $variant->sales_amount : $variant->price_override;
            $inlineTotal = $price * $item['quantity'];
            $subtotal += $inlineTotal; 
        }
        
        $discount = $this->calculateDiscount($coupon, $subtotal);
        $shippingFee = $this->getShippingFee($subtotal);
        $total = $subtotal - $discount + $shippingFee;
        
        return [
            'total' => $total,
            'discount' => $discount,
        ];
    }

    private function calculateDiscount(Coupon $coupon, float $subtotal): float {
        if ($subtotal < $coupon->min_order_amount) {
            throw ValidationException::withMessages([
                'coupon' => "Minumum order amount should be $ {$coupon->min_order_amount}."
            ]);
        }
        if ($coupon->type === 'percentage') {
            $discount = $coupon->value / 100 * $subtotal;
            return round($discount, 2);
        }
        return round($coupon->value, 2);

    }

    private function getShippingFee($subtotal): int {
        $shippingFee = ShippingSetting::where('is_active', true)->first();
        if ($subtotal < $shippingFee->free_shipping_threshold) {
            return $shippingFee->flat_rate_fee;
        }

        return 0;
    }
}

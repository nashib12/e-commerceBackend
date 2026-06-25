<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WishlistResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->created_at,
            'product' => [
                'id' => $this->products->id,
                'category_id' => $this->products->category_id,
                'name' => $this->products->name,
                'slug' => $this->products->slug,
                'price' => $this->products->base_price,
                'sale_price' => $this->products->sales_amount,
                'image' => $this->products->primaryImage->image_url,
            ]
        ];
    }
}

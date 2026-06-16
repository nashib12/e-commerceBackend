<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantResource extends JsonResource
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
            'price' => $this->price_override,
            'stock_status' => $this->stock_status,
            'sales_amount' => $this->sales_amount,
            'color_id' => $this->attributeValues->where('attribute_id', 1)->first()?->id,
            'size_id' => $this->attributeValues->where('attribute_id', 2)->first()?->id,
            'stock' => $this->stock_qty,
        ];
    }
}

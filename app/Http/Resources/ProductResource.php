<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        
        $allAttributesValue = $this->productVariant->flatMap( fn ($variant) => $variant->attributeValues);

        $grouped = $allAttributesValue->groupBy('attribute_id')->map( fn ($values) => 
            $values->unique('id')->values()->map(fn ($av) => [
                'id' => $av->id,
                'value' => $av->value,
                'meta' => $av->meta,
            ])
        );

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'base_price' => $this->base_price,
            'sale_price' => $this->sale_price,
            'sales_amount' => $this->sales_amount,
            'description' => $this->description,
            'image' => $this->productImage,
            'categories' => $this->categories,
            'primary_image' => $this->primaryImage,
            'colors' => $grouped->get(1, collect())->values()->toArray(),
            'size' => $grouped->get(2, collect())->values()->toArray(),
            'variants' => VariantResource::collection($this->productVariant),
        ];
    }
}

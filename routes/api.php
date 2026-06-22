<?php

use App\Http\Controllers\AttributeController;
use App\Http\Controllers\AttributeValueController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ShippingFeeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/category', [CategoryController::class, 'show']);
Route::get('/product', [ProductController::class, 'show']);
Route::get('/attributeValue', [AttributeValueController::class, 'show']);
Route::get('/attribute', [AttributeController::class, 'index']);
Route::get('/variant', [ProductVariantController::class, 'index']);
Route::get('/image', [ProductImageController::class, 'show']);
Route::get('/product/{slug}', [ProductController::class, 'details']);
Route::get('/shipping_fee', [ShippingFeeController::class, 'index']);
Route::post('/coupon', [CouponController::class, 'checkStatus']);
Route::post('/cart/checkStatus', [OrderController::class, 'checkStatus']);
Route::post('/create-order', [OrderController::class,'create']);
Route::get('/featured_product', [ProductController::class, 'showFeatured']);
Route::get('/filtered_product/{id}', [FilterController::class, 'categoryFilter']);
Route::get('/filtered_category/{id}', [FilterController::class, 'productFilter']);
Route::get('/filtered/featured_product', [FilterController::class, 'featuredProduct']);
Route::get('/filtered_color/{id}', [FilterController::class, 'filteredColor']);

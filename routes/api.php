<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\AttributeValueController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShippingFeeController;
use App\Http\Controllers\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:users'])->group(function () {
    Route::post('/create-order', [OrderController::class,'create']);
    Route::post('/cart/checkStatus', [OrderController::class, 'checkStatus']);
    Route::post('/coupon', [CouponController::class, 'checkStatus']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::prefix('/profile')->controller(ProfileController::class)->group(function (){
        Route::get('', 'show');
        Route::post('/create', 'create');
        Route::post('/update/{profile}', 'update');
    });
    Route::prefix('/address')->controller(AddressController::class)->group(function () {
        Route::get('', 'index');
        Route::post('/create', 'create');
        Route::post('/update/{address}', 'update');
        Route::delete('/delete/{address}', 'destroy');
        Route::get('/default', 'defaultAddress');
    });
    Route::get('/order/list', [OrderController::class, 'show']);

    Route::prefix('/wishlist')->controller(WishlistController::class)->group(function () {
        Route::get('', 'index');
        Route::post('/create', 'create');
        Route::delete('/delete/{wishlist}', 'destroy');
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware(['auth:sanctum', 'role:users']);

Route::middleware('guest')->group(function () {
    Route::post('/register', [AuthController::class, 'create']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::get('/category', [CategoryController::class, 'show']);
Route::get('/product', [ProductController::class, 'show']);
Route::get('/attributeValue', [AttributeValueController::class, 'show']);
Route::get('/attribute', [AttributeController::class, 'index']);
Route::get('/variant', [ProductVariantController::class, 'index']);
Route::get('/image', [ProductImageController::class, 'show']);
Route::get('/product/{slug}', [ProductController::class, 'details']);
Route::get('/shipping_fee', [ShippingFeeController::class, 'index']);
Route::get('/featured_product', [ProductController::class, 'showFeatured']);
Route::get('/filtered_product/{slug}', [FilterController::class, 'categoryFilter']);
Route::get('/filtered/featured_product', [FilterController::class, 'featuredProduct']);
Route::get('/filtered_color/{id}', [FilterController::class, 'filteredColor']);

Route::post('/newsletter/subscribe', [NewsletterSubscriptionController::class, 'subscribe']);
Route::prefix('/newsletter')->controller(NewsletterSubscriptionController::class)->group(function () {
    Route::post('/subscribe', 'subscribe');
    Route::get('/verify/{token}', 'verify');
    Route::get('/unsubscribe/{token}', 'unsubscribe');
});
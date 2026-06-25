<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\AttributeValueController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ProductVariantController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ShippingFeeController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Index');
    })->name('dashboard');
    Route::get('/categories', function () {
        return Inertia::render('Categories');
    });
    Route::get('/coupon-page', function () {
        return Inertia::render('Coupon');
    });
    
    Route::get('/product-page', function () {
        return Inertia::render('Products');
    });
    
    Route::get('/product-attrbiute', function () {
        return Inertia::render('Attributes');
    });
    
    Route::get('/product-inventory', function () {
        return Inertia::render('Inventory');
    });
    Route::get('shipping-fee-page', function () {
        return Inertia::render('ShippingFee');
    });
    
    Route::get('/order-details', function () {
        return Inertia::render('Order');
    });
    
});

Route::get('/registration', function() {
    return Inertia::render('Auth/Register');
})->middleware('guest');

Route::middleware('auth')->controller(CategoryController::class)->group( function () {
    Route::get('/category', 'index')->name('category.index');
    Route::post('/category/create', 'create')->name('category.create');
    Route::post('/category/{categories}/update', 'update')->name('category.update');
    Route::post('/category/{categories}/updateStatus', 'updateStatus')->name('category.updateStatus');
    Route::get('/category/details', 'show')->name('category.show');
});

Route::middleware('auth')->controller(ProductController::class)->group( function () {
    Route::get('/product', 'index')->name('product.index');
    Route::post('/product/create', 'create')->name('product.create');
    Route::post('/product/{product}/update', 'update')->name('product.update');
    Route::post('/product/{product}/updateStatus', 'updateStatus')->name('product.updateStatus');
});

Route::middleware('auth')->prefix('/products/{product}/images')->controller(ProductImageController::class)->group( function () {
    Route::get('/', 'index')->name('image.index');
    Route::post('/store', 'store')->name('image.store');
    Route::patch('/{image}/setPrimary', 'setPrimary')->name('image.setPrimary');
    Route::patch('/{image}/removePrimary', 'removePrimary')->name('image.removePrimary');
    Route::delete('/{image}/delete', 'destroy')->name('image.delete');
});

Route::middleware('auth')->prefix('/shipping-fee')->controller(ShippingFeeController::class)->group(function () {
    Route::get('/', 'index')->name('shippingFee.index');
    Route::post('/store','create')->name('shippingFee.create');
    Route::post('/{fee}/update', 'update')->name('shippingFee.update');
    Route::post('/{fee}/updateStatus', 'updateStatus')->name('shippingFee.updateStatus');
    Route::delete('/{fee}/delete', 'destroy')->name('shippingFee.destroy');
});

Route::middleware('auth')->prefix('/attributes')->controller(AttributeController::class)->group(function () {
    Route::get('/', 'index')->name('attribute.index');
    Route::post('/store', 'create')->name('attribute.create');
    Route::post('/{attribute}/update', 'update')->name('attribute.update');
    Route::delete('/{attribute}/delete', 'destroy')->name('attribute.delete');
});

Route::middleware('auth')->prefix('/attribute-value')->controller(AttributeValueController::class)->group(function () {
    Route::get('/', 'index')->name('attributeValue.index');
    Route::post('/store', 'create')->name('attributeValue.create');
    Route::post('/{attributeValue}/update', 'update')->name('attributeValue.update');
    Route::delete('/{attributeValue}/delete', 'destroy')->name('attributeValue.delete');
});

Route::middleware('auth')->prefix('/product-variant')->controller(ProductVariantController::class)->group(function () {
    Route::get('/', 'index')->name('productVariant.index');
    Route::post('/store', 'create')->name('productVariant.create');
    Route::post('/{productvariant}/update', 'update')->name('productVariant.update');
    Route::delete('/{productvariant}/delete', 'destroy')->name('productVariant.delete');
});

Route::middleware('auth')->prefix('/coupons')->controller(CouponController::class)->group(function() {
    Route::get('/', 'index')->name('coupon.index');
    Route::post('/store', 'create')->name('coupon.create');
    Route::post('/{coupon}/update', 'update')->name('coupon.update');
    Route::post('/{coupon}/updateStatus', 'updateStatus')->name('coupon.updateStatus');
    Route::delete('/{coupon}/delete', 'destroy')->name('coupon.delete');
    Route::post('/checkStatus', 'checkStatus')->name('coupon.checkStatus');
});

Route::get('/address', [AddressController::class, 'index'])->middleware('auth')->name('address.index');

Route::middleware('auth')->prefix('/review')->controller(ReviewController::class)->group(function () {
    Route::get('/', 'index')->name('review.index');
    Route::post('/store', 'create')->name('review.create');
    Route::put('/{review}/update', 'update')->name('review.update');
    Route::put('/{review}/updateStatus', 'updateStatus')->name('review.updateStatus');
    Route::delete('/{review}/delete', 'destroy')->name('review.delete');
});

Route::get('/order', [OrderController::class, 'index'])->name('order.index')->middleware('auth');

require __DIR__.'/auth.php';
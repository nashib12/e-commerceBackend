<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index() {
        $address = auth()->user()->address;
        return response()->json([
            'message' => 'Address data fetched successfully.',
            'data' => $address,
        ], 200);
    }

    public function create(StoreAddressRequest $request) {
        $validate = $request->validated();
        $validate['user_id'] = auth()->id();
        
        $result = Address::create($validate);

        return response()->json([
            'message' => 'Address added successfully',
            'data' => $result,
        ], 200);
    }

    public function update(UpdateAddressRequest $request, Address $address) {
        $address->update($request->validated());
        return response()->json([
            'message' => 'Address updated successsfully.',
            'data' => $address,
        ], 200);
    }

    public function destroy(Address $address) {
        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully.',
        ], 200);
    }

}

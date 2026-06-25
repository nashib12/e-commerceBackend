<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AddressController extends Controller
{
    public function index(Request $request) {

        $user = $request->user();
        $address = Address::where('user_id', $user->id)->get();

        return response()->json([
            'message' => 'Address data fetched successfully.',
            'data' => $address,
        ], 200);
    }

    public function create(StoreAddressRequest $request) {
        $validate = $request->validated();
        $user = auth()->user();
        $validate['user_id'] = $user->id;
        $validate['full_name'] = $user->name;

        Address::create($validate);

        return response()->json([
            'message' => 'Address added successfully',
        ], 200);
    }

    public function update(UpdateAddressRequest $request, Address $address) {
        // dd($request->all());
        $validated = $request->validated();
        $user = auth()->user();
        if ($address->user_id !== $user->id) {
            throw ValidationException::withMessages([
                'message' => 'You are not authorized to updated this address',
            ]);
        }
        $address->update($validated);
        return response()->json([
            'message' => 'Address updated successsfully.',
        ], 200);
    }

    public function destroy(Address $address) {
        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully.',
        ], 200);
    }

    public function defaultAddress(Request $request) {
        $user = $request->user();
        $address = Address::where('user_id', $user->id)->where('is_default', true)->first();

        return response()->json([
            'message' => 'Address fetched successfully',
            'data' => $address,
        ], 200);
    }

}
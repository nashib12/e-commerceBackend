<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function show(Request $request) {
        $userId = $request->user()->id;
        $profile = Profile::select('id', 'phone', 'gender', 'dob', 'image', 'user_id')->where('user_id', $userId)
            ->with('users:id,name,email')->first();

        return response()->json([
            'data' => $profile,
        ], 200);
    }

    public function create(Request $request) {
        // dd($request->all());
        $validated = $request->validate([
            'phone' => 'required|string|min:7|max:10',
            'gender' => 'required|string|in:male,female,other',
            'dob' => 'date|required',
            'image' => 'nullable|file|mimes:jpg,png,jpeg,webp|max:2048',
        ]);

        $validated['user_id'] = $request->user()->id;

        if($request->hasFile('image')){
            $validated['image'] = $request->file('image')->store('profile', 'public');
        }

        $profile = Profile::create($validated);
        return response()->json([
            'message' => 'Profile created successfully.',
            'data' => $profile->load('users:id,name,email'),
        ], 200);
    }
    
    public function update(Request $request, Profile $profile){
        // dd($request->all());
        $validated = $request->validate([
            'phone' => 'sometimes|string|min:7|max:10',
            'gender' => 'sometimes|string|in:male,female,other',
            'dob' => 'date|sometimes',
            'image' => 'nullable|file|mimes:jpg,png,jpeg,webp|max:2048',
        ]);

        if($profile->user_id !== $request->user()->id) {
            throw ValidationException::withMessages([
                'message' => 'You are not authorized to updated this profile.'
            ]);
        }
        if ($request->hasFile('image')){
            Storage::disk('public')->delete($profile->image);
            $validated['image'] = $request->file('image')->store('profile', 'public');
        } else {
            unset($validated['image']);
        }

        $profile->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => $profile->load('users:id,name,email'),
        ], 200);

    }
}

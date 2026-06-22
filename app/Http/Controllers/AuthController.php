<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function create(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'lowercase', 'max:255', Rule::unique('User', 'email')],
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->symbols()->uncompromised()->numbers()],
            'terms_&_conditions' => 'accepted',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function login(Request $request) {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $key = 'login:'.str($request->email)->lower().'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, maxAttempts: 5)){
            $seconds = RateLimiter::availableIn($key);
            
            throw ValidationException::withMessages([
                'eamil' => "Too many login attempts. Try again after {$seconds} seconds.",
            ])->status(429);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, decaySeconds: 60);
            
            throw ValidationException::withMessages([
                'email' => 'The provided credentiels are incorrect.',
            ]);
        }

        RateLimiter::clear($key);
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => "Successfully logged out."
        ]);
    }
}

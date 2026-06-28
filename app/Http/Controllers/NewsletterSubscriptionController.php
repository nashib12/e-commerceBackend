<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NewsletterSubscriptionController extends Controller
{
    public function subscribe(Request $request) {
        $validated = $request->validate([
            'email' => 'required|email|unique:newsletter_subscriptions,email',
            'has_accepetd' => 'accepted',
        ]);

        $subscriber = NewsletterSubscription::create($validated);

        Mail::to($subscriber->email)->send(new \App\Mail\NewsLetterVerificationMail($subscriber));

        return response()->json([
            'message' => 'Please check your email to confirm subscription.',
            'token' => $subscriber->token,
        ]);
    }

    public function verify(string $token) {
        $subscriber = NewsletterSubscription::where('token', $token)->where('status', 'pending')->firstOrFail();
        $subscriber->update([
            'status' => 'active',
            'verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Email verified successfully',
            'redirect' => config('app.frontend_url').'?newsletter=verified',
        ]);
    }

    public function unsubscribe(string $token) {
        $subscriber = NewsletterSubscription::where('token', $token)->firstOrFail();
        
        $subscriber->update([ 'status' => 'unsubscribed']);

        return response()->json([
            'message' => 'Email verified successfully',
            'redirect' => config('app.frontend_url').'?newsletter=verified',
        ]);
    }
}

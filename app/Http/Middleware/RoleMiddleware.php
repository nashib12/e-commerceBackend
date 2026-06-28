<?php

namespace App\Http\Middleware;

use App\Roles;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $enumRoles = array_map(fn($r) => Roles::from($r), $roles);

        if (!$request->user()?->hasRole($enumRoles)) {
            abort(403);
        }
        
        return $next($request);
    }
}

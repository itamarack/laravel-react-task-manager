<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use \App\Traits\HttpResponses;

    /**
     * Summary of register
     * @param AuthRegisterRequest $request
     * @return JsonResponse
     */
    public function register(AuthRegisterRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $validated['password'] = Hash::make($validated['password']);

            $user = User::query()->create($validated);

            return $this->successResponse([
                'user'         => new UserResource($user),
                'access_token' => $user->createToken('api_token')->plainTextToken,
                'token_type'   => 'Bearer',
            ], 'Registration successful', 201);
        } catch (\Throwable $e) {
            \Log::error('Registration error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse('Registration failed.', 500);
        }
    }

    /**
     * Summary of login
     * @param AuthLoginRequest $request
     * @return JsonResponse
     */
    public function login(AuthLoginRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $limiterKey = Str::lower($validated['email']) . '|' . $request->ip();

            if (RateLimiter::tooManyAttempts($limiterKey, 5)) {
                return $this->errorResponse(
                    'Too many login attempts. Please try again in ' . RateLimiter::availableIn($limiterKey) . ' seconds.',
                    429
                );
            }

            if (!Auth::attempt($validated)) {
                RateLimiter::hit($limiterKey, 60);
                return $this->errorResponse('Invalid credentials. Please try again.', 401);
            }

            RateLimiter::clear($limiterKey);
            $user = Auth::user();

            return $this->successResponse([
                'user'         => new UserResource($user),
                'access_token' => $user->createToken('api_token')->plainTextToken,
                'token_type'   => 'Bearer',
            ], 'Login successful', 200);
        } catch (\Throwable $e) {
            \Log::error('Login error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse('Login failed. Please try again later.', 500);
        }
    }

    /**
     * Summary of logout
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->tokens()->delete();
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return $this->successResponse(null, 'Successfully logged out', 200);
        } catch (\Throwable $e) {
            \Log::error('Logout error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse('Logout failed. Please try again later.', 500);
        }
    }

    /**
     * Summary of profile
     * @param Request $request
     * @return JsonResponse
     */
    public function user(Request $request): JsonResponse
    {
        try {
            return $this->successResponse(
                new UserResource($request->user()),
                'User profile fetched successfully',200
            );
        } catch (\Throwable $e) {
            \Log::error('Profile fetch error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Failed to fetch user profile.', 500);
        }
    }
}

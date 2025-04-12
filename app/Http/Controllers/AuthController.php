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

class AuthController extends Controller
{
    public function register(AuthRegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $validated['password'] = Hash::make($validated['password']);

        $user = User::query()->create($validated);

        return response()->json([
            'data' => new UserResource($user),
            'access_token' => $user->createToken('api_token')->plainTextToken,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(AuthLoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (!Auth::attempt($validated)) {
            return response()->json([
                'message' => 'Invalid Credentials, try again',
            ], 401);
        }

        $user = User::query()->where('email', $validated['email'])->first();

        return response()->json([
            'data' => new UserResource($user),
            'access_token' => $user->createToken('api_token')->plainTextToken,
            'token_type' => 'Bearer',
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json(new UserResource($request->user()));
    }
}
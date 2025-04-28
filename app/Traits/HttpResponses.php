<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait HttpResponses
{
  protected function successResponse($data, ?string $message, int $code = 200): JsonResponse
  {
    return response()->json([
      'status'  => 'success',
      'message' => $message,
      'data'    => $data
    ], $code);
  }

  protected function errorResponse(string $message, int $code = 400): JsonResponse
  {
    return response()->json([
      'status'  => 'error',
      'message' => $message,
    ], $code);
  }
}

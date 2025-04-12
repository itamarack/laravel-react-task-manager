<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = $request->user()->categories()->get();

        return response()->json([
            'data' => CategoryResource::collection($categories),
            'message' => 'Categories fetched successfully',
            'status_code' => 200,
        ], 200);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'data' => new CategoryResource($category),
            'message' => 'Category fetched successfully',
            'status_code' => 200,
        ], 200);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $category = $request->user()->categories()->create($validated);

        return response()->json([
            'data' => new CategoryResource($category),
            'message' => 'Category created successfully',
            'status_code' => 201,
        ], 201);
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $validated = $request->validated();

        $category->update($validated);

        return response()->json([
            'data' => new CategoryResource($category),
            'message' => 'Category updated successfully',
            'status_code' => 201,
        ], 201);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'data' => new CategoryResource($category),
            'message' => 'Category deleted successfully',
            'status_code' => 200,
        ], 200);
    }
}
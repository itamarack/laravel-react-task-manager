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
    /**
     * Summary of index
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $categories = $request->user()->categories()->with('tasks')->get();

        return response()->json([
            'data' => CategoryResource::collection($categories),
            'message' => 'Categories fetched successfully',
            'status_code' => 200,
        ], 200);
    }

    /**
     * Summary of show
     * @param \App\Models\Category $category
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'data' => new CategoryResource($category->load('tasks')),
            'message' => 'Category fetched successfully',
            'status_code' => 200,
        ], 200);
    }

    /**
     * Summary of store
     * @param \App\Http\Requests\StoreCategoryRequest $request
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $category = $request->user()->categories()->create($validated);

        return response()->json([
            'data' => new CategoryResource($category->load('tasks')),
            'message' => 'Category created successfully',
            'status_code' => 201,
        ], 201);
    }

    /**
     * Summary of update
     * @param \App\Http\Requests\UpdateCategoryRequest $request
     * @param \App\Models\Category $category
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $validated = $request->validated();

        $category->update($validated);

        return response()->json([
            'data' => new CategoryResource($category->load('tasks')),
            'message' => 'Category updated successfully',
            'status_code' => 201,
        ], 201);
    }

    /**
     * Summary of destroy
     * @param \App\Models\Category $category
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function destroy(Category $category): JsonResponse
    {
        $deletedCategory = $category->load('tasks');
        $category->delete();

        return response()->json([
            'data' => new CategoryResource($deletedCategory),
            'message' => 'Category deleted successfully',
            'status_code' => 200,
        ], 200);
    }
}
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
    use \App\Traits\HttpResponses;

    /**
     * Summary of index
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $categories = $request->user()->categories()
                ->with(['tasks' => fn ($query) => $query->orderBy('order')])
                ->get();

            return $this->successResponse(
                CategoryResource::collection($categories),
                'Categories fetched successfully',
                200
            );
        } catch (\Throwable $e) {
            \Log::error('Category fetch error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Summary of show
     * @param Category $category
     * @return JsonResponse
     */
    public function show(Category $category): JsonResponse
    {
        try {
            return $this->successResponse(
                new CategoryResource($category->load('tasks')),
                'Category fetched successfully',
                200
            );
        } catch (\Throwable $e) {
            \Log::error('Category fetch error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Summary of store
     * @param StoreCategoryRequest $request
     * @return JsonResponse
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $category = $request->user()->categories()->create($validated);

            return $this->successResponse(
                new CategoryResource($category->load('tasks')),
                'Category created successfully',
                201
            );
        } catch (\Throwable $e) {
            \Log::error('Category store error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Summary of update
     * @param UpdateCategoryRequest $request
     * @param Category $category
     * @return JsonResponse
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        try {
            $validated = $request->validated();
            $category->update($validated);

            return $this->successResponse(
                new CategoryResource($category->load('tasks')),
                'Category updated successfully',
                201
            );
        } catch (\Throwable $e) {
            \Log::error('Category update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Summary of destruction
     * @param Category $category
     * @return JsonResponse
     */
    public function destroy(Category $category): JsonResponse
    {
        try {
            $deletedCategory = $category->load('tasks');
            $category->delete();

            return $this->successResponse(
                new CategoryResource($deletedCategory),
                'Category deleted successfully',
                200
            );
        } catch (\Throwable $e) {
            \Log::error('Category delete error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}

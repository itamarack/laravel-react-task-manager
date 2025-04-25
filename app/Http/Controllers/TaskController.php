<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\ReorderTasksRequest;
use App\Http\Resources\TaskResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
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
            $tasks = $request->user()->tasks()->orderBy('order', 'desc')->get();

            return $this->successResponse(
                TaskResource::collection($tasks),
                'Tasks fetched successfully',
                200
            );
        } catch (\Throwable $e) {
            \Log::error('Tasks fetch error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Summary of show
     * @param Task $task
     * @return JsonResponse
     */
    public function show(Task $task): JsonResponse
    {
        try {
            return $this->successResponse(
                new TaskResource($task->load('category')),
                'Task fetched successfully'
            );
        } catch (\Throwable $e) {
            \Log::error('Task fetch error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Summary of store
     * @param StoreTaskRequest $request
     * @return JsonResponse
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $task = $request->user()->tasks()->create($validated);

            return $this->successResponse(
                new TaskResource($task->load('category')),
                'Task created successfully',
                201
            );
        } catch (\Throwable $e) {
            \Log::error('Tasks create error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Summary of update
     * @param UpdateTaskRequest $request
     * @param Task $task
     * @return JsonResponse
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        try {
            $validated = $request->validated();
            $task->update($validated);

            return $this->successResponse(
                new TaskResource($task->load('category')),
                'Task updated successfully',
                201
            );
        } catch (\Throwable $e) {
            \Log::error('Tasks update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage());
        }
    }

    /**
     * Summary of destruction
     * @param Task $task
     * @return JsonResponse
     */
    public function destroy(Task $task): JsonResponse
    {
        try {
            $deletedTask = $task->load('category');
            $task->delete();

            return $this->successResponse(
                new TaskResource($deletedTask),
                'Task deleted successfully',
                200
            );
        } catch (\Throwable $e) {
            \Log::error('Tasks delete error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Summary of reorder
     * @param ReorderTasksRequest $request
     * @return JsonResponse
     */
    public function reorder(ReorderTasksRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            foreach ($validated['tasks'] as $index => $task) {
                Task::query()->where('id', $task['id'])->update(['order' => $index]);
            }

            return $this->successResponse([], 'Task order updated successfully', 201);
        } catch (\Throwable $e) {
            \Log::error('Tasks reordered error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}

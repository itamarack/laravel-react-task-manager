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
    /**
     * Summary of index
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $tasks = $request->user()->tasks()->orderBy('order', 'desc')->get();

        return response()->json([
            'data' => TaskResource::collection($tasks),
            'message' => 'Tasks fetched successfully',
            'status_code' => 200,
        ], 200);
    }

    /**
     * Summary of show
     * @param \App\Models\Task $task
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function show(Task $task): JsonResponse
    {
        return response()->json([
            'data' => new TaskResource($task->load('category')),
            'message' => 'Task fetched successfully',
            'status_code' => 200,
        ], 200);
    }

    /**
     * Summary of store
     * @param \App\Http\Requests\StoreTaskRequest $request
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();

        $task = $request->user()->tasks()->create($validated);

        return response()->json([
            'data' => new TaskResource($task->load('category')),
            'message' => 'Task created successfully',
            'status_code' => 201,
        ], 201);
    }

    /**
     * Summary of update
     * @param \App\Http\Requests\UpdateCategoryRequest $request
     * @param \App\Models\Task $task
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $validated = $request->validated();

        $task->update($validated);

        return response()->json([
            'data' => new TaskResource($task->load('category')),
            'message' => 'Task updated successfully',
            'status_code' => 201,
        ], 201);
    }

    /**
     * Summary of destroy
     * @param \App\Models\Task $task
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function destroy(Task $task): JsonResponse
    {
        $deletedTask = $task->load('category');
        $task->delete();

        return response()->json([
            'data' => new TaskResource($deletedTask),
            'message' => 'Task deleted successfully',
            'status_code' => 200,
        ], 200);
    }

    /**
     * Summary of reorder
     * @param \App\Http\Requests\ReorderTasksRequest $request
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function reorder(ReorderTasksRequest $request)
    {
        $validated = $request->validated();
    
        foreach ($validated['tasks'] as $index => $task) {
            Task::where('id', $task['id'])->update(['order' => $index]);
        }
    
        return response()->json(['message' => 'Task order updated']);
    }
}
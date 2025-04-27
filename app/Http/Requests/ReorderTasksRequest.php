<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderTasksRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'task.name' => ['required', 'string', 'max:255'],
            'task.description' => ['nullable', 'string', 'max:500'],
            'task.status' => ['required', 'string', Rule::in(['pending', 'in_progress', 'completed'])],
            'task.priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'task.category_id' => ['sometimes', 'exists:categories,id'],
            'task.user_id' => ['sometimes', 'exists:users,id'],

            'surround_tasks' => ['sometimes', 'array'],
            'surround_tasks.*.name' => ['sometimes', 'string', 'max:255'],
            'surround_tasks.*.description' => ['sometimes', 'string', 'max:500'],
            'surround_tasks.*.status' => ['sometimes', 'string', Rule::in(['pending', 'in_progress', 'completed'])],
            'surround_tasks.*.priority' => ['sometimes', Rule::in(['low', 'medium', 'high'])],
            'surround_tasks.*.category_id' => ['sometimes', 'exists:categories,id'],
            'surround_tasks.*.user_id' => ['sometimes', 'exists:users,id'],
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'completed']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'category_id' => Category::inRandomOrder()->first()->id,
            'user_id' => User::first()->id,
        ];
    }
}
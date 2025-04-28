<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use App\Models\Task;
use App\Traits\TaskRankGenerator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    use TaskRankGenerator;

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
            'status' => $this->faker->randomElement(['pending', 'completed']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'category_id' => Category::query()->inRandomOrder()->first()->id,
            'order' => $this->randomBetween(),
            'user_id' => User::query()->first()?->id,
        ];
    }
}

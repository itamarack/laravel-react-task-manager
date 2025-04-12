<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Category;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Example User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
        ]);

        Category::factory(10)->create(['user_id' => $user->id]);
    }
}
<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string name
 * @property string $order
 * @property string description
 * @property string category_id
 * @property string priority
 * @property string user_id
 * @property string status
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property mixed $category
 */

class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'status',
        'priority',
        'order',
        'user_id',
        'category_id'
    ];

    /**
     * Summary of tasks
     * @return BelongsTo;<Category, Task>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    /**
     * Summary of tasks
     * @return BelongsTo;<User, Task>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

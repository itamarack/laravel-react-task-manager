<?php

namespace App\Traits;

use App\Models\Task;

trait LexoRanking
{
    /**
     * @param Task|null $before
     * @param Task|null $after
     * @return string
     */
    public static function rankGenerate(?Task $before, ?Task $after): string
    {
        return match (true) {
            $before && $after => static::between($before->order, $after->order),
            isset($before)    => static::after($before->order),
            isset($after)     => static::before($after->order),
            default           => 'm',
        };
    }

    /**
     * @param string $a
     * @param string $b
     * @return string
     */
    public static function between(string $a, string $b): string
    {
        $maxLen = max(strlen($a), strlen($b));
        $a = str_pad($a, $maxLen, 'a');
        $b = str_pad($b, $maxLen, 'z');

        $result = '';
        for ($i = 0; $i < $maxLen; $i++) {
            $mid = chr((ord($a[$i]) + ord($b[$i])) >> 1);
            $result .= $mid;

            if ($a[$i] != $b[$i]) break;
        }

        return $result;
    }

    /**
     * @param string $b
     * @return string
     */
    public static function before(string $b): string
    {
        return self::between('a', $b);
    }

    /**
     * @param string $a
     * @return string
     */
    public static function after(string $a): string
    {
        return self::between($a, 'z');
    }
}

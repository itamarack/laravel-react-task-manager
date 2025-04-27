<?php

namespace App\Traits;

use App\Models\Task;
use Illuminate\Support\Str;

trait TaskRankGenerator
{
    /**
     * @param array|null $before
     * @param array|null $after
     * @return string
     */
    public static function rankGenerate(?array $before, ?array $after): string
    {
        return match (true) {
            $before && $after => static::between($before['order'], $after['order']),
            isset($before)    => static::after($before['order']),
            isset($after)     => static::before($after['order']),
            default           => Str::upper(fake()->bothify('??##')),
        };
    }

    /**
     * @param string $a
     * @param string $b
     * @return string
     */
    public static function between(string $a, string $b): string
    {
        $aDecimal = base_convert($a, 36, 10);
        $bDecimal = base_convert($b, 36, 10);

        $midDecimal = (int) floor(((float) $aDecimal + (float) $bDecimal) / 2);

        return str_pad(
            base_convert(floor($midDecimal * 1000000) / 1000000, 10, 36),
            max(strlen($a), strlen($b)),
            '0',
            STR_PAD_LEFT
        );
    }

    /**
     * @param string $b
     * @return string
     */
    public static function before(string $b): string
    {
        return self::between('0', $b);
    }

    /**
     * @param string $a
     * @return string
     */
    public static function after(string $a): string
    {
        return self::between($a, str_repeat('z', strlen($a)));
    }

    /**
     * @return string
     */
    public static function randomBetween(): string
    {
        $randomOrder1 = Str::upper(fake()->bothify('??##'));
        $randomOrder2 = Str::upper(fake()->bothify('??##'));

        return static::between($randomOrder1, $randomOrder2);
    }
}

<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="dns-prefetch" href="//fonts.gstatic.com">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ config('app.name', 'Task Manager') }}</title>

        @viteReactRefresh
        @vite(['resources/js/entrypoint.js', 'resources/css/app.css']) 
    </head>
    <body>
        <div id="entrypoint"></div>
    </body>
</html>

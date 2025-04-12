import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/entrypoint.js'],
            refresh: true,
        }),
    ],
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// В докере запросы к /api и /uploads разруливает nginx (см. nginx.conf).
// Для `bun run dev` тот же путь нужно проксировать самим, иначе фронт
// на :5173 будет стучаться сам в себя вместо бэкенда на :3000.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/uploads': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});

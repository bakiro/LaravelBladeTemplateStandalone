import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    publicDir: false,
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        rollupOptions: {
            input: [
                'src/resources/js/app.js',
                'src/resources/css/app.css',
            ],
            output: {
                entryFileNames: '[name].js',
                assetFileNames: '[name][extname]',
            },
        },
    },
});

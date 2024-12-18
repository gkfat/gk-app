/// <reference types="vitest/config" />

import {
  fileURLToPath,
  URL,
} from 'node:url';

// Utilities
import {
  defineConfig,
  loadEnv,
} from 'vite';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// Plugins
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        css: { preprocessorOptions: { sass: { api: 'modern' } } },
        plugins: [
            vue({ template: { transformAssetUrls } }), vuetify({
                autoImport: true,
                styles: { configFile: 'src/styles/index.scss' },
            }),
        ],
        build: { chunkSizeWarningLimit: 1600 },
        resolve: {
            alias: [
                {
                    find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)), 
                },
            ],
            extensions: [
                '.js',
                '.json',
                '.jsx',
                '.mjs',
                '.ts',
                '.tsx',
                '.vue',
            ],
        },
        envDir: './',
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                },
            },
        },
        test: {
            global: true,
            environment: 'jsdom',
            alias: { '@test': fileURLToPath(new URL('./test', import.meta.url)) },
            coverage: {
                enabled: true,
                reporter: ['html'],
                reportsDirectory: './test/coverage', 
            },
        },
    };
});
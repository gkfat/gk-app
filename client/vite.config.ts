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
import eslint from 'vite-plugin-eslint';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// Plugins
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    console.log(`App mode: ${mode}, API url: ${env.VITE_API_URL}`);

    return {
        css: { preprocessorOptions: { sass: { api: 'modern' } } },
        plugins: [
            vue({ template: { transformAssetUrls } }),
            vuetify({
                autoImport: true,
                styles: { configFile: 'src/styles/index.scss' },
            }),
            eslint({
                emitWarning: true,
                emitError: false,
                failOnError: false,
                failOnWarning: false,
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
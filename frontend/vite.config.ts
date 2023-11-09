import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';
import { rollup, InputOptions, OutputOptions } from 'rollup';
import rollupPluginTypescript from 'rollup-plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  workbox: {
    importScripts: ['./sw-custom.js'],
    globIgnores: ['**/node_modules/**/*', '**/sw-custom.js'],
  },
  includeAssets: [
    'favicon.svg',
    'favicon.ico',
    'robots.txt',
    'apple-touch-icon.png',
  ],
  manifest: {
    name: 'RL Idle',
    short_name: 'RL Idle',
    description: 'Clicker idle game based on Rocket League',
    icons: [
      {
        src: '/apple-icon-180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/manifest-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/manifest-icon-512.maskable.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: '#3b82f6',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
    screenshots: [
      {
        src: '/screenshot.png',
        sizes: '360x741',
        type: 'image/png',
      },
    ],
  },
};

const CompileTsServiceWorker = () => ({
  name: 'compile-typescript-service-worker',
  async writeBundle(_options, _outputBundle) {
    const inputOptions: InputOptions = {
      input: 'src/app/sw-custom.ts',
      plugins: [rollupPluginTypescript(), nodeResolve()],
    };
    const outputOptions: OutputOptions = {
      file: 'dist/sw-custom.js',
      format: 'es',
    };
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);
    await bundle.close();
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaConfig), CompileTsServiceWorker()],
  // Port
  server: {
    host: '0.0.0.0',
    port: 3001,
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '$fonts', replacement: path.resolve('./src/fonts') },
    ],
  },
  publicDir: 'src/public',
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});

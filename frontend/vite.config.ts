import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
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
        src: '/apple-icon-192.maskable.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon-512.maskable.png',
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
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaConfig)],
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
});

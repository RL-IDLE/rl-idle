import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
});

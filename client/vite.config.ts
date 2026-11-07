import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  esbuild: {
    // Drop non-error console statements in production builds to reduce bundle size and prevent leakages
    pure: mode === 'production' ? ['console.log', 'console.debug', 'console.info', 'console.warn'] : [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5012',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5012',
        changeOrigin: true,
      },
    },
  },
}));

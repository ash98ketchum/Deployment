import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path  from 'path';

export default defineConfig({
  plugins: [ react() ],
  resolve: {
    alias: {
      // this means "@/foo" → "<project-root>/src/foo"
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});

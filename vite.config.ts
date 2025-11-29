import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom', // or "node" if you're not testing DOM
    setupFiles: './src/setupTests.ts',
    testTimeout: 15_000, // give extra time for real connections
    hookTimeout: 15_000,
  },
});


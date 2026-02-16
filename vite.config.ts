import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  plugins: [react(), envCompatible()],
  server: {
    port: 3000
  },
  build: {
    target: 'es2020',
    outDir: 'dist'
  },
  define: {
    'process.env': {}
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts'
  }
});

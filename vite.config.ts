import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});

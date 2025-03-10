import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['**/*e2e.test.ts'],
  },
  plugins: [solid()],
  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

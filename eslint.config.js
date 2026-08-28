import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'test-results/**', 'playwright-report/**', '.factory/qa-evidence/**'] },
  { files: ['public/sw.js'], languageOptions: { globals: globals.serviceworker } },
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: globals.node } },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);

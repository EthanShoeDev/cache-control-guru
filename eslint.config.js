// @ts-check
// @ts-ignore
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslint from '@eslint/js';
import * as tsParser from '@typescript-eslint/parser';
import solid from 'eslint-plugin-solid/configs/typescript';
import tailwind from 'eslint-plugin-tailwindcss';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  // ts-eslint
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        process: true,
      },
    },
  },
  // Solid
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
      },
    },
  },
  // Tailwind
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        classRegex: '^class(Name)?$|ClassName$',
      },
    },
  },
  // Eslint Comments
  comments.recommended,

  // Rules
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },

  {
    ignores: [
      '**/**.gen.*',
      'docs/**/**',
      'node_modules/**',
      'dist/**',
      '.vinxi/**',
      '.output/**',
    ],
  },
);

import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.builtin,
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      'prefer-const': 'error',
    },
  },
  {
    files: ['.eslintrc.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
    },
  },
];

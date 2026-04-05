import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      'layouts/**/*.html',
      'content/**/*.md',
      'static/**/*',
      'public/**/*',
      'themes/**/*',
    ],
  },
];

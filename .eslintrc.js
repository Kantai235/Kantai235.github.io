module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  ignorePatterns: [
    'layouts/**/*.html',
    'content/**/*.md',
    'static/**/*',
    'public/**/*',
    'themes/**/*'
  ],
  overrides: [
    {
      files: ['**/*.html'],
      parser: null,
      rules: {}
    }
  ]
};
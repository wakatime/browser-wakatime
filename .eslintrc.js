module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'kentcdodds/best-practices',
    'kentcdodds/es6/possible-errors',
    'kentcdodds/import',
    'kentcdodds/jest',
    'kentcdodds/possible-errors',
    'plugin:jest-dom/recommended',
    'plugin:testing-library/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:typescript-sort-keys/recommended',
  ],
  globals: {
    browser: true,
    chrome: true,
    phantom: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: ['react', '@typescript-eslint', 'typescript-sort-keys', 'sort-keys-fix'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off', // No longer required in react 17
    'sort-keys-fix/sort-keys-fix': 'error',
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/ignore': ['.scss', '.css'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};

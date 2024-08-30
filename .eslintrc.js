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
    // 'kentcdodds/best-practices',
    // 'kentcdodds/es6/possible-errors',
    'kentcdodds',
    // 'kentcdodds/react',
    'kentcdodds/import',
    'kentcdodds/jest',
    // 'kentcdodds/possible-errors',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:jest-dom/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    // 'plugin:react/jsx-runtime',
    'plugin:typescript-sort-keys/recommended',
    'plugin:react-hooks/recommended',
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
  plugins: ['react', 'typescript-sort-keys', 'sort-keys-fix'],
  rules: {
    'no-await-in-loop': 'off',
    'prettier/prettier': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
    'testing-library/no-debug': 'off',
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

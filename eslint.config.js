const reactNativePlugin = require('@react-native/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');
const tsParser = require('@typescript-eslint/parser');
const presstoPlugin = require('./eslint-plugin');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@react-native': reactNativePlugin,
      'pressto': presstoPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'pressto/require-worklet-directive': 'error',
      ...prettierConfig.rules,
    },
  },
  {
    ignores: ['node_modules/', 'lib/', 'coverage/', 'dist/'],
  },
];

const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');
const tsParser = require('@typescript-eslint/parser');
const presstoPlugin = require('eslint-plugin-pressto');

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
      'pressto': presstoPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'pressto/require-worklet-directive': 'error',
      ...prettierConfig.rules,
    },
  },
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'ios/', 'android/'],
  },
];

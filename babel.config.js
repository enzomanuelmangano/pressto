module.exports = {
  presets: [
    ['module:react-native-builder-bob/babel-preset', { modules: 'commonjs' }],
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        [
          '@babel/preset-typescript',
          { allowDeclareFields: true, isTSX: true, allExtensions: true },
        ],
      ],
    },
  },
  overrides: [
    {
      test: /node_modules/,
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        [
          '@babel/preset-typescript',
          { allowDeclareFields: true, isTSX: true, allExtensions: true },
        ],
      ],
    },
  ],
};

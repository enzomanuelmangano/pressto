const path = require('path');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['pressto'],
      },
    },
    argv
  );

  // Add parent node_modules to resolve paths
  config.resolve.modules = [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, '../node_modules'),
    'node_modules',
  ];

  // Add alias for reanimated to point to parent node_modules
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-reanimated': path.resolve(
      __dirname,
      '../node_modules/react-native-reanimated'
    ),
    'react-native-worklets': path.resolve(
      __dirname,
      '../node_modules/react-native-worklets'
    ),
    'react-native-gesture-handler': path.resolve(
      __dirname,
      '../node_modules/react-native-gesture-handler'
    ),
  };

  return config;
};

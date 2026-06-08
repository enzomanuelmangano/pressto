// SDK 56's metro calls babel's getCacheKey without a filename, which trips
// react-native-builder-bob's getConfig (it injects `overrides` with RegExp
// `test` patterns that require a filename). The example's metro config resolves
// `pressto` to its built `lib` output via standard resolution, so the bob
// source-linking babel setup isn't needed here — a plain Expo config suffices.
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};

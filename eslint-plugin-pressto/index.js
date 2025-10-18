/**
 * ESLint plugin for pressto
 * Enforces best practices when using pressto's createAnimatedPressable
 */
module.exports = {
  rules: {
    'require-worklet-directive': require('./rules/require-worklet-directive'),
  },
};

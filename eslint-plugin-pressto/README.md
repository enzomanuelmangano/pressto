# eslint-plugin-pressto

ESLint plugin for [pressto](https://github.com/enzomanuelmangano/pressto) - enforces best practices when using pressto's animated components.

## Installation

```bash
npm install --save-dev eslint-plugin-pressto
# or
yarn add -D eslint-plugin-pressto
# or
bun add -D eslint-plugin-pressto
```

## Usage

### With ESLint Flat Config (`eslint.config.js`)

```javascript
const presstoPlugin = require('eslint-plugin-pressto');

module.exports = [
  {
    plugins: {
      pressto: presstoPlugin,
    },
    rules: {
      'pressto/require-worklet-directive': 'error',
    },
  },
];
```

### With Legacy Config (`.eslintrc.js`)

```javascript
module.exports = {
  plugins: ['pressto'],
  rules: {
    'pressto/require-worklet-directive': 'error',
  },
};
```

## Rules

### `pressto/require-worklet-directive`

Enforces the use of `'worklet'` directive in functions passed to `createAnimatedPressable`.

When using `createAnimatedPressable`, the animation function must run on the UI thread using React Native Reanimated. This requires a `'worklet'` directive as the first statement in the function body.

#### Rule Details

❌ Examples of **incorrect** code:

```javascript
const AnimatedButton = createAnimatedPressable(() => {
  // Missing 'worklet' directive
  return {
    opacity: withSpring(1),
  };
});

// Arrow function with implicit return (not supported)
const AnimatedButton = createAnimatedPressable(() => ({
  opacity: withSpring(1),
}));
```

✅ Examples of **correct** code:

```javascript
const AnimatedButton = createAnimatedPressable(() => {
  'worklet';
  return {
    opacity: withSpring(1),
  };
});

const AnimatedButton = createAnimatedPressable(function() {
  'worklet';
  return {
    opacity: withSpring(1),
  };
});
```

## Why This Plugin?

The `'worklet'` directive is required for functions that need to run on the UI thread in React Native Reanimated. Forgetting to add it can lead to runtime errors or unexpected behavior. This plugin helps catch these issues during development.

## Related

- [pressto](https://github.com/enzomanuelmangano/pressto) - Custom React Native touchables with animations
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - React Native's Animated library reimplemented

## License

MIT

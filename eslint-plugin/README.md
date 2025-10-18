# Pressto ESLint Plugin

Official ESLint plugin for the Pressto library that enforces best practices when using `createAnimatedPressable`.

## Installation

The plugin is included when you install `pressto`:

```bash
npm install pressto
# or
bun add pressto
# or
yarn add pressto
```

## Configuration

Add the plugin to your ESLint configuration:

### Using Flat Config (eslint.config.js)

```js
const presstoPlugin = require('pressto/eslint-plugin');

module.exports = [
  {
    plugins: {
      'pressto': presstoPlugin,
    },
    rules: {
      'pressto/require-worklet-directive': 'error',
    },
  },
];
```

### Using Legacy Config (.eslintrc.js)

```js
const presstoPlugin = require('pressto/eslint-plugin');

module.exports = {
  plugins: {
    'pressto': presstoPlugin,
  },
  rules: {
    'pressto/require-worklet-directive': 'error',
  },
};
```

## Rules

### `require-worklet-directive`

Enforces that all functions passed to `createAnimatedPressable` include the `'worklet';` directive as the first statement in the function body.

**Why?** The `'worklet'` directive is required by React Native Reanimated to properly transform and execute the animation function on the UI thread. Forgetting this directive will cause the animation to run on the JS thread, resulting in poor performance or runtime errors.

#### Examples

**Invalid:**

```typescript
// Missing worklet directive
const MyPressable = createAnimatedPressable((progress) => {
  return {
    opacity: progress * 0.5,
  };
});

// Implicit return (no block for worklet directive)
const MyPressable = createAnimatedPressable((progress) => ({
  opacity: progress * 0.5,
}));
```

**Valid:**

```typescript
const MyPressable = createAnimatedPressable((progress) => {
  'worklet';
  return {
    opacity: progress * 0.5,
  };
});

const MyPressable = createAnimatedPressable((progress, options) => {
  'worklet';
  const { isPressed } = options;
  return {
    opacity: progress * 0.5,
    scale: isPressed ? 0.95 : 1,
  };
});
```

## Configuration

This plugin is automatically configured in `eslint.config.js` with the rule set to `error` level.

## Development

The plugin is located in the `eslint-plugin/` directory and uses standard ESLint rule APIs.

To add new rules:
1. Create a new rule file in `eslint-plugin/rules/`
2. Export the rule from `eslint-plugin/index.js`
3. Add the rule to `eslint.config.js`

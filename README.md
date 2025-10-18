## Pressto 🔥

https://github.com/user-attachments/assets/c857eb8d-3ce7-4afe-b2dd-e974560684d8

The fastest way to improve your React Native app is by using tap gestures.
That's why I've created **pressto**, a super-simple package to help you get started.

The package is built on top of the BaseButton from [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) to handle the resulting gestures and animations on the main thread. It aims to replace your “TouchableOpacity”.

## Installation

```sh
bun add pressto react-native-reanimated react-native-gesture-handler react-native-worklets
```

Or with Expo

```sh
npx expo install pressto react-native-reanimated react-native-gesture-handler react-native-worklets
```

## Features

- Pre-built animated pressable components: `PressableScale` and `PressableOpacity`
- Easy creation of custom animated pressables with `createAnimatedPressable`
- Configurable animation types and durations
- **Advanced interaction states**: `isPressed`, `isToggled`, `isSelected`
- **Type-safe metadata**: Pass theme/design tokens directly into worklets
- **Group coordination**: Track selected items across pressable groups

## Usage

### Use basic Pressables: PressableScale and PressableOpacity

```jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PressableOpacity, PressableScale } from 'pressto';

function BasicPressablesExample() {
  return (
    <View style={styles.container}>
      <PressableScale style={styles.box} onPress={() => console.log('scale')} />
      <PressableOpacity
        style={styles.box}
        onPress={() => console.log('opacity')}
      />
    </View>
  );
}
```

### Create a custom Pressable with createAnimatedPressable

```jsx
import { createAnimatedPressable } from 'pressto';

const PressableRotate = createAnimatedPressable((progress) => {
  'worklet'; // I recommend installing the eslint plugin below to avoid forgetting the worklet.
  return {
    transform: [{ rotate: `${(progress * Math.PI) / 4}rad` }],
  };
});

function CustomPressableExample() {
  return (
    <View style={styles.container}>
      <PressableRotate
        style={styles.box}
        onPress={() => console.log('rotate')}
      />
    </View>
  );
}
```

> **⚠️ Important:** Notice the `'worklet';` directive at the start of the animation function. This is **required** for the function to run on the UI thread with React Native Reanimated.

#### ESLint Plugin (Recommended)

Install the ESLint plugin to automatically catch missing `'worklet'` directives:

```sh
npm install -D eslint-plugin-pressto
# or
bun add -D eslint-plugin-pressto
```

**Why you need this:** Forgetting the `'worklet'` directive causes:

- ❌ Runtime errors or crashes
- ❌ Animations running on the JS thread (poor performance)
- ❌ Unexpected behavior with Reanimated shared values

The ESLint plugin catches these issues **at development time**, saving you debugging time. See the [ESLint Plugin section](#eslint-plugin) below for configuration.

### Advanced: Using interaction states

```jsx
import { createAnimatedPressable } from 'pressto';
import { interpolateColor } from 'react-native-reanimated';

const ToggleButton = createAnimatedPressable((progress, options) => {
  'worklet';

  const { isPressed, isToggled, isSelected, metadata } = options;

  // isPressed: true while actively pressing
  // isToggled: toggles on each press
  // isSelected: true for last pressed item in group
  // metadata: custom theme/config from PressablesConfig

  const backgroundColor = interpolateColor(
    progress,
    [0, 1],
    isToggled ? ['#4CAF50', '#388E3C'] : ['#2196F3', '#1976D2']
  );

  return {
    backgroundColor,
    opacity: isPressed ? 0.9 : 1,
    borderWidth: isSelected ? 2 : 0,
  };
});
```

### Use the PressablesConfig

```jsx
import React from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { PressablesConfig } from 'pressto';

function App() {
  return (
    <View style={styles.container}>
      <PressableRotate
        style={styles.box}
        onPress={() => console.log('rotate')}
      />
      <PressableScale style={styles.box} onPress={() => console.log('scale')} />
      <PressableOpacity
        style={styles.box}
        onPress={() => console.log('opacity')}
      />
    </View>
  );
}

export default () => (
  <PressablesConfig
    animationType="spring"
    config={{ mass: 1, damping: 30, stiffness: 200 }}
    globalHandlers={{
      onPress: () => {
        console.log('you can call haptics here');
      },
    }}
  >
    <App />
  </PressablesConfig>
);
```

### Advanced: Theme metadata

Pass your design system directly into worklets with full type safety:

```jsx
import { createAnimatedPressable, PressablesConfig } from 'pressto';

// Define your theme
const theme = {
  colors: {
    primary: '#6366F1',
    secondary: '#EC4899',
  },
  spacing: {
    medium: 16,
    large: 24,
  },
  borderRadius: {
    medium: 12,
  },
};

// Create themed pressables
const ThemedButton = createAnimatedPressable((progress, { metadata }) => {
  'worklet';
  return {
    backgroundColor: metadata.colors.primary,
    padding: metadata.spacing.medium,
    borderRadius: metadata.borderRadius.medium,
  };
});

// Provide theme to all pressables
function App() {
  return (
    <PressablesConfig metadata={theme}>
      <ThemedButton onPress={() => console.log('pressed')} />
    </PressablesConfig>
  );
}
```

## API

### PressableScale

A pressable component that scales when pressed.

### PressableOpacity

A pressable component that changes opacity when pressed.

### createAnimatedPressable

Creates a custom animated pressable component.

**Signature:**

```typescript
createAnimatedPressable<TMetadata = unknown>(
  animatedStyle: (
    progress: number,
    options: {
      isPressed: boolean;
      isToggled: boolean;
      isSelected: boolean;
      metadata: TMetadata;
    }
  ) => ViewStyle
)
```

**Parameters:**

- `progress` (number): Animation progress from 0 (idle) to 1 (pressed)
- `options.isPressed` (boolean): True while actively pressing
- `options.isToggled` (boolean): Toggles on each press (persistent state)
- `options.isSelected` (boolean): True for the last pressed item in a group
- `options.metadata` (TMetadata): Custom data from `PressablesConfig`

**Example:**

```jsx
const MyButton = createAnimatedPressable((progress, { isToggled }) => {
  'worklet';
  return {
    backgroundColor: isToggled ? '#4CAF50' : '#2196F3',
    transform: [{ scale: 1 - progress * 0.05 }],
  };
});
```

### PressablesConfig

Provides global configuration for all pressable components.

**Props:**

- `animationType?: 'timing' | 'spring'` - Animation type (default: 'timing')
- `config?: WithTimingConfig | WithSpringConfig` - Animation configuration
- `globalHandlers?: { onPress?, onPressIn?, onPressOut? }` - Global event handlers
- `metadata?: TMetadata` - Custom theme/config available in all pressables

**Example:**

```jsx
<PressablesConfig
  animationType="spring"
  config={{ damping: 30, stiffness: 200 }}
  metadata={{ colors: { primary: '#6366F1' } }}
>
  <App />
</PressablesConfig>
```

## ESLint Plugin

Pressto provides an ESLint plugin to help catch common mistakes when using `createAnimatedPressable`. The plugin enforces that all animation functions include the required `'worklet'` directive.

### Installation

```bash
npm install -D eslint-plugin-pressto
# or
bun add -D eslint-plugin-pressto
```

### Setup

**With `.eslintrc.js` (legacy config):**

```javascript
module.exports = {
  plugins: ['pressto'],
  rules: {
    'pressto/require-worklet-directive': 'error',
  },
};
```

**With `eslint.config.js` (flat config):**

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

See the [eslint-plugin-pressto documentation](https://github.com/enzomanuelmangano/pressto/tree/main/eslint-plugin-pressto) for more details.

## Migration Guide

### Upgrading from 0.3.x to 0.5.x

**Breaking Change:** The `progress` parameter is now a plain `number` instead of `SharedValue<number>`.

```diff
const MyPressable = createAnimatedPressable((progress) => {
  'worklet';
  return {
-   opacity: progress.get() * 0.5,
+   opacity: progress * 0.5,
-   scale: interpolate(progress.get(), [0, 1], [1, 0.95]),
+   scale: interpolate(progress, [0, 1], [1, 0.95]),
  };
});
```

**What to do:** Remove all `.get()` / `.value` calls on the `progress` parameter.

## Avoid highlight flicker effect in Scrollable List

Since pressto is built on top of the BaseButton from react-native-gesture-handler, it handles tap conflict detection automatically when used with a FlatList imported from react-native-gesture-handler.

```jsx
import { FlatList } from 'react-native-gesture-handler';

function App() {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PressableRotate style={styles.box} />}
    />
  );
}
```

You can also use whatever Scrollable component you want, as long as it supports the renderScrollComponent prop.

```jsx
import { WhateverList } from 'your-favorite-list-package'
import { ScrollView } from 'react-native-gesture-handler';

function App() {
  return (
    <WhateverList
      data={data}
      renderItem={({ item }) => <PressableRotate style={styles.box} />}
      renderScrollComponent={(props) => <ScrollView {...props} />}
  );
}
```

## Repository Structure

This is a monorepo containing:

- **pressto** - The main library (root package)
- **eslint-plugin-pressto** - Standalone ESLint plugin
- **example** - Example app

## Contributing

Contributions are welcome! Please see our [contributing guide](CONTRIBUTING.md) for more details.

## License

MIT

---

Made with ❤️ using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

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
- **Optional Liquid Glass support**: `PressableGlass` component available via `pressto/glass` (iOS 26+ with automatic fallbacks)

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

**Note:** For liquid glass effects, see [PressableGlass](#optional-liquid-glass-effects-ios-26) below.

### Create a custom Pressable with createAnimatedPressable

```jsx
import { createAnimatedPressable } from 'pressto';

const PressableRotate = createAnimatedPressable((progress) => {
  'worklet';
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

### Optional: Liquid Glass Effects (iOS 26+)

PressableGlass provides beautiful iOS 26+ liquid glass effects with automatic fallbacks for unsupported platforms.

**Important:** `PressableGlass` is only available via `pressto/glass` import. This keeps it tree-shakable so users who don't need glass effects won't bundle unnecessary code.

**Installation:**

Choose one of these packages:

```sh
# Official Expo package (recommended for Expo projects)
npx expo install expo-glass-effect

# OR Callstack's package (works with Expo and vanilla React Native)
npm install @callstack/liquid-glass
```

**Requirements:**
- iOS 26+ for liquid glass effects
- Xcode 26+ (for @callstack/liquid-glass)
- Falls back gracefully on unsupported platforms

**Usage:**

```jsx
// ONLY available from 'pressto/glass' (not from main 'pressto' export)
import { PressableGlass } from 'pressto/glass';
import { Text, StyleSheet } from 'react-native';

function GlassButtonExample() {
  return (
    <PressableGlass
      style={styles.glassButton}
      glassEffectStyle="clear"
      interactive
      tintColor="#ffffff"
      fallbackBackgroundColor="rgba(255, 255, 255, 0.2)"
      onPress={() => console.log('pressed')}
    >
      <Text style={styles.buttonText}>Glass Button</Text>
    </PressableGlass>
  );
}

const styles = StyleSheet.create({
  glassButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**Props:**

- `glassEffectStyle?: 'clear' | 'regular'` - Glass effect style (default: 'regular')
- `interactive?: boolean` - Enable touch interaction effects (default: false)
- `tintColor?: string` - Tint color overlay for the glass effect
- `colorScheme?: 'light' | 'dark' | 'system'` - Color scheme (default: 'system', @callstack/liquid-glass only)
- `fallbackBackgroundColor?: string` - Background color for unsupported platforms (default: 'rgba(255, 255, 255, 0.3)')

**Fallback Behavior:**

PressableGlass gracefully handles unsupported scenarios:

1. **No liquid glass package installed:**
   - Shows a console warning
   - Renders an animated pressable with `fallbackBackgroundColor`
   - Press animations still work (opacity + slight scale)

2. **Package installed but iOS < 26 or non-iOS platform:**
   - The liquid glass library's native fallback activates
   - Renders a regular `View` with `fallbackBackgroundColor`
   - Press animations still work

## API

### PressableScale

A pressable component that scales when pressed.

### PressableOpacity

A pressable component that changes opacity when pressed.

### PressableGlass

A pressable component with iOS 26+ liquid glass effect.

**Import:** `import { PressableGlass } from 'pressto/glass'` (NOT from main 'pressto' export)

**Requirements:** Requires either `expo-glass-effect` or `@callstack/liquid-glass` to be installed.

**Fallback:** Falls back to an animated semi-transparent pressable on unsupported platforms.

See the [Liquid Glass Effects](#optional-liquid-glass-effects-ios-26) section for detailed usage, installation, and fallback behavior.

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

## Contributing

Contributions are welcome! Please see our [contributing guide](CONTRIBUTING.md) for more details.

## License

MIT

---

Made with ❤️ using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

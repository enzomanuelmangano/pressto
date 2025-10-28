## Pressto 🔥

https://github.com/user-attachments/assets/c857eb8d-3ce7-4afe-b2dd-e974560684d8

**Replace TouchableOpacity with animated pressables that run on the main thread.**

Built on [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) and [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) for 60fps animations.

## Installation

```sh
bun add pressto react-native-reanimated react-native-gesture-handler react-native-worklets
```

## Quickstart

```jsx
import { PressableScale } from 'pressto';

function App() {
  return (
    <PressableScale onPress={() => console.log('pressed')}>
      <Text>Press me</Text>
    </PressableScale>
  );
}
```

**That's it.** Your pressable now scales smoothly on press with main-thread animations.

---

## Basic Usage

### Pre-built Components

Pressto comes with two ready-to-use components:

**PressableScale** - Scales down when pressed

```jsx
import { PressableScale } from 'pressto';

<PressableScale onPress={() => alert('Pressed!')}>
  <Text>Scale Animation</Text>
</PressableScale>;
```

**PressableOpacity** - Fades when pressed

```jsx
import { PressableOpacity } from 'pressto';

<PressableOpacity onPress={() => alert('Pressed!')}>
  <Text>Opacity Animation</Text>
</PressableOpacity>;
```

Both components accept all standard React Native Pressable props (`onPress`, `onPressIn`, `onPressOut`, `style`, etc.).

---

## Custom Animations

### Create Your Own Pressable

Use `createAnimatedPressable` to create custom animations:

```jsx
import { createAnimatedPressable } from 'pressto';

const PressableRotate = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [{ rotate: `${progress * 45}deg` }],
  };
});

// Use it like any other pressable
<PressableRotate onPress={() => console.log('rotated!')}>
  <Text>Rotate Me</Text>
</PressableRotate>;
```

**The `progress` parameter** goes from `0` (idle) to `1` (pressed), allowing you to interpolate any style property.

> **⚠️ Important:** The `'worklet';` directive is **required** at the start of your animation function. Without it, animations won't run on the UI thread.
>
> **Tip:** Install [eslint-plugin-pressto](https://github.com/enzomanuelmangano/pressto/tree/main/eslint-plugin-pressto) to catch missing `'worklet'` directives at development time.

---

## Configuration

Use `PressablesConfig` to customize animation behavior for all pressables in your app:

```jsx
import { PressablesConfig, PressableScale } from 'pressto';

function App() {
  return (
    <PressablesConfig
      animationType="spring"
      animationConfig={{ damping: 30, stiffness: 200 }}
      config={{ minScale: 0.9, activeOpacity: 0.6 }}
    >
      <PressableScale onPress={() => console.log('pressed')}>
        <Text>Now with spring animation!</Text>
      </PressableScale>
    </PressablesConfig>
  );
}
```

**Options:**

- `animationType`: `'timing'` or `'spring'` (default: `'timing'`)
- `animationConfig`: Pass timing or spring configuration
- `config`: Set default values for `minScale`, `activeOpacity`, `baseScale`

### Global Handlers

Add global handlers like haptic feedback:

```jsx
import { PressablesConfig } from 'pressto';
import * as Haptics from 'expo-haptics';

function App() {
  return (
    <PressablesConfig
      globalHandlers={{
        onPress: () => {
          Haptics.selectionAsync();
        },
      }}
    >
      {/* All pressables will trigger haptics */}
      <YourApp />
    </PressablesConfig>
  );
}
```

---

## Advanced Features

### Interaction States

Access advanced state in your custom pressables:

```jsx
const ToggleButton = createAnimatedPressable((progress, options) => {
  'worklet';

  const { isPressed, isToggled, isSelected } = options;
  // isPressed: true while actively pressing
  // isToggled: toggles on each press (persistent)
  // isSelected: true for last pressed item in a group

  return {
    backgroundColor: isToggled ? '#4CAF50' : '#2196F3',
    opacity: isPressed ? 0.8 : 1,
    borderWidth: isSelected ? 3 : 0,
  };
});
```

### Theme Metadata

Pass your design system into worklets with type safety:

```jsx
const theme = {
  colors: { primary: '#6366F1' },
  spacing: { medium: 16 },
};

type Theme = typeof theme;

const ThemedButton = createAnimatedPressable<Theme>((progress, { metadata }) => {
  'worklet';
  return {
    backgroundColor: metadata.colors.primary,
    padding: metadata.spacing.medium,
  };
});

<PressablesConfig metadata={theme}>
  <ThemedButton onPress={() => {}} />
</PressablesConfig>
```

### Web Hover Support

Activate animations on hover (web only):

```jsx
// Per component
<PressableScale activateOnHover onPress={() => {}}>
  <Text>Hover me!</Text>
</PressableScale>

// Or globally
<PressablesConfig activateOnHover>
  <YourApp />
</PressablesConfig>
```

### Avoid highlight flicker effect in Scrollable List

Since pressto is built on top of the BaseButton from react-native-gesture-handler, it handles tap conflict detection automatically when used with a FlatList imported from react-native-gesture-handler.

```jsx
import { FlatList } from 'react-native-gesture-handler';
import { PressableScale } from 'pressto';

function App() {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <PressableScale onPress={() => console.log(item)}>
          <Text>{item.title}</Text>
        </PressableScale>
      )}
    />
  );
}
```

You can also use whatever Scrollable component you want, as long as it supports the renderScrollComponent prop.

```jsx
import { WhateverList } from 'your-favorite-list-package'
import { ScrollView } from 'react-native-gesture-handler';
import { PressableScale } from 'pressto';

function App() {
  return (
    <WhateverList
      data={data}
      renderItem={({ item }) => (
        <PressableScale onPress={() => console.log(item)}>
          <Text>{item.title}</Text>
        </PressableScale>
      )}
      renderScrollComponent={(props) => <ScrollView {...props} />}
    />
  );
}
```

---

## API Reference

### `createAnimatedPressable<TMetadata>(animatedStyle)`

Creates a custom animated pressable.

**Parameters:**

- `animatedStyle`: Function that returns animated styles
  - `progress`: number (0-1) - Animation progress
  - `options.isPressed`: boolean - Currently being pressed
  - `options.isToggled`: boolean - Toggle state (persistent)
  - `options.isSelected`: boolean - Selected in group
  - `options.metadata`: TMetadata - Custom theme data
  - `options.config`: PressableConfig - Default values (minScale, activeOpacity, baseScale)

### `PressablesConfig`

Global configuration provider.

**Props:**

- `animationType`: 'timing' | 'spring' - Default: 'timing'
- `animationConfig`: Timing/spring config object
- `config`: { activeOpacity, minScale, baseScale }
- `globalHandlers`: { onPress, onPressIn, onPressOut }
- `metadata`: Custom theme/config (type-safe)
- `activateOnHover`: boolean - Web only

### `PressableConfig`

Default animation values:

```typescript
{
  activeOpacity: 0.5,   // PressableOpacity target
  minScale: 0.96,       // PressableScale target
  baseScale: 1          // PressableScale idle scale
}
```

---

## Migration Guide

### v0.5.1 → v0.6.0

`PressablesConfig` prop renamed: `config` → `animationConfig`

```diff
<PressablesConfig
- config={{ damping: 30, stiffness: 200 }}
+ animationConfig={{ damping: 30, stiffness: 200 }}
>
```

### v0.3.x → v0.5.x

`progress` is now a plain `number` instead of `SharedValue<number>`:

```diff
- opacity: progress.get() * 0.5,
+ opacity: progress * 0.5,
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

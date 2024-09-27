# pressto

Pressto is a React Native library that provides customizable and animated pressable components. Built on top of [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) and [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/), pressto makes it easy to create engaging and interactive touchable elements in your React Native applications.

## Installation

```sh
yarn add pressto react-native-reanimated react-native-gesture-handler
```

Make sure to follow the installation instructions for [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) and [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation) as well.

## Features

- Pre-built animated pressable components: `PressableScale` and `PressableOpacity`
- Easy creation of custom animated pressables with `createAnimatedPressable`
- Configurable animation types and durations
- Seamless integration with React Native's existing components

## Usage

Here's a quick example of how to use pressto in your React Native app:

```jsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  createAnimatedPressable,
  PressableOpacity,
  PressableScale,
  PressablesConfig,
} from 'pressto';

// Create a custom animated pressable
const PressableRotate = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [{ rotate: `${(progress.value * Math.PI) / 4}rad` }],
  };
});

export default function App() {
  return (
    <PressablesConfig animationType="spring">
      <GestureHandlerRootView style={styles.container}>
        <PressableScale
          onPress={() => console.log('scale')}
          config={{ duration: 100 }}
        >
          <View style={styles.box} />
        </PressableScale>
        <PressableOpacity onPress={() => console.log('opacity')}>
          <View style={[styles.box, styles.customBox]} />
        </PressableOpacity>
        <PressableRotate onPress={() => console.log('rotate')}>
          <View style={styles.box} />
        </PressableRotate>
      </GestureHandlerRootView>
    </PressablesConfig>
  );
}

const styles = StyleSheet.create({
  // ... (styles omitted for brevity)
});
```

## API

### PressableScale

A pressable component that scales when pressed.

### PressableOpacity

A pressable component that changes opacity when pressed.

### createAnimatedPressable

A function to create custom animated pressables. It takes a worklet function that defines how the component should animate based on the press progress.

### PressablesConfig

A component to configure global settings for all pressable components within its children.

## Contributing

Contributions are welcome! Please see our [contributing guide](CONTRIBUTING.md) for more details.

## License

MIT

---

Made with ❤️ using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

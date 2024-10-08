https://github.com/user-attachments/assets/c857eb8d-3ce7-4afe-b2dd-e974560684d8

The fastest way to improve your React Native app is by using tap gestures.
That's why I've created **pressto**, a super-simple package to help you get started.

The package is built on top of the Tap Gesture from [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/) to handle the resulting gestures and animations on the main thread. It aims to replace your “TouchableOpacity”.

## Installation

```sh
yarn add pressto react-native-reanimated react-native-gesture-handler
```

Or with Expo

```sh
npx expo install pressto react-native-reanimated react-native-gesture-handler
```

## Features

- Pre-built animated pressable components: `PressableScale` and `PressableOpacity`
- Easy creation of custom animated pressables with `createAnimatedPressable`
- Configurable animation types and durations

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

const PressableRotate = createAnimatedPressable((progress) => ({
  transform: [{ rotate: `${(progress.value * Math.PI) / 4}rad` }],
}));

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
    config={{ mass: 2 }}
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

## API

### PressableScale

A pressable component that scales when pressed.

### PressableOpacity

A pressable component that changes opacity when pressed.

### createAnimatedPressable

A function to create custom animated pressables. It takes a worklet function that defines how the component should animate based on the press progress.

### PressablesConfig

A component to configure global settings for all pressable components within its children.

## Use with ScrollView and FlatList/FlashList

`pressto` provides an optional custom scroll render component that enhances the scrolling experience when used with pressable components.

```jsx
import { renderScrollComponent } from 'pressto';
import { FlatList } from 'react-native';

function App() {
  return (
    // This works with all the lists that support the renderScrollComponent prop
    <FlatList
      renderScrollComponent={renderScrollComponent}
      data={data}
      renderItem={({ item }) => <PressableRotate style={styles.box} />}
    />
  );
}
```

The `renderScrollComponent` function wraps the scroll view with additional functionality in order to allow smoother interactions between scrolling and pressable components, preventing unwanted activations during scroll gestures.
Applying the renderScrollComponent from `pressto` means that the tap gesture will be delayed for a short amount of time to understand if the tap gesture is a scroll or a tap gesture.

## Contributing

Contributions are welcome! Please see our [contributing guide](CONTRIBUTING.md) for more details.

## License

MIT

---

Made with ❤️ using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

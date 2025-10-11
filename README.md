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

## API

### PressableScale

A pressable component that scales when pressed.

### PressableOpacity

A pressable component that changes opacity when pressed.

### createAnimatedPressable

A function to create custom animated pressables. It takes a worklet function that defines how the component should animate based on the press progress.

### PressablesConfig

A component to configure global settings for all pressable components within its children.

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

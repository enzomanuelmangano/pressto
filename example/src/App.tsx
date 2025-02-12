import { createAnimatedPressable, PressablesConfig } from 'pressto';
import { FlatList, StyleSheet, View } from 'react-native';

import { interpolate, interpolateColor } from 'react-native-reanimated';

const PressableRotate = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [
      { rotate: `${(progress.value * Math.PI) / 4}rad` },
      { scale: interpolate(progress.value, [0, 1], [1, 0.9]) },
    ],
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#d1d1d1', '#000000']
    ),
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: interpolate(progress.value, [0, 1], [0, 1]),
    shadowRadius: interpolate(progress.value, [0, 1], [0, 150]),
  };
});

function App() {
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.container}
        data={new Array(10).fill(0)}
        renderItem={() => {
          return <PressableRotate style={styles.box} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    backgroundColor: '#fff',
    gap: 10,
  },
  box: {
    width: '95%',
    height: 120,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    backgroundColor: 'red',
    shadowRadius: 10,
    borderRadius: 35,
    borderCurve: 'continuous',
    alignSelf: 'center',
  },
});

const AppProvider = () => {
  return (
    <PressablesConfig
      animationType="spring"
      config={{
        mass: 2,
      }}
      globalHandlers={{
        onPress: () => {
          console.log('use haptics!');
        },
      }}
    >
      <App />
    </PressablesConfig>
  );
};

export default AppProvider;

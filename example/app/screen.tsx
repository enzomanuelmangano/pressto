import { createAnimatedPressable } from 'pressto';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { interpolate, interpolateColor } from 'react-native-reanimated';

const PressableRotate = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [
      { rotate: `${(progress * Math.PI) / 4}rad` },
      { scale: interpolate(progress, [0, 1], [1, 0.9]) },
    ],
    backgroundColor: interpolateColor(progress, [0, 1], ['#d1d1d1', '#000000']),
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: interpolate(progress, [0, 1], [0, 1]),
    shadowRadius: interpolate(progress, [0, 1], [0, 150]),
  };
});

export default function App() {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={new Array(1000).fill(0)}
      renderItem={() => {
        return (
          <PressableRotate
            onPress={() => {
              console.log('pressed');
            }}
            style={styles.box}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingTop: 15,
  },
  box: {
    width: '95%',
    height: 100,
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

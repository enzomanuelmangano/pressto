import {
  createAnimatedPressable,
  PressableOpacity,
  PressableScale,
  PressablesConfig,
} from 'pressto';
import { StyleSheet, View } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
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
      ['#e4e4e4', '#ffffff']
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
      <PressableRotate
        style={styles.box}
        onPress={() => {
          console.log('tap rotate :)');
        }}
      />
      <PressableScale
        style={styles.box}
        onPress={() => {
          console.log('tap scale :)');
        }}
      />
      <PressableOpacity
        style={styles.box}
        onPress={() => {
          console.log('tap opacity :)');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    gap: 25,
  },
  box: {
    width: 120,
    height: 120,
    backgroundColor: '#cbcbcb',
    borderRadius: 35,
    borderCurve: 'continuous',
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

export default gestureHandlerRootHOC(AppProvider);

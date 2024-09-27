import {
  createAnimatedPressable,
  PressableOpacity,
  PressableScale,
  PressablesConfig,
} from 'pressto';
import { StatusBar, StyleSheet, View } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { interpolate } from 'react-native-reanimated';

const PressableRotateScale = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [
      { rotate: `${(progress.value * Math.PI) / 4}rad` },
      { scale: interpolate(progress.value, [0, 1], [1, 0.9]) },
    ],
  };
});

function App() {
  return (
    <View style={styles.container}>
      <PressableRotateScale
        style={styles.box}
        onPress={() => {
          console.log('Tapping Rotate Scale');
        }}
      />
      <PressableScale
        style={styles.box}
        onPress={() => {
          console.log('Tapping Scale');
        }}
      />
      <PressableOpacity
        style={styles.box}
        onPress={() => {
          console.log('Tapping Opacity');
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
    backgroundColor: '#0062ff',
    borderRadius: 35,
    borderCurve: 'continuous',
  },
});

const AppProvider = () => {
  return (
    <PressablesConfig>
      <StatusBar barStyle="light-content" />
      <App />
    </PressablesConfig>
  );
};

export default gestureHandlerRootHOC(AppProvider);

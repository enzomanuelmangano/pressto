import {
  createAnimatedPressable,
  PressableOpacity,
  PressableScale,
  PressablesConfig,
} from 'pressto';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
          config={{
            duration: 100,
          }}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
  customBox: {
    backgroundColor: 'blue',
  },
});

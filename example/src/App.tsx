import {
  PressableOpacity,
  PressableScale,
  PressablesConfig,
} from '@reactiive/pressables';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <PressablesConfig animationType="spring">
      <GestureHandlerRootView style={styles.container}>
        <PressableScale onPress={() => console.log('pressed')}>
          <View style={styles.box} />
        </PressableScale>
        <PressableOpacity onPress={() => console.log('pressed')}>
          <View style={[styles.box, styles.customBox]} />
        </PressableOpacity>
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

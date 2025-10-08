import { Stack } from 'expo-router';
import { PressablesConfig } from 'pressto';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <PressablesConfig
      animationType="spring"
      config={{
        mass: 1,
        damping: 15,
        stiffness: 120,
        overshootClamping: false,
      }}
      globalHandlers={{
        onPress: () => {
          console.log('use haptics!');
        },
      }}
    >
      <GestureHandlerRootView style={styles.container}>
        <Stack />
      </GestureHandlerRootView>
    </PressablesConfig>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

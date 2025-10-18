import { Stack } from 'expo-router';
import { PressablesConfig } from 'pressto';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const globalHandlers = {
  onPress: () => {
    console.log('use haptics!');
  },
};

export default function RootLayout() {
  return (
    <PressablesConfig
      animationType="timing"
      activateOnHover
      globalHandlers={globalHandlers}
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

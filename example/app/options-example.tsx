import { createAnimatedPressable } from 'pressto';
import { StyleSheet, Text, View } from 'react-native';
import { interpolate, interpolateColor } from 'react-native-reanimated';

// Toggle-aware pressable that changes appearance based on toggle state
const PressableToggle = createAnimatedPressable((progress, options) => {
  'worklet';

  const isToggled = options?.toggled?.get() ?? false;

  // Base scale animation on press
  const scale = interpolate(progress.get(), [0, 1], [1, 0.95]);

  // Background color changes based on toggle state
  const backgroundColor = interpolateColor(
    progress.get(),
    [0, 1],
    isToggled
      ? ['#4CAF50', '#388E3C'] // Green when toggled
      : ['#2196F3', '#1976D2'] // Blue when not toggled
  );

  // Slight rotation when toggled
  const rotate = isToggled ? '5deg' : '0deg';

  return {
    transform: [{ scale }, { rotate }],
    backgroundColor,
  };
});

export default function OptionsExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toggle Example</Text>
      <Text style={styles.subtitle}>
        Tap buttons to toggle. Animation adapts to toggle state.
      </Text>

      <View style={styles.section}>
        <PressableToggle style={styles.item}>
          <Text style={styles.itemText}>Button 1</Text>
        </PressableToggle>

        <PressableToggle style={styles.item} onPress={() => {}}>
          <Text style={styles.itemText}>Button 2 (starts toggled)</Text>
        </PressableToggle>

        <PressableToggle style={styles.item} onPress={() => {}}>
          <Text style={styles.itemText}>Button 3</Text>
        </PressableToggle>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
  },
  section: {
    gap: 12,
  },
  item: {
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: '#fff',
  },
});

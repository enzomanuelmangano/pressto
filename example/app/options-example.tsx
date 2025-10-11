import { createAnimatedPressable } from 'pressto';
import { StyleSheet, Text, View } from 'react-native';
import { interpolate, interpolateColor } from 'react-native-reanimated';

// Pressable that responds to all three option states
const PressableToggle = createAnimatedPressable(
  (progress, { isPressed, isToggled, isSelected }) => {
    'worklet';

    // Base scale animation on press - uses progress AND isPressed
    const scale = interpolate(progress, [0, 1], [1, 0.95]);

    // Additional opacity change when actively pressed
    const opacity = isPressed ? 0.9 : 1;

    // Background color changes based on toggle state
    const backgroundColor = interpolateColor(
      progress,
      [0, 1],
      isToggled
        ? ['#4CAF50', '#388E3C'] // Green when toggled
        : ['#2196F3', '#1976D2'] // Blue when not toggled
    );

    // Slight rotation when toggled
    const rotate = isToggled ? '5deg' : '0deg';

    // Add a border for selected items
    const borderWidth = isSelected ? 3 : 0;
    const borderColor = '#FFD700'; // Gold border

    return {
      transform: [{ scale }, { rotate }],
      backgroundColor,
      borderWidth,
      borderColor,
      opacity,
    };
  }
);

export default function OptionsExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pressable Options Demo</Text>
      <Text style={styles.subtitle}>
        • isPressed: Active during press{'\n'}• isToggled: Flips on each press
        (green when toggled){'\n'}• isSelected: Gold border on last pressed
        button
      </Text>

      <View style={styles.section}>
        <PressableToggle style={styles.item}>
          <Text style={styles.itemText}>Button 1</Text>
        </PressableToggle>

        <PressableToggle
          style={styles.item}
          initialToggled={true}
          onPress={() => {}}
        >
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

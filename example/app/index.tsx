import { useRouter } from 'expo-router';
import { createAnimatedPressable } from 'pressto';
import { PressableGlass } from 'pressto/glass';
import { StyleSheet, Text, View } from 'react-native';
import { interpolate } from 'react-native-reanimated';

const PressableHighlight = createAnimatedPressable((progress) => {
  'worklet';
  const opacity = interpolate(progress, [0, 1], [0, 0.1]).toFixed(2);
  const scale = interpolate(progress, [0, 1], [1, 0.95]);

  return {
    backgroundColor: `rgba(255,255,255,${opacity})`,
    transform: [{ scale }],
  };
});

export default function Page() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <PressableGlass
        onPress={() => router.navigate('/screen')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Rotation Example</Text>
      </PressableGlass>

      <PressableHighlight
        onPress={() => router.navigate('/options-example')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Toggle Options</Text>
      </PressableHighlight>

      <PressableHighlight
        onPress={() => router.navigate('/metadata-example')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Theme Metadata</Text>
      </PressableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b3b3b3',
    gap: 20,
  },
  button: {
    backgroundColor: '#7a7a7a',
    height: 100,
    width: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

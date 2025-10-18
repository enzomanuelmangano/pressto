import { useRouter } from 'expo-router';
import { createAnimatedPressable } from 'pressto';
import { Platform, StyleSheet, Text, View } from 'react-native';
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
      <PressableHighlight
        onPress={() => router.navigate('/screen')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Rotation Example</Text>
      </PressableHighlight>

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
      {Platform.OS === 'web' && (
        <PressableHighlight
          onPress={() => console.log("won't activate on hover")}
          style={styles.button}
          activateOnHover={false}
        >
          <Text style={styles.buttonText}>Won&apos;t activate on hover</Text>
        </PressableHighlight>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    gap: 20,
  },
  button: {
    backgroundColor: 'black',
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

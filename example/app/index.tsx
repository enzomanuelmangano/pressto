import { useRouter } from 'expo-router';
import { createAnimatedPressable } from 'pressto';
import { StyleSheet, Text, View } from 'react-native';
import { interpolate } from 'react-native-reanimated';

const PressableHighlight = createAnimatedPressable((progress) => {
  'worklet';
  const opacity = interpolate(progress.get(), [0, 1], [0, 0.1]).toFixed(2);
  const scale = interpolate(progress.get(), [0, 1], [1, 0.95]);

  return {
    backgroundColor: `rgba(255,255,255,${opacity})`,
    transform: [{ scale }],
  };
});

export default function Page() {
  const router = useRouter();

  const handlePress = () => {
    router.navigate('/screen');
  };

  return (
    <View style={styles.container}>
      <PressableHighlight onPress={handlePress} style={styles.button}>
        <Text style={styles.buttonText}>Press me</Text>
      </PressableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  button: {
    backgroundColor: 'black',
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

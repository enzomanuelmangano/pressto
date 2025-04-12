import { useRouter } from 'expo-router';
import { PressableScale } from 'pressto';
import { StyleSheet, View } from 'react-native';

export default function Page() {
  const router = useRouter();

  const handlePress = () => {
    router.navigate('/screen');
  };

  return (
    <View style={styles.container}>
      <PressableScale onPress={handlePress} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
  },
});

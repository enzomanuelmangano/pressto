import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';

export default function Page() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => router.navigate('/screen')}
        style={{
          backgroundColor: 'red',
          padding: 10,
        }}
      />
    </View>
  );
}

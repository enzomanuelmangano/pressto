import { interpolate } from 'react-native-reanimated';
import { createAnimatedPressable } from '../hoc';

export const PressableOpacity = createAnimatedPressable((progress) => {
  'worklet';
  return {
    opacity: interpolate(progress.value, [0, 1], [1, 0.5]),
  };
});

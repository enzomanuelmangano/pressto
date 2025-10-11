import { interpolate } from 'react-native-reanimated';
import { createAnimatedPressable } from '../hoc';

export const PressableScale = createAnimatedPressable((progress) => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(progress, [0, 1], [1, 0.96]),
      },
    ],
  };
});

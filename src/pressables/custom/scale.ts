import { interpolate } from 'react-native-reanimated';
import { createAnimatedPressable } from '../hoc';

export const PressableScale = createAnimatedPressable((progress, { config }) => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(progress, [0, 1], [config.maxScale, config.minScale]),
      },
    ],
  };
});

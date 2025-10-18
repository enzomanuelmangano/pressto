import { interpolate } from 'react-native-reanimated';
import { createAnimatedPressable } from '../hoc';

export const PressableOpacity = createAnimatedPressable((progress, { config }) => {
  'worklet';
  return {
    opacity: interpolate(progress, [0, 1], [1, config.activeOpacity]),
  };
});

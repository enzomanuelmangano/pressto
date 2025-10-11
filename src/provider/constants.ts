import { Easing } from 'react-native-reanimated';

export const DefaultConfigs = {
  timing: { duration: 250, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  spring: {
    mass: 1,
    damping: 30,
    stiffness: 200,
  },
} as const;

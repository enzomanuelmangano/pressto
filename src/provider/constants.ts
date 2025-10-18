import { Easing } from 'react-native-reanimated';

export type PressableConfig = {
  activeOpacity: number;
  minScale: number;
  maxScale: number;
};

export const DefaultAnimationConfigs = {
  timing: { duration: 250, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  spring: {
    mass: 1,
    damping: 30,
    stiffness: 200,
  },
} as const;

export const DefaultPressableConfig: PressableConfig = {
  activeOpacity: 0.5,
  minScale: 0.96,
  maxScale: 1,
} as const;

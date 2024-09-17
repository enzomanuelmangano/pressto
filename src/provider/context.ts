import { createContext } from 'react';
import type {
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';
import { DefaultConfigs } from './constants';

export type AnimationType = 'timing' | 'spring';

export type PressableContextType<T extends AnimationType> = {
  animationType: T;
  config: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
};

export const PressablesContext = createContext<
  PressableContextType<AnimationType>
>({
  animationType: 'timing',
  config: DefaultConfigs.timing,
});

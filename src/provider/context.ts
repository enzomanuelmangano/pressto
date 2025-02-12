import { createContext } from 'react';
import type {
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';
import { DefaultConfigs } from './constants';
import type { GestureResponderEvent } from 'react-native';

export type AnimationType = 'timing' | 'spring';

export type PressableContextType<T extends AnimationType> = {
  animationType: T;
  config: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
  globalHandlers?: {
    onPressIn?: (event: GestureResponderEvent) => void;
    onPressOut?: (event: GestureResponderEvent) => void;
    onPress?: (event: GestureResponderEvent) => void;
  };
};

export const PressablesContext = createContext<
  PressableContextType<AnimationType>
>({
  animationType: 'timing',
  config: DefaultConfigs.timing,
});

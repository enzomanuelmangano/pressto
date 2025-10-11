import { createContext } from 'react';
import {
  makeMutable,
  type SharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';
import { DefaultConfigs } from './constants';

export type AnimationType = 'timing' | 'spring';

export type PressableContextType<T extends AnimationType> = {
  animationType: T;
  config: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
  globalHandlers?: {
    onPressIn?: () => void;
    onPressOut?: () => void;
    onPress?: () => void;
  };
};

export const PressablesContext = createContext<
  PressableContextType<AnimationType>
>({
  animationType: 'timing',
  config: DefaultConfigs.timing,
});

export const PressablesGroupContext = createContext<{
  lastTouchedPressable: SharedValue<string | null>;
}>({
  lastTouchedPressable: makeMutable<string | null>(null),
});

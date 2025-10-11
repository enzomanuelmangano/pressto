import { createContext } from 'react';
import {
  makeMutable,
  type SharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';
import { DefaultConfigs } from './constants';

export type AnimationType = 'timing' | 'spring';

export type PressableContextType<
  T extends AnimationType,
  TMetadata = unknown,
> = {
  animationType: T;
  config: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
  globalHandlers?: {
    onPressIn?: () => void;
    onPressOut?: () => void;
    onPress?: () => void;
  };
  metadata?: TMetadata;
};

export const PressablesContext = createContext<
  PressableContextType<AnimationType, unknown>
>({
  animationType: 'timing',
  config: DefaultConfigs.timing,
  metadata: undefined,
});

export const PressablesGroupContext = createContext<{
  lastTouchedPressable: SharedValue<string | null>;
}>({
  lastTouchedPressable: makeMutable<string | null>(null),
});

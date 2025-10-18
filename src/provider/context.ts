import { createContext } from 'react';
import {
  makeMutable,
  type SharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';
import { DefaultAnimationConfigs, DefaultPressableConfig, type PressableConfig } from './constants';

export type AnimationType = 'timing' | 'spring';

export type AnimatedPressableOptions = {
  isPressed: boolean;
  isToggled: boolean;
  isSelected: boolean;
};

export type PressableContextType<
  T extends AnimationType,
  TMetadata = unknown,
> = {
  animationType: T;
  animationConfig: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
  globalHandlers?: {
    onPressIn?: (options: AnimatedPressableOptions) => void;
    onPressOut?: (options: AnimatedPressableOptions) => void;
    onPress?: (options: AnimatedPressableOptions) => void;
  };
  metadata?: TMetadata;
  /**
   * Activates the pressable animation on hover (web only)
   * @platform web
   */
  activateOnHover?: boolean;
  /**
   * Pressable configuration values (opacity, scale, etc.)
   */
  config: PressableConfig;
};

export const PressablesContext = createContext<
  PressableContextType<AnimationType, unknown>
>({
  animationType: 'timing',
  animationConfig: DefaultAnimationConfigs.timing,
  metadata: undefined,
  config: DefaultPressableConfig,
});

export const PressablesGroupContext = createContext<{
  lastTouchedPressable: SharedValue<string | null>;
}>({
  lastTouchedPressable: makeMutable<string | null>(null),
});

import { useMemo, type PropsWithChildren } from 'react';
import {
  useSharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';

import { DefaultAnimationConfigs, DefaultPressableConfig, type PressableConfig } from './constants';
import {
  PressablesContext,
  PressablesGroupContext,
  type AnimatedPressableOptions,
  type AnimationType,
} from './context';

export type PressablesConfigProps<
  T extends AnimationType,
  TMetadata = unknown,
> = {
  children?: React.ReactNode;
  animationType?: T;
  animationConfig?: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
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
  config?: Partial<PressableConfig>;
};

export const PressablesGroup = ({ children }: PropsWithChildren) => {
  const lastTouchedPressable = useSharedValue<string | null>(null);

  const groupValue = useMemo(() => {
    return {
      lastTouchedPressable: lastTouchedPressable,
    };
  }, [lastTouchedPressable]);

  return (
    <PressablesGroupContext.Provider value={groupValue}>
      {children}
    </PressablesGroupContext.Provider>
  );
};

export const PressablesConfig = <T extends AnimationType, TMetadata = unknown>({
  children,
  animationType = 'timing' as T,
  animationConfig,
  globalHandlers,
  metadata,
  activateOnHover,
  config,
}: PressablesConfigProps<T, TMetadata>) => {
  const value = useMemo(() => {
    return {
      animationType,
      animationConfig: animationConfig ?? DefaultAnimationConfigs[animationType],
      globalHandlers,
      metadata,
      activateOnHover,
      config: { ...DefaultPressableConfig, ...config },
    };
  }, [animationType, animationConfig, globalHandlers, metadata, activateOnHover, config]);

  return (
    <PressablesContext.Provider value={value}>
      <PressablesGroup>{children}</PressablesGroup>
    </PressablesContext.Provider>
  );
};

export * from './hooks';
export type { PressableConfig } from './constants';

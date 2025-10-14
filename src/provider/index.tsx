import { useMemo, type PropsWithChildren } from 'react';
import {
  useSharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';

import { DefaultConfigs } from './constants';
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
  config?: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
  globalHandlers?: {
    onPressIn?: (options: AnimatedPressableOptions) => void;
    onPressOut?: (options: AnimatedPressableOptions) => void;
    onPress?: (options: AnimatedPressableOptions) => void;
  };
  metadata?: TMetadata;
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
  config,
  globalHandlers,
  metadata,
}: PressablesConfigProps<T, TMetadata>) => {
  const value = useMemo(() => {
    return {
      animationType,
      config: config ?? DefaultConfigs[animationType],
      globalHandlers,
      metadata,
    };
  }, [animationType, config, globalHandlers, metadata]);

  return (
    <PressablesContext.Provider value={value}>
      <PressablesGroup>{children}</PressablesGroup>
    </PressablesContext.Provider>
  );
};

export * from './hooks';

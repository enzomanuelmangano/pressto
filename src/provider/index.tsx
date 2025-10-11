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
  type AnimationType,
} from './context';

export type PressablesConfigProps<T extends AnimationType> = {
  children?: React.ReactNode;
  animationType?: T;
  config?: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
  globalHandlers?: {
    onPressIn?: () => void;
    onPressOut?: () => void;
    onPress?: () => void;
  };
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

export const PressablesConfig = <T extends AnimationType>({
  children,
  animationType = 'timing' as T,
  config,
  globalHandlers,
}: PressablesConfigProps<T>) => {
  const value = useMemo(() => {
    return {
      animationType,
      config: config ?? DefaultConfigs[animationType],
      globalHandlers,
    };
  }, [animationType, config, globalHandlers]);

  return (
    <PressablesContext.Provider value={value}>
      <PressablesGroup>{children}</PressablesGroup>
    </PressablesContext.Provider>
  );
};

export * from './hooks';

import { useMemo } from 'react';
import type {
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

import { DefaultConfigs } from './constants';
import { PressablesContext, type AnimationType } from './context';

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
      {children}
    </PressablesContext.Provider>
  );
};

export * from './hooks';

import { useMemo } from 'react';
import type {
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

import { DefaultConfigs } from './constants';
import { PressablesContext, type AnimationType } from './context';

export type PressablesConfigProps<T extends AnimationType> = {
  children: React.ReactNode;
  animationType?: T;
  config?: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
};

export const PressablesConfig = <T extends AnimationType>({
  children,
  animationType: animationTypeProp,
  config,
}: PressablesConfigProps<T>) => {
  const value = useMemo(() => {
    const animationType = animationTypeProp ?? 'timing';
    return {
      animationType: animationType as T,
      config: config ?? DefaultConfigs[animationType],
    };
  }, [animationTypeProp, config]);

  return (
    <PressablesContext.Provider value={value}>
      {children}
    </PressablesContext.Provider>
  );
};

export * from './hooks';

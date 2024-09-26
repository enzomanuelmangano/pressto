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
  onPressIn?: () => void;
  onPress?: () => void;
  onPressOut?: () => void;
};

export const PressablesConfig = <T extends AnimationType>({
  children,
  animationType = 'timing' as T,
  config,
  onPressIn,
  onPressOut,
  onPress,
}: PressablesConfigProps<T>) => {
  const value = useMemo(() => {
    return {
      animationType,
      config: config ?? DefaultConfigs[animationType],
      onPressIn,
      onPressOut,
      onPress,
    };
  }, [animationType, config, onPressIn, onPressOut, onPress]);

  return (
    <PressablesContext.Provider value={value}>
      {children}
    </PressablesContext.Provider>
  );
};

export * from './hooks';

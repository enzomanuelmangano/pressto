import React from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { BasePressableProps } from './base';
import { BasePressable } from './base';

export type PressableScaleProps = Omit<BasePressableProps, 'animatedStyle'>;

const withAnimatedTapStyle = (
  WrappedComponent: React.ComponentType<BasePressableProps>,
  animatedStyle: (progress: SharedValue<number>) => any
) => {
  return (props: PressableScaleProps) => {
    return <WrappedComponent {...props} animatedStyle={animatedStyle} />;
  };
};

export const createAnimatedPressable = (
  animatedStyle: (progress: SharedValue<number>) => any
) => {
  return withAnimatedTapStyle(BasePressable, animatedStyle);
};

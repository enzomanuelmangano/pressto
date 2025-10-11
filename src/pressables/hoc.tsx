import React from 'react';

import type { ViewStyle } from 'react-native';
import type { BasePressableProps } from './base';
import { BasePressable } from './base';

export type AnimatedPressableOptions = {
  toggled: boolean;
  isLastTouched: boolean;
};

export type CustomPressableProps = Omit<BasePressableProps, 'animatedStyle'> & {
  options?: AnimatedPressableOptions;
};

const withAnimatedTapStyle = (
  WrappedComponent: React.ComponentType<BasePressableProps>,
  animatedStyle: (
    progress: number,
    options?: AnimatedPressableOptions
  ) => ViewStyle
) => {
  return (props: CustomPressableProps) => {
    return <WrappedComponent {...props} animatedStyle={animatedStyle} />;
  };
};

export const createAnimatedPressable = (
  animatedStyle: (
    progress: number,
    options?: AnimatedPressableOptions
  ) => ViewStyle
) => {
  return withAnimatedTapStyle(BasePressable, animatedStyle);
};

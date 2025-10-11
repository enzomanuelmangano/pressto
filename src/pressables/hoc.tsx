import React from 'react';

import type { ViewStyle } from 'react-native';
import type { AnimatedPressableOptions, BasePressableProps } from './base';
import { BasePressable } from './base';

export type { AnimatedPressableOptions };

export type CustomPressableProps = Omit<BasePressableProps, 'animatedStyle'>;

const withAnimatedTapStyle = (
  WrappedComponent: React.ComponentType<BasePressableProps>,
  animatedStyle: (
    progress: number,
    options: AnimatedPressableOptions
  ) => ViewStyle
) => {
  return (props: CustomPressableProps) => {
    return <WrappedComponent {...props} animatedStyle={animatedStyle} />;
  };
};

export const createAnimatedPressable = (
  animatedStyle: (
    progress: number,
    options: AnimatedPressableOptions
  ) => ViewStyle
) => {
  return withAnimatedTapStyle(BasePressable, animatedStyle);
};

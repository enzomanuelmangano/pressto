import React from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { ViewStyle } from 'react-native';
import type { BasePressableProps } from './base';
import { BasePressable } from './base';

export type CustomPressableProps = Omit<BasePressableProps, 'animatedStyle'>;

const withAnimatedTapStyle = (
  WrappedComponent: React.ComponentType<BasePressableProps>,
  animatedStyle: (progress: SharedValue<number>) => ViewStyle
) => {
  return (props: CustomPressableProps) => {
    return <WrappedComponent {...props} animatedStyle={animatedStyle} />;
  };
};

export const createAnimatedPressable = (
  animatedStyle: (progress: SharedValue<number>) => ViewStyle
) => {
  return withAnimatedTapStyle(BasePressable, animatedStyle);
};

import React from 'react';
import type { SharedValue } from 'react-native-reanimated';

import type { ViewStyle } from 'react-native';
import type { BasePressableProps } from './base';
import { BasePressable } from './base';

export type AnimatedPressableOptions = {
  toggled: SharedValue<boolean>;
};

export type CustomPressableProps = Omit<BasePressableProps, 'animatedStyle'> & {
  options?: AnimatedPressableOptions;
};

const withAnimatedTapStyle = (
  WrappedComponent: React.ComponentType<BasePressableProps>,
  animatedStyle: (
    progress: SharedValue<number>,
    options?: AnimatedPressableOptions
  ) => ViewStyle
) => {
  return (props: CustomPressableProps) => {
    return (
      <WrappedComponent
        {...props}
        animatedStyle={animatedStyle}
        options={props.options}
      />
    );
  };
};

export const createAnimatedPressable = (
  animatedStyle: (
    progress: SharedValue<number>,
    options?: AnimatedPressableOptions
  ) => ViewStyle
) => {
  return withAnimatedTapStyle(BasePressable, animatedStyle);
};

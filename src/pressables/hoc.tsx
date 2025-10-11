import React from 'react';

import type { ViewStyle } from 'react-native';
import type { AnimatedPressableOptions } from '../provider/context';
import type { AnimatedPressableStyleOptions, BasePressableProps } from './base';
import { BasePressable } from './base';

export type { AnimatedPressableOptions, AnimatedPressableStyleOptions };

export type CustomPressableProps = Omit<BasePressableProps, 'animatedStyle'>;

const withAnimatedTapStyle = <TMetadata = unknown,>(
  WrappedComponent: React.ComponentType<BasePressableProps<TMetadata>>,
  animatedStyle: (
    progress: number,
    options: AnimatedPressableStyleOptions<TMetadata>
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

export const createAnimatedPressable = <TMetadata = unknown,>(
  animatedStyle: (
    progress: number,
    options: AnimatedPressableStyleOptions<TMetadata>
  ) => ViewStyle
) => {
  return withAnimatedTapStyle<TMetadata>(
    BasePressable as React.ComponentType<BasePressableProps<TMetadata>>,
    animatedStyle
  );
};

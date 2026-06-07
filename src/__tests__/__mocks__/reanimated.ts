import React from 'react';

const makeSharedValue = (init: any) => {
  let val = init;
  return {
    get value() {
      return val;
    },
    set value(v: any) {
      val = v;
    },
    get: () => val,
    set: (v: any) => {
      val = typeof v === 'function' ? v(val) : v;
    },
  };
};

export const useSharedValue = makeSharedValue;
export const makeMutable = makeSharedValue;

export const useDerivedValue = (fn: () => any) => {
  const result = fn();
  return { value: result, get: () => result };
};

export const useAnimatedStyle = (fn: () => any) => fn();
export const withTiming = (v: any) => v;
export const withSpring = (v: any) => v;
export const interpolate = (_v: any, _input: any[], output: any[]) =>
  output[0];
export const Easing = { bezier: () => ({}) };

const Animated = {
  createAnimatedComponent: (C: any) => C,
  View: (props: any) => React.createElement('View', props),
};

export default Animated;

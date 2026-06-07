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

// Real linear interpolation so style assertions are meaningful
export const interpolate = (
  value: number,
  input: number[],
  output: number[]
) => {
  const last = input.length - 1;
  if (value <= input[0]!) return output[0];
  if (value >= input[last]!) return output[last];
  for (let i = 1; i <= last; i++) {
    if (value <= input[i]!) {
      const t = (value - input[i - 1]!) / (input[i]! - input[i - 1]!);
      return output[i - 1]! + t * (output[i]! - output[i - 1]!);
    }
  }
  return output[last];
};

export const Easing = { bezier: () => ({}) };

const Animated = {
  createAnimatedComponent: (C: any) => C,
  View: (props: any) => React.createElement('View', props),
};

export default Animated;

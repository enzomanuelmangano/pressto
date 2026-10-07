import React from 'react';

// With async writes on, shared values behave as they do on the JS thread: a
// write is applied later on the UI thread (`__flushUI`) and a read right after
// a write still returns the previous value.
let asyncWrites = false;
const pendingWrites: (() => void)[] = [];
export const __setAsyncWrites = (enabled: boolean) => {
  asyncWrites = enabled;
};
export const __flushUI = () => {
  pendingWrites.splice(0).forEach((write) => write());
};

const makeSharedValue = (init: any) => {
  let val = init;
  const set = (v: any) => {
    const write = () => {
      val = typeof v === 'function' ? v(val) : v;
    };
    if (asyncWrites) {
      pendingWrites.push(write);
    } else {
      write();
    }
  };
  return {
    get value() {
      return val;
    },
    set value(v: any) {
      set(v);
    },
    get: () => val,
    set,
  };
};

export const useSharedValue = makeSharedValue;
export const makeMutable = makeSharedValue;

export const useDerivedValue = (fn: () => any) => {
  const result = fn();
  return { value: result, get: () => result };
};

export const useAnimatedStyle = (fn: () => any) => fn();
// Reactions only mirror external writes in the library; not driven in tests.
export const useAnimatedReaction = () => {};
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

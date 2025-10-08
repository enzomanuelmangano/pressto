import type { SharedValue } from 'react-native-reanimated';

export const unwrapSharedValue = <T>(base: SharedValue<T> | T): T => {
  'worklet';
  if (typeof base === 'object' && base !== null && 'value' in base) {
    return base.get();
  }
  return base;
};

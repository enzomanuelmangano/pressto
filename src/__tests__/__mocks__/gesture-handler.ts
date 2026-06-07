import React from 'react';
import { View } from 'react-native';

/**
 * Mocks RNGH's BaseButton as a host View that forwards the gesture
 * callbacks as props, so React Native Testing Library can:
 * - find it via queries (testID is forwarded)
 * - drive it via fireEvent(node, 'press' | 'began' | 'ended')
 *
 * When enabled === false the gesture callbacks are dropped, mirroring
 * RNGH ignoring touches on a disabled button.
 */
export const BaseButton = ({
  children,
  enabled,
  onPress,
  onBegan,
  onActivated,
  onEnded,
  onFailed,
  onCancelled,
  ...rest
}: any) => {
  const active = enabled !== false;
  return React.createElement(
    View,
    {
      ...rest,
      enabled,
      onPress: active ? onPress : undefined,
      onBegan: active ? (onBegan ?? onActivated) : undefined,
      onEnded: active ? (onEnded ?? onFailed ?? onCancelled) : undefined,
    },
    children
  );
};

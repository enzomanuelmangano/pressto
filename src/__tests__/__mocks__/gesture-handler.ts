import React from 'react';

/**
 * Mocks RNGH's BaseButton as a plain <button> element so tests can:
 * - trigger presses via props.onClick (mapped from onPress)
 * - assert interactivity via props.disabled (mapped from enabled === false)
 */
export const BaseButton = ({
  children,
  onPress,
  onBegan,
  onActivated,
  onEnded,
  enabled,
  ...rest
}: any) =>
  React.createElement(
    'button',
    {
      ...rest,
      disabled: enabled === false,
      onClick: enabled !== false ? onPress : undefined,
      onPointerDown: enabled !== false ? (onBegan ?? onActivated) : undefined,
      onPointerUp: enabled !== false ? onEnded : undefined,
    },
    children
  );

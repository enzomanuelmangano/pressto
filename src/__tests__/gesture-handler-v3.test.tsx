import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

/**
 * RNGH 3 exports `Touchable`, which pressto prefers over BaseButton. Mock it as
 * a host View forwarding its props so the press-in / press-out mapping and the
 * RNGH 2 -> 3 prop translation can be asserted.
 */
jest.mock('react-native-gesture-handler', () => {
  const { createElement } = require('react');
  const { View } = require('react-native');
  return {
    BaseButton: () => {
      throw new Error('BaseButton must not be used on RNGH 3');
    },
    Touchable: ({ children, ...props }: any) =>
      createElement(View, props, children),
  };
});

const { PressableScale } = require('../pressables/custom/scale');
const { isGestureHandlerV3 } = require('../pressables/gesture-button');

describe('RNGH 3 (Touchable)', () => {
  it('detects RNGH 3', () => {
    expect(isGestureHandlerV3).toBe(true);
  });

  it('maps onPressIn / onPressOut / onPress', () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const onPress = jest.fn();
    render(
      <PressableScale
        testID="p"
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      />
    );
    const button = screen.getByTestId('p');

    fireEvent(button, 'pressIn');
    expect(onPressIn).toHaveBeenCalledWith(
      expect.objectContaining({ isPressed: true })
    );

    fireEvent(button, 'pressOut');
    expect(onPressOut).toHaveBeenCalledWith(
      expect.objectContaining({ isPressed: false })
    );

    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledWith(
      expect.objectContaining({ isToggled: true })
    );
  });

  it('keeps the press alive outside the button by default, like BaseButton', () => {
    render(<PressableScale testID="p" />);
    expect(screen.getByTestId('p').props.cancelOnLeave).toBe(false);
  });

  it('translates enabled to disabled', () => {
    render(<PressableScale testID="p" disabled />);
    expect(screen.getByTestId('p').props.disabled).toBe(true);
  });

  it('drops RNGH 2 only props and maps the ripple', () => {
    render(
      <PressableScale
        testID="p"
        waitFor={React.createRef()}
        simultaneousHandlers={React.createRef()}
        shouldCancelWhenOutside={false}
        rippleColor="red"
        rippleRadius={10}
      />
    );
    const { props } = screen.getByTestId('p');
    expect(props.waitFor).toBeUndefined();
    expect(props.simultaneousHandlers).toBeUndefined();
    expect(props.onBegan).toBeUndefined();
    expect(props.cancelOnLeave).toBe(false);
    expect(props.androidRipple).toEqual({ color: 'red', radius: 10 });
  });
});

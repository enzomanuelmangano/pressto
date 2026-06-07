import React from 'react';
import { act, create } from 'react-test-renderer';
import type ReactTestRenderer from 'react-test-renderer';

import {
  createAnimatedPressable,
  PressableOpacity,
  PressableScale,
  PressablesConfig,
  PressableWithoutFeedback,
} from '../index';

function renderComponent(element: React.ReactElement) {
  let instance!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    instance = create(element);
  });
  return instance;
}

describe('exports', () => {
  it.each([
    ['PressableScale', PressableScale],
    ['PressableOpacity', PressableOpacity],
    ['PressableWithoutFeedback', PressableWithoutFeedback],
  ])('%s renders without crashing', (_name, Component) => {
    const instance = renderComponent(<Component />);
    expect(instance.toJSON()).toBeTruthy();
  });

  it('createAnimatedPressable creates a working component', () => {
    const CustomPressable = createAnimatedPressable((progress) => {
      'worklet';
      return { opacity: progress };
    });
    const instance = renderComponent(<CustomPressable />);
    expect(instance.toJSON()).toBeTruthy();
  });

  it('PressablesConfig renders children', () => {
    const instance = renderComponent(
      <PressablesConfig>
        <PressableScale testID="inner" />
      </PressablesConfig>
    );
    expect(instance.root.findByProps({ testID: 'inner' })).toBeTruthy();
  });
});

describe('press callbacks', () => {
  it('onPress receives options with isPressed/isToggled/isSelected', () => {
    const onPress = jest.fn();
    const instance = renderComponent(<PressableScale onPress={onPress} />);
    const button = instance.root.findByType('button' as any);
    act(() => button.props.onClick?.());
    expect(onPress).toHaveBeenCalledWith(
      expect.objectContaining({
        isPressed: expect.any(Boolean),
        isToggled: expect.any(Boolean),
        isSelected: expect.any(Boolean),
      })
    );
  });

  it('toggles isToggled on each press', () => {
    const onPress = jest.fn();
    const instance = renderComponent(
      <PressableScale initialToggled={false} onPress={onPress} />
    );
    const button = instance.root.findByType('button' as any);
    act(() => button.props.onClick?.());
    expect(onPress).toHaveBeenLastCalledWith(
      expect.objectContaining({ isToggled: true })
    );
    act(() => button.props.onClick?.());
    expect(onPress).toHaveBeenLastCalledWith(
      expect.objectContaining({ isToggled: false })
    );
  });

  it('global handlers from PressablesConfig fire alongside component handlers', () => {
    const globalOnPress = jest.fn();
    const onPress = jest.fn();
    const instance = renderComponent(
      <PressablesConfig globalHandlers={{ onPress: globalOnPress }}>
        <PressableScale onPress={onPress} />
      </PressablesConfig>
    );
    const button = instance.root.findByType('button' as any);
    act(() => button.props.onClick?.());
    expect(globalOnPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

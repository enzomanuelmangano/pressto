import React from 'react';
import { act, create } from 'react-test-renderer';
import type ReactTestRenderer from 'react-test-renderer';

import { PressableOpacity } from '../pressables/custom/opacity';
import { PressableScale } from '../pressables/custom/scale';
import { PressableWithoutFeedback } from '../pressables/custom/withoutFeedback';

// The gesture-handler mock renders BaseButton as a plain <button>
function getButton(instance: ReactTestRenderer.ReactTestRenderer) {
  return instance.root.findByType('button' as any);
}

function renderComponent(element: React.ReactElement) {
  let instance!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    instance = create(element);
  });
  return instance;
}

describe.each([
  ['PressableScale', PressableScale],
  ['PressableOpacity', PressableOpacity],
  ['PressableWithoutFeedback', PressableWithoutFeedback],
])('%s disabled prop', (_name, Component) => {
  it('calls onPress when interactive by default', () => {
    const onPress = jest.fn();
    const instance = renderComponent(<Component onPress={onPress} />);
    act(() => getButton(instance).props.onClick?.());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled={true}', () => {
    const onPress = jest.fn();
    const instance = renderComponent(<Component disabled onPress={onPress} />);
    act(() => getButton(instance).props.onClick?.());
    expect(onPress).not.toHaveBeenCalled();
  });

  it('calls onPress when disabled={false}', () => {
    const onPress = jest.fn();
    const instance = renderComponent(
      <Component disabled={false} onPress={onPress} />
    );
    act(() => getButton(instance).props.onClick?.());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when enabled={false} (backwards compat)', () => {
    const onPress = jest.fn();
    const instance = renderComponent(
      <Component enabled={false} onPress={onPress} />
    );
    act(() => getButton(instance).props.onClick?.());
    expect(onPress).not.toHaveBeenCalled();
  });

  it('disabled takes precedence over enabled', () => {
    const onPress = jest.fn();
    const instance = renderComponent(
      <Component disabled enabled onPress={onPress} />
    );
    act(() => getButton(instance).props.onClick?.());
    expect(onPress).not.toHaveBeenCalled();
  });

  it('enabled={false} with disabled={false} stays interactive (disabled wins)', () => {
    const onPress = jest.fn();
    const instance = renderComponent(
      <Component disabled={false} enabled={false} onPress={onPress} />
    );
    act(() => getButton(instance).props.onClick?.());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('passes enabled={false} to the underlying button when disabled', () => {
    const instance = renderComponent(<Component disabled />);
    expect(getButton(instance).props.disabled).toBe(true);
  });
});

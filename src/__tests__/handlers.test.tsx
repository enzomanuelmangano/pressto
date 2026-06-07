import React from 'react';
import { act, create } from 'react-test-renderer';
import type ReactTestRenderer from 'react-test-renderer';

import { PressablesConfig } from '../provider';
import { PressableScale } from '../pressables/custom/scale';

function renderComponent(element: React.ReactElement) {
  let instance!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    instance = create(element);
  });
  return instance;
}

function getButton(instance: ReactTestRenderer.ReactTestRenderer) {
  return instance.root.findByType('button' as any);
}

describe('component handlers', () => {
  it('fires onPressIn on press begin', () => {
    const onPressIn = jest.fn();
    const instance = renderComponent(<PressableScale onPressIn={onPressIn} />);
    act(() => getButton(instance).props.onPointerDown?.());
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressIn).toHaveBeenCalledWith(
      expect.objectContaining({
        isPressed: expect.any(Boolean),
        isToggled: expect.any(Boolean),
        isSelected: expect.any(Boolean),
      })
    );
  });

  it('fires onPressOut on press end', () => {
    const onPressOut = jest.fn();
    const instance = renderComponent(
      <PressableScale onPressOut={onPressOut} />
    );
    act(() => getButton(instance).props.onPointerUp?.());
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it('reports isPressed=true in onPressIn and false in onPressOut', () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const instance = renderComponent(
      <PressableScale onPressIn={onPressIn} onPressOut={onPressOut} />
    );
    const button = getButton(instance);
    act(() => button.props.onPointerDown?.());
    act(() => button.props.onPointerUp?.());
    expect(onPressIn).toHaveBeenCalledWith(
      expect.objectContaining({ isPressed: true })
    );
    expect(onPressOut).toHaveBeenCalledWith(
      expect.objectContaining({ isPressed: false })
    );
  });
});

describe('global handlers', () => {
  it('fires global onPressIn alongside component onPressIn', () => {
    const globalOnPressIn = jest.fn();
    const onPressIn = jest.fn();
    const instance = renderComponent(
      <PressablesConfig globalHandlers={{ onPressIn: globalOnPressIn }}>
        <PressableScale onPressIn={onPressIn} />
      </PressablesConfig>
    );
    act(() => getButton(instance).props.onPointerDown?.());
    expect(globalOnPressIn).toHaveBeenCalledTimes(1);
    expect(onPressIn).toHaveBeenCalledTimes(1);
  });

  it('fires global onPressOut alongside component onPressOut', () => {
    const globalOnPressOut = jest.fn();
    const onPressOut = jest.fn();
    const instance = renderComponent(
      <PressablesConfig globalHandlers={{ onPressOut: globalOnPressOut }}>
        <PressableScale onPressOut={onPressOut} />
      </PressablesConfig>
    );
    act(() => getButton(instance).props.onPointerUp?.());
    expect(globalOnPressOut).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it('fires global onPress when component has no onPress', () => {
    const globalOnPress = jest.fn();
    const instance = renderComponent(
      <PressablesConfig globalHandlers={{ onPress: globalOnPress }}>
        <PressableScale />
      </PressablesConfig>
    );
    act(() => getButton(instance).props.onClick?.());
    expect(globalOnPress).toHaveBeenCalledTimes(1);
  });
});

describe('toggle behaviour', () => {
  it('starts toggled=true when initialToggled and flips to false on first press', () => {
    const onPress = jest.fn();
    const instance = renderComponent(
      <PressableScale initialToggled onPress={onPress} />
    );
    act(() => getButton(instance).props.onClick?.());
    expect(onPress).toHaveBeenLastCalledWith(
      expect.objectContaining({ isToggled: false })
    );
  });

  it('flips toggle on each consecutive press', () => {
    const onPress = jest.fn();
    const instance = renderComponent(<PressableScale onPress={onPress} />);
    const button = getButton(instance);
    act(() => button.props.onClick?.());
    act(() => button.props.onClick?.());
    act(() => button.props.onClick?.());
    expect(onPress.mock.calls.map((c) => c[0].isToggled)).toEqual([
      true,
      false,
      true,
    ]);
  });
});

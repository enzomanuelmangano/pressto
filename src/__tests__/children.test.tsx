import React from 'react';
import { act, create } from 'react-test-renderer';
import type ReactTestRenderer from 'react-test-renderer';

import { PressableScale } from '../pressables/custom/scale';

function renderComponent(element: React.ReactElement) {
  let instance!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    instance = create(element);
  });
  return instance;
}

describe('children render prop', () => {
  it('calls children function with animation params', () => {
    const childrenFn = jest.fn(() => null);
    renderComponent(<PressableScale>{childrenFn}</PressableScale>);
    expect(childrenFn).toHaveBeenCalledWith(
      expect.objectContaining({
        progress: expect.anything(),
        isPressed: expect.anything(),
        isToggled: expect.anything(),
        isSelected: expect.anything(),
        withAnimation: expect.any(Function),
      })
    );
  });

  it('renders the node returned by the children function', () => {
    const instance = renderComponent(
      <PressableScale>
        {() => React.createElement('Text', { testID: 'render-prop-child' })}
      </PressableScale>
    );
    expect(
      instance.root.findByProps({ testID: 'render-prop-child' })
    ).toBeTruthy();
  });

  it('renders static children when not a function', () => {
    const instance = renderComponent(
      <PressableScale>
        {React.createElement('Text', { testID: 'static-child' })}
      </PressableScale>
    );
    expect(instance.root.findByProps({ testID: 'static-child' })).toBeTruthy();
  });

  it('exposes a worklet-safe withAnimation that returns its value', () => {
    let result: number | undefined;
    renderComponent(
      <PressableScale>
        {({ withAnimation }) => {
          result = withAnimation(42);
          return null;
        }}
      </PressableScale>
    );
    expect(result).toBe(42);
  });
});

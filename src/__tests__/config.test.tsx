import React from 'react';
import { act, create } from 'react-test-renderer';
import type ReactTestRenderer from 'react-test-renderer';

import { PressablesConfig } from '../provider';
import { PressableOpacity } from '../pressables/custom/opacity';
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

// rAnimatedStyle is the second entry of the style array on the button
function getAnimatedStyle(instance: ReactTestRenderer.ReactTestRenderer) {
  return getButton(instance).props.style[1];
}

describe('defaultProps from PressablesConfig', () => {
  it('applies defaultProps to pressables', () => {
    const instance = renderComponent(
      <PressablesConfig defaultProps={{ rippleColor: 'red' }}>
        <PressableScale />
      </PressablesConfig>
    );
    expect(getButton(instance).props.rippleColor).toBe('red');
  });

  it('lets component props override defaultProps', () => {
    const instance = renderComponent(
      <PressablesConfig defaultProps={{ rippleColor: 'red' }}>
        <PressableScale rippleColor="blue" />
      </PressablesConfig>
    );
    expect(getButton(instance).props.rippleColor).toBe('blue');
  });

  it('passes testID through from defaultProps', () => {
    const instance = renderComponent(
      <PressablesConfig defaultProps={{ testID: 'shared' }}>
        <PressableScale />
      </PressablesConfig>
    );
    expect(getButton(instance).props.testID).toBe('shared');
  });
});

describe('config values flow into animated style (idle state)', () => {
  it('PressableScale uses default baseScale of 1 at idle', () => {
    const instance = renderComponent(<PressableScale />);
    expect(getAnimatedStyle(instance)).toEqual({
      transform: [{ scale: 1 }],
    });
  });

  it('PressableScale honours custom baseScale from config', () => {
    const instance = renderComponent(
      <PressablesConfig config={{ baseScale: 1.05 }}>
        <PressableScale />
      </PressablesConfig>
    );
    expect(getAnimatedStyle(instance)).toEqual({
      transform: [{ scale: 1.05 }],
    });
  });

  it('PressableOpacity is fully opaque at idle', () => {
    const instance = renderComponent(<PressableOpacity />);
    expect(getAnimatedStyle(instance)).toEqual({ opacity: 1 });
  });

  it('partial config merges with defaults', () => {
    // only override activeOpacity; baseScale should still default to 1
    const instance = renderComponent(
      <PressablesConfig config={{ activeOpacity: 0.2 }}>
        <PressableScale />
      </PressablesConfig>
    );
    expect(getAnimatedStyle(instance)).toEqual({
      transform: [{ scale: 1 }],
    });
  });
});

describe('style prop', () => {
  it('passes user style as the first style array entry', () => {
    const userStyle = { margin: 10 };
    const instance = renderComponent(<PressableScale style={userStyle} />);
    expect(getButton(instance).props.style[0]).toEqual(userStyle);
  });
});

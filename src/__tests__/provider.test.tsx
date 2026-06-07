import React from 'react';
import { act, create } from 'react-test-renderer';
import type ReactTestRenderer from 'react-test-renderer';

import { PressablesConfig } from '../provider';
import {
  usePressablesConfig,
  useLastTouchedPressable,
} from '../provider/hooks';
import { DefaultPressableConfig } from '../provider/constants';

function renderComponent(element: React.ReactElement) {
  let instance!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    instance = create(element);
  });
  return instance;
}

// Probe component that exposes a hook's return value via a captured ref
function makeProbe<T>(useHook: () => T) {
  const captured: { current: T | undefined } = { current: undefined };
  const Probe = () => {
    captured.current = useHook();
    return null;
  };
  return { Probe, captured };
}

describe('usePressablesConfig', () => {
  it('returns sensible defaults with no provider', () => {
    const { Probe, captured } = makeProbe(usePressablesConfig);
    renderComponent(<Probe />);
    expect(captured.current).toMatchObject({
      animationType: 'timing',
      config: DefaultPressableConfig,
    });
  });

  it('reflects provider animationType', () => {
    const { Probe, captured } = makeProbe(usePressablesConfig);
    renderComponent(
      <PressablesConfig animationType="spring">
        <Probe />
      </PressablesConfig>
    );
    expect(captured.current?.animationType).toBe('spring');
  });

  it('merges partial config with defaults', () => {
    const { Probe, captured } = makeProbe(usePressablesConfig);
    renderComponent(
      <PressablesConfig config={{ activeOpacity: 0.1 }}>
        <Probe />
      </PressablesConfig>
    );
    expect(captured.current?.config).toEqual({
      ...DefaultPressableConfig,
      activeOpacity: 0.1,
    });
  });
});

describe('useLastTouchedPressable', () => {
  it('returns a shared value with a null initial value', () => {
    const { Probe, captured } = makeProbe(useLastTouchedPressable);
    renderComponent(
      <PressablesConfig>
        <Probe />
      </PressablesConfig>
    );
    expect(captured.current?.get()).toBeNull();
  });
});

import { render } from '@testing-library/react-native';

import { PressablesConfig } from '../provider';
import {
  usePressablesConfig,
  useLastTouchedPressable,
} from '../provider/hooks';
import { DefaultPressableConfig } from '../provider/constants';

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
    render(<Probe />);
    expect(captured.current).toMatchObject({
      animationType: 'timing',
      config: DefaultPressableConfig,
    });
  });

  it('reflects provider animationType', () => {
    const { Probe, captured } = makeProbe(usePressablesConfig);
    render(
      <PressablesConfig animationType="spring">
        <Probe />
      </PressablesConfig>
    );
    expect(captured.current?.animationType).toBe('spring');
  });

  it('merges partial config with defaults', () => {
    const { Probe, captured } = makeProbe(usePressablesConfig);
    render(
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
    render(
      <PressablesConfig>
        <Probe />
      </PressablesConfig>
    );
    expect(captured.current?.get()).toBeNull();
  });
});

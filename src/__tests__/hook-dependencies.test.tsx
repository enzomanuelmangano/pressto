import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';

/**
 * Reanimated ignores hook dependency arrays on native and logs "Dependencies
 * should only be used on the web" once per call site that passes one. Record
 * what BasePressable passes to each Reanimated hook.
 */
const passedDeps: unknown[] = [];

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('./__mocks__/reanimated');
  return {
    ...actual,
    __esModule: true,
    useDerivedValue: (fn: () => any, deps?: unknown) => {
      passedDeps.push(deps);
      return actual.useDerivedValue(fn);
    },
    useAnimatedStyle: (fn: () => any, deps?: unknown) => {
      passedDeps.push(deps);
      return actual.useAnimatedStyle(fn);
    },
  };
});

const { PressableScale } = require('../pressables/custom/scale');

const originalOS = Platform.OS;

beforeEach(() => {
  passedDeps.length = 0;
});

afterEach(() => {
  (Platform as any).OS = originalOS;
});

describe('Reanimated hook dependencies', () => {
  it('passes no dependency arrays on native', () => {
    (Platform as any).OS = 'ios';
    render(<PressableScale testID="p" />);
    expect(passedDeps.length).toBeGreaterThan(0);
    passedDeps.forEach((deps) => expect(deps).toBeUndefined());
  });

  it('keeps the dependency arrays on web', () => {
    (Platform as any).OS = 'web';
    render(<PressableScale testID="p" />);
    expect(passedDeps.length).toBeGreaterThan(0);
    passedDeps.forEach((deps) => expect(Array.isArray(deps)).toBe(true));
  });
});

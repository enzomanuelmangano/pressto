import { render, screen } from '@testing-library/react-native';

import { createAnimatedPressable } from '../pressables/hoc';
import { PressableScale } from '../pressables/custom/scale';
import { PressablesConfig } from '../provider';

// Probe pressable that echoes the resolved config straight into the style,
// so config plumbing is observable without needing a real press animation.
const ConfigProbe = createAnimatedPressable((_progress, { config }) => {
  'worklet';
  return {
    opacity: config.activeOpacity,
    transform: [{ scale: config.minScale }],
    margin: config.baseScale,
  };
});

const animatedStyleOf = (testID: string) =>
  screen.getByTestId(testID).props.style[1];

describe('per-component config (#25)', () => {
  it('reaches animatedStyle from a component-level config prop', () => {
    render(
      <ConfigProbe
        testID="p"
        config={{ activeOpacity: 0.7, minScale: 0.9, baseScale: 1.1 }}
      />
    );
    expect(animatedStyleOf('p')).toEqual({
      opacity: 0.7,
      transform: [{ scale: 0.9 }],
      margin: 1.1,
    });
  });

  it('shallow-merges over PressablesConfig config (override one key, keep rest)', () => {
    render(
      <PressablesConfig config={{ activeOpacity: 0.3, minScale: 0.8 }}>
        <ConfigProbe testID="p" config={{ activeOpacity: 0.7 }} />
      </PressablesConfig>
    );
    // activeOpacity overridden per component; minScale inherited from config;
    // baseScale falls back to the default (1).
    expect(animatedStyleOf('p')).toEqual({
      opacity: 0.7,
      transform: [{ scale: 0.8 }],
      margin: 1,
    });
  });

  it('falls back to defaults when nothing is set', () => {
    render(<ConfigProbe testID="p" />);
    expect(animatedStyleOf('p')).toEqual({
      opacity: 0.5, // DefaultPressableConfig.activeOpacity
      transform: [{ scale: 0.96 }], // minScale
      margin: 1, // baseScale
    });
  });

  it('PressableScale honours a per-component baseScale at idle', () => {
    render(<PressableScale testID="p" config={{ baseScale: 2 }} />);
    // idle progress=0 -> scale = baseScale
    expect(animatedStyleOf('p')).toEqual({ transform: [{ scale: 2 }] });
  });

  it('component config wins over PressablesConfig for the same key', () => {
    render(
      <PressablesConfig config={{ baseScale: 1.5 }}>
        <PressableScale testID="p" config={{ baseScale: 3 }} />
      </PressablesConfig>
    );
    expect(animatedStyleOf('p')).toEqual({ transform: [{ scale: 3 }] });
  });
});

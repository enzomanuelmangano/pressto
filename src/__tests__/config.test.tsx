import { render, screen } from '@testing-library/react-native';

import { PressablesConfig } from '../provider';
import { PressableOpacity } from '../pressables/custom/opacity';
import { PressableScale } from '../pressables/custom/scale';

// rAnimatedStyle is the second entry of the style array on the button
function animatedStyleOf(testID: string) {
  return screen.getByTestId(testID).props.style[1];
}

describe('defaultProps from PressablesConfig', () => {
  it('applies defaultProps to pressables', () => {
    render(
      <PressablesConfig defaultProps={{ rippleColor: 'red' }}>
        <PressableScale testID="p" />
      </PressablesConfig>
    );
    expect(screen.getByTestId('p').props.rippleColor).toBe('red');
  });

  it('lets component props override defaultProps', () => {
    render(
      <PressablesConfig defaultProps={{ rippleColor: 'red' }}>
        <PressableScale testID="p" rippleColor="blue" />
      </PressablesConfig>
    );
    expect(screen.getByTestId('p').props.rippleColor).toBe('blue');
  });

  it('passes testID through from defaultProps', () => {
    render(
      <PressablesConfig defaultProps={{ testID: 'shared' }}>
        <PressableScale />
      </PressablesConfig>
    );
    expect(screen.getByTestId('shared')).toBeTruthy();
  });
});

describe('config values flow into animated style (idle state)', () => {
  it('PressableScale uses default baseScale of 1 at idle', () => {
    render(<PressableScale testID="p" />);
    expect(animatedStyleOf('p')).toEqual({ transform: [{ scale: 1 }] });
  });

  it('PressableScale honours custom baseScale from config', () => {
    render(
      <PressablesConfig config={{ baseScale: 1.05 }}>
        <PressableScale testID="p" />
      </PressablesConfig>
    );
    expect(animatedStyleOf('p')).toEqual({ transform: [{ scale: 1.05 }] });
  });

  it('PressableOpacity is fully opaque at idle', () => {
    render(<PressableOpacity testID="p" />);
    expect(animatedStyleOf('p')).toEqual({ opacity: 1 });
  });

  it('partial config merges with defaults', () => {
    // only override activeOpacity; baseScale should still default to 1
    render(
      <PressablesConfig config={{ activeOpacity: 0.2 }}>
        <PressableScale testID="p" />
      </PressablesConfig>
    );
    expect(animatedStyleOf('p')).toEqual({ transform: [{ scale: 1 }] });
  });
});

describe('style prop', () => {
  it('passes user style as the first style array entry', () => {
    const userStyle = { margin: 10 };
    render(<PressableScale testID="p" style={userStyle} />);
    expect(screen.getByTestId('p').props.style[0]).toEqual(userStyle);
  });
});

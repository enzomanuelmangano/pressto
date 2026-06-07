import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { PressableOpacity } from '../pressables/custom/opacity';
import { PressableScale } from '../pressables/custom/scale';
import { PressableWithoutFeedback } from '../pressables/custom/withoutFeedback';

/**
 * pressto gates interaction through RNGH BaseButton's `enabled` prop, which
 * RNGH honours natively. Testing Library's fireEvent does not understand
 * `enabled` (only disabled / pointerEvents / accessibilityState), so the unit
 * boundary we assert here is pressto's resolution logic: that `disabled` and
 * the deprecated `enabled` collapse to the correct `enabled` value forwarded to
 * the underlying button. Actual touch-blocking is RNGH's responsibility.
 */
describe.each([
  ['PressableScale', PressableScale],
  ['PressableOpacity', PressableOpacity],
  ['PressableWithoutFeedback', PressableWithoutFeedback],
])('%s enabled resolution', (_name, Component) => {
  const resolvedEnabled = (element: React.ReactElement) => {
    render(element);
    return screen.getByTestId('p').props.enabled;
  };

  it('defaults to enabled', () => {
    expect(resolvedEnabled(<Component testID="p" />)).toBe(true);
  });

  it('disabled={true} -> enabled=false', () => {
    expect(resolvedEnabled(<Component testID="p" disabled />)).toBe(false);
  });

  it('disabled={false} -> enabled=true', () => {
    expect(resolvedEnabled(<Component testID="p" disabled={false} />)).toBe(
      true
    );
  });

  it('enabled={false} (deprecated) -> enabled=false', () => {
    expect(resolvedEnabled(<Component testID="p" enabled={false} />)).toBe(
      false
    );
  });

  it('disabled takes precedence over enabled (disabled + enabled -> false)', () => {
    expect(resolvedEnabled(<Component testID="p" disabled enabled />)).toBe(
      false
    );
  });

  it('disabled={false} wins over enabled={false} -> enabled=true', () => {
    expect(
      resolvedEnabled(<Component testID="p" disabled={false} enabled={false} />)
    ).toBe(true);
  });
});

describe('PressableScale press behaviour when interactive', () => {
  it('fires onPress by default', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('fires onPress when disabled={false}', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" disabled={false} onPress={onPress} />);
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

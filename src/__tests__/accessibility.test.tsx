import { render, screen } from '@testing-library/react-native';

import { PressableOpacity } from '../pressables/custom/opacity';
import { PressableScale } from '../pressables/custom/scale';
import { PressableWithoutFeedback } from '../pressables/custom/withoutFeedback';

describe.each([
  ['PressableScale', PressableScale],
  ['PressableOpacity', PressableOpacity],
  ['PressableWithoutFeedback', PressableWithoutFeedback],
])('%s accessibility identifier', (_name, Component) => {
  it('mirrors testID to accessibilityIdentifier', () => {
    render(<Component testID="save-button" />);
    expect(screen.getByTestId('save-button').props.accessibilityIdentifier).toBe(
      'save-button'
    );
  });

  it('lets an explicit accessibilityIdentifier override testID', () => {
    render(
      <Component testID="save-button" accessibilityIdentifier="custom-id" />
    );
    expect(screen.getByTestId('save-button').props.accessibilityIdentifier).toBe(
      'custom-id'
    );
  });

  it('is accessible by default', () => {
    render(<Component testID="p" />);
    expect(screen.getByTestId('p').props.accessible).toBe(true);
  });

  it('respects an explicit accessible={false}', () => {
    render(<Component testID="p" accessible={false} />);
    expect(screen.getByTestId('p').props.accessible).toBe(false);
  });
});

describe('accessibilityIdentifier from defaultProps testID fallback', () => {
  it('falls back to testID when no explicit identifier is given', () => {
    render(<PressableScale testID="only-test-id" />);
    const el = screen.getByTestId('only-test-id');
    expect(el.props.accessibilityIdentifier).toBe('only-test-id');
  });
});

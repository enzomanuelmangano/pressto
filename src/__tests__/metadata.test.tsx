import { render, screen, fireEvent } from '@testing-library/react-native';

import { PressablesConfig } from '../provider';
import { PressableScale } from '../pressables/custom/scale';

describe('per-component metadata', () => {
  it('reaches the component onPress handler', () => {
    const onPress = jest.fn();
    render(
      <PressableScale testID="p" metadata={{ name: 'checkout' }} onPress={onPress} />
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { name: 'checkout' } })
    );
  });

  it('reaches a global onPress handler (issue #26)', () => {
    const globalOnPress = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPress: globalOnPress }}>
        <PressableScale testID="p" metadata={{ name: 'checkout' }} />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(globalOnPress).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { name: 'checkout' } })
    );
  });

  it('reaches onPressIn and onPressOut handlers', () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    render(
      <PressableScale
        testID="p"
        metadata={{ name: 'x' }}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      />
    );
    const button = screen.getByTestId('p');
    fireEvent(button, 'began');
    fireEvent(button, 'ended');
    expect(onPressIn).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { name: 'x' } })
    );
    expect(onPressOut).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { name: 'x' } })
    );
  });

  it('overrides PressablesConfig metadata', () => {
    const globalOnPress = jest.fn();
    render(
      <PressablesConfig
        metadata={{ name: 'global' }}
        globalHandlers={{ onPress: globalOnPress }}
      >
        <PressableScale testID="p" metadata={{ name: 'local' }} />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(globalOnPress).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { name: 'local' } })
    );
  });

  it('falls back to PressablesConfig metadata when the component omits it', () => {
    const globalOnPress = jest.fn();
    render(
      <PressablesConfig
        metadata={{ name: 'global' }}
        globalHandlers={{ onPress: globalOnPress }}
      >
        <PressableScale testID="p" />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(globalOnPress).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { name: 'global' } })
    );
  });

  it('is undefined when set nowhere', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress.mock.calls[0][0].metadata).toBeUndefined();
  });
});

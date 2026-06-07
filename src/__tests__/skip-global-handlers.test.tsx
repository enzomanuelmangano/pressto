import { render, screen, fireEvent } from '@testing-library/react-native';

import { PressablesConfig } from '../provider';
import { PressableScale } from '../pressables/custom/scale';

describe('skipGlobalHandlers', () => {
  it('opts out of the global onPress handler (issue #30)', () => {
    const globalOnPress = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPress: globalOnPress }}>
        <PressableScale testID="p" skipGlobalHandlers />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(globalOnPress).not.toHaveBeenCalled();
  });

  it('still fires the component own onPress', () => {
    const globalOnPress = jest.fn();
    const onPress = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPress: globalOnPress }}>
        <PressableScale testID="p" skipGlobalHandlers onPress={onPress} />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(globalOnPress).not.toHaveBeenCalled();
  });

  it('also skips global onPressIn and onPressOut', () => {
    const globalOnPressIn = jest.fn();
    const globalOnPressOut = jest.fn();
    render(
      <PressablesConfig
        globalHandlers={{
          onPressIn: globalOnPressIn,
          onPressOut: globalOnPressOut,
        }}
      >
        <PressableScale testID="p" skipGlobalHandlers />
      </PressablesConfig>
    );
    const button = screen.getByTestId('p');
    fireEvent(button, 'began');
    fireEvent(button, 'ended');
    expect(globalOnPressIn).not.toHaveBeenCalled();
    expect(globalOnPressOut).not.toHaveBeenCalled();
  });

  it('global handlers fire when skipGlobalHandlers is not set', () => {
    const globalOnPress = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPress: globalOnPress }}>
        <PressableScale testID="p" />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(globalOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not break a pressable with no global handlers', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" skipGlobalHandlers onPress={onPress} />);
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, fireEvent } from '@testing-library/react-native';

import {
  createAnimatedPressable,
  PressableOpacity,
  PressableScale,
  PressablesConfig,
  PressableWithoutFeedback,
} from '../index';

describe('exports', () => {
  it.each([
    ['PressableScale', PressableScale],
    ['PressableOpacity', PressableOpacity],
    ['PressableWithoutFeedback', PressableWithoutFeedback],
  ])('%s renders without crashing', (_name, Component) => {
    render(<Component testID="p" />);
    expect(screen.getByTestId('p')).toBeTruthy();
  });

  it('createAnimatedPressable creates a working component', () => {
    const CustomPressable = createAnimatedPressable((progress) => {
      'worklet';
      return { opacity: progress };
    });
    render(<CustomPressable testID="custom" />);
    expect(screen.getByTestId('custom')).toBeTruthy();
  });

  it('PressablesConfig renders children', () => {
    render(
      <PressablesConfig>
        <PressableScale testID="inner" />
      </PressablesConfig>
    );
    expect(screen.getByTestId('inner')).toBeTruthy();
  });
});

describe('press callbacks', () => {
  it('onPress receives options with isPressed/isToggled/isSelected', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenCalledWith(
      expect.objectContaining({
        isPressed: expect.any(Boolean),
        isToggled: expect.any(Boolean),
        isSelected: expect.any(Boolean),
      })
    );
  });

  it('toggles isToggled on each press', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" initialToggled={false} onPress={onPress} />);
    const button = screen.getByTestId('p');
    fireEvent.press(button);
    expect(onPress).toHaveBeenLastCalledWith(
      expect.objectContaining({ isToggled: true })
    );
    fireEvent.press(button);
    expect(onPress).toHaveBeenLastCalledWith(
      expect.objectContaining({ isToggled: false })
    );
  });

  it('global handlers from PressablesConfig fire alongside component handlers', () => {
    const globalOnPress = jest.fn();
    const onPress = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPress: globalOnPress }}>
        <PressableScale testID="p" onPress={onPress} />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(globalOnPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

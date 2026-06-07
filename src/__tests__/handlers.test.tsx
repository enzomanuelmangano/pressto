import { render, screen, fireEvent } from '@testing-library/react-native';

import { PressablesConfig } from '../provider';
import { PressableScale } from '../pressables/custom/scale';

// pressto maps press-in to RNGH's onBegan and press-out to onEnded;
// the gesture-handler mock forwards those as 'began'/'ended' events.
const pressIn = (el: any) => fireEvent(el, 'began');
const pressOut = (el: any) => fireEvent(el, 'ended');

describe('component handlers', () => {
  it('fires onPressIn on press begin', () => {
    const onPressIn = jest.fn();
    render(<PressableScale testID="p" onPressIn={onPressIn} />);
    pressIn(screen.getByTestId('p'));
    expect(onPressIn).toHaveBeenCalledTimes(1);
    expect(onPressIn).toHaveBeenCalledWith(
      expect.objectContaining({
        isPressed: expect.any(Boolean),
        isToggled: expect.any(Boolean),
        isSelected: expect.any(Boolean),
      })
    );
  });

  it('fires onPressOut on press end', () => {
    const onPressOut = jest.fn();
    render(<PressableScale testID="p" onPressOut={onPressOut} />);
    pressOut(screen.getByTestId('p'));
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it('reports isPressed=true in onPressIn and false in onPressOut', () => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    render(
      <PressableScale
        testID="p"
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      />
    );
    const button = screen.getByTestId('p');
    pressIn(button);
    pressOut(button);
    expect(onPressIn).toHaveBeenCalledWith(
      expect.objectContaining({ isPressed: true })
    );
    expect(onPressOut).toHaveBeenCalledWith(
      expect.objectContaining({ isPressed: false })
    );
  });
});

describe('global handlers', () => {
  it('fires global onPressIn alongside component onPressIn', () => {
    const globalOnPressIn = jest.fn();
    const onPressIn = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPressIn: globalOnPressIn }}>
        <PressableScale testID="p" onPressIn={onPressIn} />
      </PressablesConfig>
    );
    pressIn(screen.getByTestId('p'));
    expect(globalOnPressIn).toHaveBeenCalledTimes(1);
    expect(onPressIn).toHaveBeenCalledTimes(1);
  });

  it('fires global onPressOut alongside component onPressOut', () => {
    const globalOnPressOut = jest.fn();
    const onPressOut = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPressOut: globalOnPressOut }}>
        <PressableScale testID="p" onPressOut={onPressOut} />
      </PressablesConfig>
    );
    pressOut(screen.getByTestId('p'));
    expect(globalOnPressOut).toHaveBeenCalledTimes(1);
    expect(onPressOut).toHaveBeenCalledTimes(1);
  });

  it('fires global onPress when component has no onPress', () => {
    const globalOnPress = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPress: globalOnPress }}>
        <PressableScale testID="p" />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(globalOnPress).toHaveBeenCalledTimes(1);
  });
});

describe('toggle behaviour', () => {
  it('starts toggled=true when initialToggled and flips to false on first press', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" initialToggled onPress={onPress} />);
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenLastCalledWith(
      expect.objectContaining({ isToggled: false })
    );
  });

  it('flips toggle on each consecutive press', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" onPress={onPress} />);
    const button = screen.getByTestId('p');
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);
    expect(onPress.mock.calls.map((c) => c[0].isToggled)).toEqual([
      true,
      false,
      true,
    ]);
  });
});

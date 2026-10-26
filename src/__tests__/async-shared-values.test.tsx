import { render, screen, fireEvent } from '@testing-library/react-native';

/**
 * On native, a shared value written from the JS thread is applied on the UI
 * thread later, so a JS read made right after the write can return the
 * previous value. Model that: `set` is queued and only applied by
 * `flushWrites()`, so handlers that read back what they just wrote see stale
 * state.
 */
const pendingWrites: (() => void)[] = [];
const flushWrites = () => pendingWrites.splice(0).forEach((write) => write());

jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('./__mocks__/reanimated');
  const makeDeferredSharedValue = (init: any) => {
    let val = init;
    const set = (v: any) => {
      pendingWrites.push(() => {
        val = typeof v === 'function' ? v(val) : v;
      });
    };
    return {
      get value() {
        return val;
      },
      set value(v: any) {
        set(v);
      },
      get: () => val,
      set,
    };
  };
  return {
    ...actual,
    __esModule: true,
    useSharedValue: makeDeferredSharedValue,
    makeMutable: makeDeferredSharedValue,
  };
});

const { PressablesConfig } = require('../provider');
const { PressableScale } = require('../pressables/custom/scale');

const pressIn = (el: any) => fireEvent(el, 'began');
const pressOut = (el: any) => fireEvent(el, 'ended');

beforeEach(() => {
  pendingWrites.length = 0;
});

describe('handler options with asynchronous shared value writes', () => {
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
    expect(onPressIn).toHaveBeenLastCalledWith(
      expect.objectContaining({ isPressed: true })
    );
    pressOut(button);
    expect(onPressOut).toHaveBeenLastCalledWith(
      expect.objectContaining({ isPressed: false })
    );
  });

  it('reports the toggle and selection produced by the press', () => {
    const onPress = jest.fn();
    render(
      <PressablesConfig>
        <PressableScale testID="p" onPress={onPress} />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenLastCalledWith(
      expect.objectContaining({ isToggled: true, isSelected: true })
    );
  });

  it('flips the toggle on presses faster than the UI thread applies writes', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" onPress={onPress} />);
    const button = screen.getByTestId('p');
    fireEvent.press(button);
    fireEvent.press(button);
    flushWrites();
    fireEvent.press(button);
    expect(onPress.mock.calls.map((c) => c[0].isToggled)).toEqual([
      true,
      false,
      true,
    ]);
  });
});

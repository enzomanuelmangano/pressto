import { fireEvent, render, screen } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import { makeMutable, type SharedValue } from 'react-native-reanimated';
import { PressableScale, PressablesGroup } from '../index';
import { createPressablesGroup } from '../provider/context';

// Test helpers of the mock (src/__tests__/__mocks__/reanimated.ts).
const { __flushUI, __setAsyncWrites } = Reanimated as unknown as {
  __flushUI: () => void;
  __setAsyncWrites: (enabled: boolean) => void;
};

// A shared value that records its writes.
const tracked = (initial: boolean) => {
  const value = makeMutable(initial);
  const writes: boolean[] = [];
  const set = value.set;
  value.set = (v: boolean) => {
    writes.push(v);
    set(v);
  };
  return { value, writes };
};

afterEach(() => {
  __flushUI();
  __setAsyncWrites(false);
});

describe('pressables group', () => {
  it('flips only the previous and the new selected pressable', () => {
    const group = createPressablesGroup(makeMutable<string | null>(null));
    const items = ['a', 'b', 'c', 'd'].map((id) => ({ id, ...tracked(false) }));
    items.forEach(({ id, value }) => group.register(id, value));

    group.select('a');
    group.select('b');

    expect(group.lastTouchedPressable.get()).toBe('b');
    expect(items.map(({ value }) => value.get())).toEqual([
      false,
      true,
      false,
      false,
    ]);
    // c and d were never written.
    expect(items.map(({ writes }) => writes)).toEqual([
      [true, false],
      [true],
      [],
      [],
    ]);
  });

  it('does not write anything when the same pressable is selected again', () => {
    const group = createPressablesGroup(makeMutable<string | null>(null));
    const a = tracked(false);
    group.register('a', a.value);

    group.select('a');
    group.select('a');

    expect(a.writes).toEqual([true]);
  });

  it('does not depend on reading back its own writes', () => {
    __setAsyncWrites(true);
    const group = createPressablesGroup(makeMutable<string | null>(null));
    const a = tracked(false);
    const b = tracked(false);
    group.register('a', a.value);
    group.register('b', b.value);

    // Two presses before the UI thread applies anything.
    group.select('a');
    group.select('b');
    expect(group.isSelected('a')).toBe(false);
    expect(group.isSelected('b')).toBe(true);

    __flushUI();
    expect(a.value.get()).toBe(false);
    expect(b.value.get()).toBe(true);
    expect(group.lastTouchedPressable.get()).toBe('b');
  });

  it('applies writes to lastTouchedPressable made outside select', () => {
    const group = createPressablesGroup(makeMutable<string | null>(null));
    const a = tracked(false);
    group.register('a', a.value);
    group.select('a');

    // The reaction observed `null` after the last select (count 1).
    group.sync(null, 1);

    expect(group.isSelected('a')).toBe(false);
    expect(a.value.get()).toBe(false);
  });

  it('ignores observations older than the last select', () => {
    const group = createPressablesGroup(makeMutable<string | null>(null));
    const a = tracked(false);
    const b = tracked(false);
    group.register('a', a.value);
    group.register('b', b.value);
    group.select('a');
    group.select('b');

    // The reaction for the first select arrives late.
    group.sync('a', 1);

    expect(group.isSelected('b')).toBe(true);
    expect(a.value.get()).toBe(false);
    expect(b.value.get()).toBe(true);
  });

  it('stops updating unregistered pressables', () => {
    const group = createPressablesGroup(makeMutable<string | null>(null));
    const a = tracked(false);
    const unregister = group.register('a', a.value);

    unregister();
    group.select('a');

    expect(a.writes).toEqual([]);
  });
});

describe('pressable state on the JS thread', () => {
  it('reports isSelected for the last pressed pressable only', () => {
    __setAsyncWrites(true);
    const onPressA = jest.fn();
    const onPressB = jest.fn();
    render(
      <PressablesGroup>
        <PressableScale testID="a" onPress={onPressA} />
        <PressableScale testID="b" onPress={onPressB} />
      </PressablesGroup>
    );

    fireEvent.press(screen.getByTestId('a'));
    fireEvent.press(screen.getByTestId('b'));
    fireEvent.press(screen.getByTestId('a'));

    expect(onPressA.mock.calls.map(([o]) => o.isSelected)).toEqual([
      true,
      true,
    ]);
    expect(onPressB.mock.calls.map(([o]) => o.isSelected)).toEqual([true]);
  });

  it('reports isToggled after the press toggles it', () => {
    __setAsyncWrites(true);
    const onPress = jest.fn();
    render(<PressableScale testID="p" onPress={onPress} />);

    fireEvent.press(screen.getByTestId('p'));
    fireEvent.press(screen.getByTestId('p'));

    expect(onPress.mock.calls.map(([o]) => o.isToggled)).toEqual([true, false]);
  });

  it('is released when the whole press arrives before the UI thread runs', () => {
    __setAsyncWrites(true);
    let isPressed: SharedValue<boolean> | undefined;
    const onPressOut = jest.fn();
    render(
      <PressableScale testID="p" onPressOut={onPressOut}>
        {(params: { isPressed: SharedValue<boolean> }) => {
          isPressed = params.isPressed;
          return null;
        }}
      </PressableScale>
    );
    const button = screen.getByTestId('p');

    // e.g. a quick tap while the JS thread was busy.
    fireEvent(button, 'began');
    fireEvent(button, 'ended');
    fireEvent.press(button);
    __flushUI();

    expect(onPressOut).toHaveBeenLastCalledWith(
      expect.objectContaining({ isPressed: false })
    );
    expect(isPressed?.get()).toBe(false);
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';
import { makeMutable } from 'react-native-reanimated';
import { PressableScale, PressablesGroup } from '../index';
import { createPressablesGroup } from '../provider/context';

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

  it('applies external changes of lastTouchedPressable with sync', () => {
    const group = createPressablesGroup(makeMutable<string | null>('a'));
    const a = tracked(true);
    const b = tracked(false);
    group.register('a', a.value);
    group.register('b', b.value);

    group.sync('a', 'b');

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

  it('reports isSelected for the last pressed pressable only', () => {
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
});

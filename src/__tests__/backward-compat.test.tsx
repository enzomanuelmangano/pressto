/**
 * Guards backward compatibility for users upgrading pressto.
 * Every pattern here is written exactly as it worked BEFORE per-component
 * metadata / skipGlobalHandlers were added. If any of it stops compiling or
 * behaving, this PR introduced a breaking change.
 */
import { render, screen, fireEvent } from '@testing-library/react-native';

import {
  createAnimatedPressable,
  PressableScale,
  PressableOpacity,
  PressableWithoutFeedback,
  PressablesConfig,
  type CustomPressableProps,
  type AnimatedPressableOptions,
} from '../index';

describe('backward compatibility', () => {
  it('old onPress signature (options without metadata) still works', () => {
    const onPress = jest.fn();
    // pre-PR handler: only reads the original three fields
    const handler = (options: AnimatedPressableOptions) => {
      onPress(options.isPressed, options.isToggled, options.isSelected);
    };
    render(<PressableScale testID="p" onPress={handler} />);
    fireEvent.press(screen.getByTestId('p'));
    // isPressed=false (released), isToggled=true (flipped), isSelected=true
    // (becomes the last touched). Unchanged from pre-PR behaviour.
    expect(onPress).toHaveBeenCalledWith(false, true, true);
  });

  it('CustomPressableProps still usable without a type argument (issue #20 pattern)', () => {
    // dwieners' NativeWind workaround typed components as FC<CustomPressableProps>
    const props: CustomPressableProps = { onPress: () => {} };
    render(<PressableScale testID="p" {...props} />);
    expect(screen.getByTestId('p')).toBeTruthy();
  });

  it('themed createAnimatedPressable<Theme> worklet: metadata stays required (no ?.)', () => {
    type Theme = { colors: { primary: string } };
    const Themed = createAnimatedPressable<Theme>((progress, { metadata }) => {
      'worklet';
      // no optional chaining — proves animatedStyle metadata is non-optional
      return { backgroundColor: metadata.colors.primary, opacity: progress };
    });
    render(
      <PressablesConfig metadata={{ colors: { primary: '#f00' } }}>
        <Themed testID="themed" />
      </PressablesConfig>
    );
    expect(screen.getByTestId('themed')).toBeTruthy();
  });

  it('PressablesConfig with old-style globalHandlers still fires for all pressables', () => {
    const globalOnPress = jest.fn();
    render(
      <PressablesConfig globalHandlers={{ onPress: () => globalOnPress() }}>
        <PressableScale testID="a" />
        <PressableOpacity testID="b" />
        <PressableWithoutFeedback testID="c" />
      </PressablesConfig>
    );
    fireEvent.press(screen.getByTestId('a'));
    fireEvent.press(screen.getByTestId('b'));
    fireEvent.press(screen.getByTestId('c'));
    expect(globalOnPress).toHaveBeenCalledTimes(3);
  });

  it('a pressable with none of the new props behaves identically', () => {
    const onPress = jest.fn();
    render(<PressableScale testID="p" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('p'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

import React, { useCallback, useId, useMemo, type ComponentProps } from 'react';
import { type ViewStyle } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useLastTouchedPressable, usePressablesConfig } from '../provider';
import type { PressableContextType } from '../provider/context';

const AnimatedBaseButton = Animated.createAnimatedComponent(BaseButton);
type AnimatedPressableProps = ComponentProps<typeof AnimatedBaseButton>;

export type BasePressableProps = {
  children?: React.ReactNode;
  animatedStyle?: (
    progress: number,
    options?: {
      toggled: boolean;
      isLastTouched: boolean;
    }
  ) => ViewStyle;
  enabled?: boolean;
} & Partial<PressableContextType<'timing' | 'spring'>> &
  Partial<
    Pick<
      AnimatedPressableProps,
      | 'layout'
      | 'entering'
      | 'exiting'
      | 'style'
      | 'hitSlop'
      | 'testID'
      | 'userSelect'
      | 'activeCursor'
      | 'shouldCancelWhenOutside'
      | 'cancelsTouchesInView'
      | 'enableContextMenu'
      | 'rippleColor'
      | 'rippleRadius'
      | 'touchSoundDisabled'
      | 'waitFor'
      | 'simultaneousHandlers'
      | 'accessibilityHint'
      | 'accessibilityLabel'
      | 'accessibilityRole'
      | 'accessibilityState'
      | 'accessibilityValue'
      | 'accessibilityActions'
    >
  > & {
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
  };

const BasePressable: React.FC<BasePressableProps> = React.memo(
  ({
    children,
    onPress,
    onPressIn,
    onPressOut,
    animatedStyle,
    animationType: animationTypeProp,
    config: configProp,
    enabled = true,
    ...rest
  }) => {
    const {
      animationType: animationTypeProvider,
      config: configPropProvider,
      globalHandlers,
    } = usePressablesConfig();

    const lastTouchedPressable = useLastTouchedPressable();
    const pressableId = useId();

    const {
      onPressIn: onPressInProvider,
      onPressOut: onPressOutProvider,
      onPress: onPressProvider,
    } = globalHandlers ?? {};

    const active = useSharedValue(false);
    const toggled = useSharedValue(false);

    const { animationType, config } = useMemo(() => {
      if (animationTypeProp != null) {
        return {
          animationType: animationTypeProp,
          config: configProp,
        };
      }
      return {
        animationType: animationTypeProvider,
        config: configProp ?? configPropProvider,
      };
    }, [
      animationTypeProp,
      animationTypeProvider,
      configProp,
      configPropProvider,
    ]);

    const withAnimation = useMemo(() => {
      return animationType === 'timing' ? withTiming : withSpring;
    }, [animationType]);

    const progress = useDerivedValue<number>(() => {
      return withAnimation(active.get() ? 1 : 0, config);
    }, [config, withAnimation]);

    const onPressInWrapper = useCallback(() => {
      active.set(true);
      onPressInProvider?.();
      onPressIn?.();
    }, [active, onPressIn, onPressInProvider]);

    const onPressWrapper = useCallback(() => {
      active.set(false);
      toggled.set(!toggled.get());
      lastTouchedPressable.set(pressableId);
      onPressProvider?.();
      onPress?.();
    }, [
      active,
      onPress,
      onPressProvider,
      toggled,
      lastTouchedPressable,
      pressableId,
    ]);

    const onPressOutWrapper = useCallback(() => {
      active.set(false);
      onPressOutProvider?.();
      onPressOut?.();
    }, [active, onPressOut, onPressOutProvider]);

    const rAnimatedStyle = useAnimatedStyle(() => {
      return animatedStyle
        ? animatedStyle(progress.get(), {
            toggled: toggled.get(),
            isLastTouched: lastTouchedPressable.get() === pressableId,
          })
        : {};
    }, [animatedStyle, progress, toggled, lastTouchedPressable, pressableId]);

    return (
      <AnimatedBaseButton
        {...rest}
        style={[rest?.style ?? {}, rAnimatedStyle]}
        enabled={enabled}
        onPress={onPressWrapper}
        onBegan={onPressInWrapper}
        onActivated={onPressInWrapper}
        onEnded={onPressOutWrapper}
        onFailed={onPressOutWrapper}
        onCancelled={onPressOutWrapper}
        exclusive={false}
      >
        {children}
      </AnimatedBaseButton>
    );
  }
);

BasePressable.displayName = 'BasePressable';

export { BasePressable };

import React, { useCallback, useId, useMemo, type ComponentProps } from 'react';
import { Platform, type ViewStyle } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useLastTouchedPressable, usePressablesConfig } from '../provider';
import type {
  AnimatedPressableOptions,
  PressableContextType,
} from '../provider/context';

const AnimatedBaseButton = Animated.createAnimatedComponent(BaseButton);
type AnimatedPressableProps = ComponentProps<typeof AnimatedBaseButton>;

export type AnimatedPressableStyleOptions<TMetadata = unknown> = {
  isPressed: boolean;
  isToggled: boolean;
  isSelected: boolean;
  metadata: TMetadata;
};

export type BasePressableProps<TMetadata = unknown> = {
  children?: React.ReactNode;
  animatedStyle?: (
    progress: number,
    options: AnimatedPressableStyleOptions<TMetadata>
  ) => ViewStyle;
  enabled?: boolean;
  initialToggled?: boolean;
  /**
   * Activates the pressable animation on hover (web only)
   * @platform web
   */
  activateOnHover?: boolean;
} & Omit<Partial<PressableContextType<'timing' | 'spring'>>, 'metadata'> &
  Partial<
    Pick<
      AnimatedPressableProps,
      | 'layout'
      | 'onLongPress'
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
    onPress?: (options: AnimatedPressableOptions) => void;
    onPressIn?: (options: AnimatedPressableOptions) => void;
    onPressOut?: (options: AnimatedPressableOptions) => void;
  };

const cursorStyle = Platform.OS === 'web' ? { cursor: 'pointer' as const } : {};

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
    initialToggled = false,
    activateOnHover: activateOnHoverProp,
    ...rest
  }) => {
    const {
      animationType: animationTypeProvider,
      config: configPropProvider,
      globalHandlers,
      metadata,
      activateOnHover: activateOnHoverProvider,
    } = usePressablesConfig();

    const lastTouchedPressable = useLastTouchedPressable();
    const pressableId = useId();

    const {
      onPressIn: onPressInProvider,
      onPressOut: onPressOutProvider,
      onPress: onPressProvider,
    } = globalHandlers ?? {};

    const active = useSharedValue(false);
    const isToggled = useSharedValue(initialToggled);

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
      const options: AnimatedPressableOptions = {
        isPressed: active.get(),
        isToggled: isToggled.get(),
        isSelected: lastTouchedPressable.get() === pressableId,
      };
      onPressInProvider?.(options);
      onPressIn?.(options);
    }, [
      active,
      onPressIn,
      onPressInProvider,
      isToggled,
      lastTouchedPressable,
      pressableId,
    ]);

    const onPressWrapper = useCallback(() => {
      active.set(false);
      isToggled.set(!isToggled.get());
      lastTouchedPressable.set(pressableId);
      const options: AnimatedPressableOptions = {
        isPressed: active.get(),
        isToggled: isToggled.get(),
        isSelected: lastTouchedPressable.get() === pressableId,
      };
      onPressProvider?.(options);
      onPress?.(options);
    }, [
      active,
      onPress,
      onPressProvider,
      isToggled,
      lastTouchedPressable,
      pressableId,
    ]);

    const onPressOutWrapper = useCallback(() => {
      active.set(false);
      const options: AnimatedPressableOptions = {
        isPressed: active.get(),
        isToggled: isToggled.get(),
        isSelected: lastTouchedPressable.get() === pressableId,
      };
      onPressOutProvider?.(options);
      onPressOut?.(options);
    }, [
      active,
      onPressOut,
      onPressOutProvider,
      isToggled,
      lastTouchedPressable,
      pressableId,
    ]);

    // Determine if hover should be enabled (web only)
    const shouldEnableHover =
      Platform.OS === 'web' &&
      (activateOnHoverProp ?? activateOnHoverProvider ?? false);

    // Hover handlers for web
    const onMouseEnter = useCallback(() => {
      if (shouldEnableHover && enabled) {
        active.set(true);
      }
    }, [shouldEnableHover, enabled, active]);

    const onMouseLeave = useCallback(() => {
      if (shouldEnableHover) {
        active.set(false);
      }
    }, [shouldEnableHover, active]);

    const rAnimatedStyle = useAnimatedStyle(() => {
      return animatedStyle
        ? animatedStyle(progress.get(), {
            isPressed: active.get(),
            isToggled: isToggled.get(),
            isSelected: lastTouchedPressable.get() === pressableId,
            metadata,
          })
        : {};
    }, [
      animatedStyle,
      progress,
      active,
      isToggled,
      lastTouchedPressable,
      pressableId,
      metadata,
    ]);

    const hoverProps = useMemo(
      () =>
        shouldEnableHover
          ? {
              onMouseEnter,
              onMouseLeave,
            }
          : {},
      [shouldEnableHover, onMouseEnter, onMouseLeave]
    );

    return (
      <AnimatedBaseButton
        {...rest}
        {...(hoverProps as any)}
        style={[rest?.style ?? {}, rAnimatedStyle, cursorStyle]}
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

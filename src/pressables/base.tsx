import React, { useCallback, useId, useMemo, type ComponentProps } from 'react';
import { Platform, type ViewStyle } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useLastTouchedPressable, usePressablesConfig } from '../provider';
import type { PressableConfig } from '../provider/constants';
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
  config: PressableConfig;
};

export type PressableChildrenCallbackParams = {
  /**
   * Animation progress from 0 (idle) to 1 (pressed)
   */
  progress: SharedValue<number>;
  /**
   * Whether the pressable is currently being pressed
   */
  isPressed: SharedValue<boolean>;
  /**
   * Toggle state - flips on each press
   */
  isToggled: SharedValue<boolean>;
  /**
   * Whether this pressable is the last one pressed in the group
   */
  isSelected: SharedValue<boolean>;
  /**
   * Pre-configured animation function (withTiming or withSpring with config already applied)
   * @example
   * const opacity = useDerivedValue(() => withAnimation(isPressed.value ? 0.5 : 1));
   */
  withAnimation: (value: number) => number;
};

export type BasePressableProps<TMetadata = unknown> = {
  children?:
    | React.ReactNode
    | ((params: PressableChildrenCallbackParams) => React.ReactNode);
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
} & Omit<
  Partial<PressableContextType<'timing' | 'spring'>>,
  'metadata' | 'config'
> &
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
    animationConfig: animationConfigProp,
    enabled = true,
    initialToggled = false,
    activateOnHover: activateOnHoverProp,
    ...rest
  }) => {
    const {
      animationType: animationTypeProvider,
      animationConfig: animationConfigProvider,
      globalHandlers,
      metadata,
      activateOnHover: activateOnHoverProvider,
      config,
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

    const { animationType, animationConfig } = useMemo(() => {
      if (animationTypeProp != null) {
        return {
          animationType: animationTypeProp,
          animationConfig: animationConfigProp,
        };
      }
      return {
        animationType: animationTypeProvider,
        animationConfig: animationConfigProp ?? animationConfigProvider,
      };
    }, [
      animationTypeProp,
      animationTypeProvider,
      animationConfigProp,
      animationConfigProvider,
    ]);

    const withAnimation = useMemo(() => {
      return animationType === 'timing' ? withTiming : withSpring;
    }, [animationType]);

    // Pre-configured animation function for children (config already applied)
    const withAnimationConfigured = useMemo(() => {
      return (value: number) => {
        'worklet';
        return withAnimation(value, animationConfig);
      };
    }, [withAnimation, animationConfig]);

    const progress = useDerivedValue<number>(() => {
      return withAnimationConfigured(active.get() ? 1 : 0);
    }, [withAnimationConfigured]);

    // Derived SharedValue for isSelected (computed from comparison)
    const isSelectedDerived = useDerivedValue(() => {
      return lastTouchedPressable.get() === pressableId;
    }, [lastTouchedPressable, pressableId]);

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
            config,
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
      config,
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

    const childrenCallbackParams = useMemo<PressableChildrenCallbackParams>(
      () => ({
        progress,
        isPressed: active,
        isToggled,
        isSelected: isSelectedDerived,
        withAnimation: withAnimationConfigured,
      }),
      [progress, active, isToggled, isSelectedDerived, withAnimationConfigured]
    );

    const renderedChildren = useMemo(() => {
      if (typeof children === 'function') {
        return children(childrenCallbackParams);
      }
      return children;
    }, [children, childrenCallbackParams]);

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
        {renderedChildren}
      </AnimatedBaseButton>
    );
  }
);

BasePressable.displayName = 'BasePressable';

export { BasePressable };

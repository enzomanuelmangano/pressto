import React, { useCallback, useId, useMemo, type ComponentProps } from 'react';
import { Platform, type ViewStyle } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  type AnimatableValue,
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
  /**
   * Required here (unlike the optional `metadata` in the press-handler
   * options): the themed `animatedStyle` pattern assumes you set `metadata` on
   * PressablesConfig, and typing it optional would force `?.` into every
   * existing worklet. Handlers, by contrast, may run on a pressable that never
   * set metadata, so there it is optional.
   */
  metadata: TMetadata;
  config: PressableConfig;
  /**
   * Pre-configured animation function (withTiming or withSpring with config already applied)
   * Supports numbers, strings (colors), and other animatable values
   * @example
   * const opacity = withAnimation(isToggled ? 0.5 : 1);
   * const backgroundColor = withAnimation(isPressed ? '#ff0000' : '#0000ff');
   */
  withAnimation: <T extends AnimatableValue>(value: T) => T;
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
   * Supports numbers, strings (colors), and other animatable values
   * @example
   * const opacity = useDerivedValue(() => withAnimation(isPressed.value ? 0.5 : 1));
   * const backgroundColor = useDerivedValue(() => withAnimation(isPressed.value ? '#ff0000' : '#0000ff'));
   */
  withAnimation: <T extends AnimatableValue>(value: T) => T;
};

export type BasePressableProps<TMetadata = unknown> = {
  children?:
    | React.ReactNode
    | ((params: PressableChildrenCallbackParams) => React.ReactNode);
  animatedStyle?: (
    progress: number,
    options: AnimatedPressableStyleOptions<TMetadata>
  ) => ViewStyle;
  /**
   * Whether the pressable is interactive.
   * @deprecated Use `disabled` instead.
   */
  enabled?: boolean;
  /** Disables the pressable. Takes precedence over `enabled`. */
  disabled?: boolean;
  /**
   * Native accessibility identifier used by e2e runners (Maestro, XCUITest,
   * Detox). Defaults to `testID` when omitted.
   */
  accessibilityIdentifier?: string;
  /**
   * Per-component metadata, surfaced to `animatedStyle` and to the press
   * handler options (including globalHandlers). Overrides the metadata set on
   * PressablesConfig. Use it to identify a pressable inside a global handler
   * (e.g. analytics name) or carry flags it should react to.
   */
  metadata?: TMetadata;
  /**
   * Opt this pressable out of the globalHandlers defined on PressablesConfig.
   * The component's own onPress/onPressIn/onPressOut still fire.
   */
  skipGlobalHandlers?: boolean;
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
      | 'accessible'
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
    onPress?: (options: AnimatedPressableOptions<TMetadata>) => void;
    onPressIn?: (options: AnimatedPressableOptions<TMetadata>) => void;
    onPressOut?: (options: AnimatedPressableOptions<TMetadata>) => void;
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
    disabled,
    accessibilityIdentifier: accessibilityIdentifierProp,
    metadata: metadataProp,
    skipGlobalHandlers = false,
    initialToggled = false,
    activateOnHover: activateOnHoverProp,
    ...rest
  }) => {
    const {
      animationType: animationTypeProvider,
      animationConfig: animationConfigProvider,
      globalHandlers,
      metadata: metadataProvider,
      activateOnHover: activateOnHoverProvider,
      config,
      defaultProps,
    } = usePressablesConfig();

    const isEnabled = disabled !== undefined ? !disabled : enabled;

    // Per-component metadata overrides the PressablesConfig metadata.
    const metadata = metadataProp ?? metadataProvider;

    const lastTouchedPressable = useLastTouchedPressable();
    const pressableId = useId();

    // skipGlobalHandlers opts this pressable out of the provider handlers,
    // while its own onPress/onPressIn/onPressOut still fire.
    const {
      onPressIn: onPressInProvider,
      onPressOut: onPressOutProvider,
      onPress: onPressProvider,
    } = skipGlobalHandlers ? {} : (globalHandlers ?? {});

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
      return <T extends AnimatableValue>(value: T): T => {
        'worklet';
        return withAnimation(value, animationConfig) as T;
      };
    }, [withAnimation, animationConfig]);

    const progress = useDerivedValue<number>(() => {
      return withAnimationConfigured(active.get() ? 1 : 0);
    }, [withAnimationConfigured]);

    // Derived SharedValue for isSelected (computed from comparison)
    const isSelectedDerived = useDerivedValue(() => {
      return lastTouchedPressable.get() === pressableId;
    }, [lastTouchedPressable, pressableId]);

    // Snapshot the current interaction state into the options object passed to
    // every handler. Reads live shared values, so callers mutate state first
    // (active/isToggled/lastTouchedPressable) and then build.
    const buildOptions = useCallback(
      (): AnimatedPressableOptions => ({
        isPressed: active.get(),
        isToggled: isToggled.get(),
        isSelected: lastTouchedPressable.get() === pressableId,
        metadata,
      }),
      [active, isToggled, lastTouchedPressable, pressableId, metadata]
    );

    const onPressInWrapper = useCallback(() => {
      active.set(true);
      const options = buildOptions();
      onPressInProvider?.(options);
      onPressIn?.(options);
    }, [active, buildOptions, onPressIn, onPressInProvider]);

    const onPressWrapper = useCallback(() => {
      active.set(false);
      isToggled.set(!isToggled.get());
      lastTouchedPressable.set(pressableId);
      const options = buildOptions();
      onPressProvider?.(options);
      onPress?.(options);
    }, [
      active,
      isToggled,
      lastTouchedPressable,
      pressableId,
      buildOptions,
      onPress,
      onPressProvider,
    ]);

    const onPressOutWrapper = useCallback(() => {
      active.set(false);
      const options = buildOptions();
      onPressOutProvider?.(options);
      onPressOut?.(options);
    }, [active, buildOptions, onPressOut, onPressOutProvider]);

    // Determine if hover should be enabled (web only)
    const shouldEnableHover =
      Platform.OS === 'web' &&
      (activateOnHoverProp ?? activateOnHoverProvider ?? false);

    // Hover handlers for web
    const onMouseEnter = useCallback(() => {
      if (shouldEnableHover && isEnabled) {
        active.set(true);
      }
    }, [shouldEnableHover, isEnabled, active]);

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
            withAnimation: withAnimationConfigured,
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
      withAnimationConfigured,
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

    // Merge defaultProps from context with component props (component props take precedence)
    const mergedProps = useMemo(
      () => ({ ...defaultProps, ...rest }),
      [defaultProps, rest]
    );

    // Mirror RN convention (Pressable / TouchableOpacity): testID becomes the
    // native accessibilityIdentifier on iOS, and tappable controls are
    // accessibility elements by default. RNGH's BaseButton accepts testID but
    // does NOT propagate it, so e2e runners (Maestro, XCUITest, Detox) can't
    // locate pressto buttons by id without this. Both stay overridable.
    const accessibilityIdentifier =
      accessibilityIdentifierProp ?? mergedProps.testID;
    const accessible = mergedProps.accessible ?? true;

    return (
      <AnimatedBaseButton
        {...mergedProps}
        {...({ accessibilityIdentifier } as any)}
        accessible={accessible}
        {...(hoverProps as any)}
        style={[rest?.style ?? {}, rAnimatedStyle, cursorStyle]}
        enabled={isEnabled}
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

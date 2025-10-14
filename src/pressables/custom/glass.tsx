import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import {
  Gesture,
  GestureDetector,
  type BaseButtonProps,
  type HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  GlassView,
  hasLiquidGlassSupport,
  isGlassEffectAvailable,
  type GlassColorScheme,
  type GlassEffectStyle,
  type LiquidGlassProps,
} from '../../integrations/liquid-glass';
import { BasePressable } from '../base';
import type { CustomPressableProps } from '../hoc';
import { PressableScale } from './scale';

/**
 * Props for PressableGlass component
 */
export type PressableGlassProps = CustomPressableProps & {
  glassEffectStyle?: GlassEffectStyle;
  interactive?: boolean;
  tintColor?: string;
  colorScheme?: GlassColorScheme;
};

/**
 * A pressable component with liquid glass effect (iOS 26+)
 *
 * @remarks
 * Requires either 'expo-glass-effect' or '@callstack/liquid-glass' to be installed.
 * Falls back to a semi-transparent view on unsupported platforms.
 *
 * @example
 * ```tsx
 * import { PressableGlass } from 'pressto/glass';
 *
 * <PressableGlass
 *   style={styles.button}
 *   glassEffectStyle="clear"
 *   interactive
 *   tintColor="#ffffff"
 *   onPress={() => console.log('pressed')}
 * />
 * ```
 */

type TouchableGlassComponentProps = LiquidGlassProps &
  Pick<
    BaseButtonProps,
    | 'enabled'
    | 'onBegan'
    | 'onActivated'
    | 'onPress'
    | 'onEnded'
    | 'onFailed'
    | 'onCancelled'
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
  > & {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
  };

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

const TouchableGlassComponent = memo((props: TouchableGlassComponentProps) => {
  const tapGesture = useMemo(() => {
    const gesture = Gesture.Tap()
      .hitSlop(props.hitSlop ?? 0)
      .runOnJS(true)
      .onTouchesDown((event) => {
        props.onBegan?.(event as unknown as HandlerStateChangeEvent);
      })
      .onTouchesUp(() => {
        props.onPress?.(true);
      })
      .onTouchesCancelled((event) => {
        props.onCancelled?.(event as unknown as HandlerStateChangeEvent);
      });

    if (props.activeCursor) {
      gesture.activeCursor(props.activeCursor);
    }

    if (props.shouldCancelWhenOutside) {
      gesture.shouldCancelWhenOutside(props.shouldCancelWhenOutside);
    }

    if (props.cancelsTouchesInView) {
      gesture.cancelsTouchesInView(props.cancelsTouchesInView);
    }

    if (props.enabled !== undefined) {
      gesture.enabled(props.enabled);
    }

    return gesture;
  }, [props]);

  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedGlassView {...props}>{props.children}</AnimatedGlassView>
    </GestureDetector>
  );
});

TouchableGlassComponent.displayName = 'TouchableGlassComponent';

export const PressableGlass: React.FC<PressableGlassProps> = ({
  children,
  glassEffectStyle = 'clear',
  interactive = true,
  tintColor,
  colorScheme,
  style,
  ...rest
}) => {
  const isAvailable = isGlassEffectAvailable();

  // Extract backgroundColor from style to use as tintColor
  const { effectiveTintColor, styleWithoutBackground } = useMemo(() => {
    if (!style) {
      return { effectiveTintColor: tintColor, styleWithoutBackground: style };
    }

    const flattenedStyle = StyleSheet.flatten(style);
    const { backgroundColor, ...restStyle } = flattenedStyle as {
      backgroundColor: string;
      [key: string]: any;
    };

    return {
      effectiveTintColor: tintColor ?? (backgroundColor as string | undefined),
      styleWithoutBackground:
        Object.keys(restStyle).length > 0 ? restStyle : undefined,
    };
  }, [style, tintColor]);

  // Normalize props for both packages
  const glassProps: any = useMemo(
    () => ({
      style: [!isAvailable],
    }),
    [isAvailable]
  );

  const baseTouchableComponent = useCallback(
    (internalProps: BaseButtonProps) => (
      <TouchableGlassComponent {...glassProps} {...internalProps} />
    ),
    [glassProps]
  );

  if (!hasLiquidGlassSupport()) {
    console.warn(
      'PressableGlass: Liquid glass package not found. Install either "expo-glass-effect" or "@callstack/liquid-glass" for glass effects. Falling back to View.'
    );
    return (
      <PressableScale {...rest} style={style}>
        {children}
      </PressableScale>
    );
  }

  // expo-glass-effect uses these prop names
  if (glassEffectStyle) {
    glassProps.glassEffectStyle = glassEffectStyle;
  }
  if (interactive !== undefined) {
    glassProps.isInteractive = interactive;
  }
  if (effectiveTintColor) {
    glassProps.tintColor = effectiveTintColor;
  }

  // @callstack/liquid-glass uses these prop names (fallback)
  if (glassEffectStyle && !glassProps.glassEffectStyle) {
    glassProps.effect = glassEffectStyle;
  }
  if (interactive !== undefined && !glassProps.isInteractive) {
    glassProps.interactive = interactive;
  }
  if (colorScheme) {
    glassProps.colorScheme = colorScheme;
  }

  return (
    <BasePressable
      {...rest}
      style={styleWithoutBackground}
      BaseComponent={baseTouchableComponent}
    >
      {children}
    </BasePressable>
  );
};

PressableGlass.displayName = 'PressableGlass';

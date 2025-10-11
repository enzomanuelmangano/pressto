import React from 'react';
import {
  GlassView,
  hasLiquidGlassSupport,
  isGlassEffectAvailable,
  type GlassColorScheme,
  type GlassEffectStyle,
} from '../../integrations/liquid-glass';
import type { CustomPressableProps } from '../hoc';
import { createAnimatedPressable } from '../hoc';
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
const BasePressableGlass = createAnimatedPressable(
  (progress, { isPressed }) => {
    'worklet';
    return {
      opacity: isPressed ? 0.8 : 1,
      transform: [{ scale: 1 - progress * 0.02 }],
    };
  }
);

export const PressableGlass: React.FC<PressableGlassProps> = ({
  children,
  glassEffectStyle = 'regular',
  interactive = false,
  tintColor,
  colorScheme,
  style,
  ...rest
}) => {
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

  const GlassComponent = GlassView;
  const isAvailable = isGlassEffectAvailable();

  // Normalize props for both packages
  const glassProps: any = {
    style: [!isAvailable],
  };

  // expo-glass-effect uses these prop names
  if (glassEffectStyle) {
    glassProps.glassEffectStyle = glassEffectStyle;
  }
  if (interactive !== undefined) {
    glassProps.isInteractive = interactive;
  }
  if (tintColor) {
    glassProps.tintColor = tintColor;
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
    <BasePressableGlass {...rest} style={style}>
      <GlassComponent {...glassProps}>{children}</GlassComponent>
    </BasePressableGlass>
  );
};

PressableGlass.displayName = 'PressableGlass';

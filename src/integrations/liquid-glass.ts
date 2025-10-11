/**
 * Optional integration with liquid glass packages.
 * Supports both expo-glass-effect and @callstack/liquid-glass
 */

let GlassView: any = null;
let GlassContainer: any = null;
let isLiquidGlassAvailable: (() => boolean) | null = null;

// Try to import expo-glass-effect first (official Expo package)
try {
  const expoGlass = require('expo-glass-effect');
  GlassView = expoGlass.GlassView;
  GlassContainer = expoGlass.GlassContainer;
  isLiquidGlassAvailable = expoGlass.isLiquidGlassAvailable;
} catch {
  // Try @callstack/liquid-glass as fallback
  try {
    const callstackGlass = require('@callstack/liquid-glass');
    GlassView = callstackGlass.LiquidGlassView;
    GlassContainer = callstackGlass.LiquidGlassContainerView;
    const isSupported = callstackGlass.isLiquidGlassSupported;
    isLiquidGlassAvailable = () => isSupported;
  } catch {
    // No liquid glass package installed
  }
}

export const hasLiquidGlassSupport = () => {
  return GlassView !== null;
};

export const isGlassEffectAvailable = () => {
  if (!hasLiquidGlassSupport()) {
    return false;
  }
  return isLiquidGlassAvailable ? isLiquidGlassAvailable() : false;
};

export { GlassView, GlassContainer };

export type GlassEffectStyle = 'clear' | 'regular';
export type GlassColorScheme = 'light' | 'dark' | 'system';

export type LiquidGlassProps = {
  /**
   * Glass effect style
   * - 'regular': Standard glass effect (default)
   * - 'clear': More transparent glass effect
   */
  glassEffectStyle?: GlassEffectStyle;

  /**
   * Enable touch interaction effects
   * @default false
   */
  interactive?: boolean;

  /**
   * Tint color overlay for the glass effect
   */
  tintColor?: string;

  /**
   * Color scheme adaptation (Callstack only)
   * @default 'system'
   */
  colorScheme?: GlassColorScheme;

  /**
   * Spacing for glass container (when multiple glass elements merge)
   */
  spacing?: number;
};

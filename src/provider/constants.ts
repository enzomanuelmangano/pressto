import { Easing } from 'react-native-reanimated';

/**
 * Configuration values for pressable visual feedback
 */
export type PressableConfig = {
  /**
   * Target opacity when the pressable is in active/pressed state.
   *
   * Used by PressableOpacity to interpolate from 1 (idle) to this value (pressed).
   *
   * @default 0.5
   * @example
   * // More transparent when pressed
   * config={{ activeOpacity: 0.3 }}
   *
   * // Less transparent when pressed
   * config={{ activeOpacity: 0.7 }}
   */
  activeOpacity: number;

  /**
   * Target scale when the pressable is in active/pressed state.
   *
   * Used by PressableScale to interpolate from baseScale (idle) to this value (pressed).
   * Values less than baseScale create a "shrink" effect.
   *
   * @default 0.96
   * @example
   * // More pronounced shrink effect
   * config={{ minScale: 0.9 }}
   *
   * // Subtle shrink effect
   * config={{ minScale: 0.98 }}
   */
  minScale: number;

  /**
   * Base scale when the pressable is in idle/unpressed state.
   *
   * Used by PressableScale as the starting scale value.
   * Typically set to 1, but can be adjusted for special effects.
   *
   * @default 1
   * @example
   * // Normal size when idle
   * config={{ baseScale: 1 }}
   *
   * // Slightly enlarged when idle (grows when pressed if minScale > 1)
   * config={{ baseScale: 1.05, minScale: 1.1 }}
   */
  baseScale: number;
};

export const DefaultAnimationConfigs = {
  timing: { duration: 250, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  spring: {
    mass: 1,
    damping: 30,
    stiffness: 200,
  },
} as const;

/**
 * Default configuration values for pressable visual feedback
 */
export const DefaultPressableConfig: PressableConfig = {
  activeOpacity: 0.5,
  minScale: 0.96,
  baseScale: 1,
} as const;

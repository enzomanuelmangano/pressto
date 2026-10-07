import { createContext } from 'react';
import {
  makeMutable,
  type SharedValue,
  type WithSpringConfig,
  type WithTimingConfig,
} from 'react-native-reanimated';
import {
  DefaultAnimationConfigs,
  DefaultPressableConfig,
  type DefaultPressableProps,
  type PressableConfig,
} from './constants';

export type AnimationType = 'timing' | 'spring';

export type AnimatedPressableOptions<TMetadata = unknown> = {
  isPressed: boolean;
  isToggled: boolean;
  isSelected: boolean;
  /**
   * Per-component metadata (falls back to the PressablesConfig metadata).
   * Useful inside globalHandlers to identify which pressable fired.
   * Optional: a pressable may not set it, so handlers should null-check.
   */
  metadata?: TMetadata;
};

export type PressableContextType<
  T extends AnimationType,
  TMetadata = unknown,
> = {
  animationType: T;
  animationConfig: T extends 'timing' ? WithTimingConfig : WithSpringConfig;
  globalHandlers?: {
    onPressIn?: (options: AnimatedPressableOptions<TMetadata>) => void;
    onPressOut?: (options: AnimatedPressableOptions<TMetadata>) => void;
    onPress?: (options: AnimatedPressableOptions<TMetadata>) => void;
  };
  metadata?: TMetadata;
  /**
   * Activates the pressable animation on hover (web only)
   * @platform web
   */
  activateOnHover?: boolean;
  /**
   * Pressable configuration values (opacity, scale, etc.)
   */
  config: PressableConfig;
  /**
   * Default props applied to all pressables.
   * Individual pressable props will override these values.
   */
  defaultProps?: DefaultPressableProps;
};

export const PressablesContext = createContext<
  PressableContextType<AnimationType, unknown>
>({
  animationType: 'timing',
  animationConfig: DefaultAnimationConfigs.timing,
  metadata: undefined,
  config: DefaultPressableConfig,
});

export type PressablesGroupValue = {
  /** Id of the last pressable pressed in the group. */
  lastTouchedPressable: SharedValue<string | null>;
  /**
   * Registers a pressable's own `isSelected` value, so that a selection change
   * updates only the previous and the new selected pressable instead of every
   * pressable reading `lastTouchedPressable`. Returns the unregister function.
   */
  register: (id: string, isSelected: SharedValue<boolean>) => () => void;
  /** Marks `id` as the last touched pressable of the group. */
  select: (id: string) => void;
  /**
   * Applies a change of `lastTouchedPressable` made outside `select` (it is
   * a public, writable SharedValue) to the registered `isSelected` values.
   */
  sync: (previous: string | null, next: string | null) => void;
};

export const createPressablesGroup = (
  lastTouchedPressable: SharedValue<string | null>
): PressablesGroupValue => {
  const registry = new Map<string, SharedValue<boolean>>();
  const sync = (previous: string | null, next: string | null) => {
    if (previous === next) {
      return;
    }
    if (previous !== null) {
      registry.get(previous)?.set(false);
    }
    if (next !== null) {
      registry.get(next)?.set(true);
    }
  };
  return {
    lastTouchedPressable,
    register: (id, isSelected) => {
      registry.set(id, isSelected);
      return () => {
        if (registry.get(id) === isSelected) {
          registry.delete(id);
        }
      };
    },
    select: (id) => {
      sync(lastTouchedPressable.get(), id);
      lastTouchedPressable.set(id);
    },
    sync,
  };
};

export const PressablesGroupContext = createContext<PressablesGroupValue>(
  createPressablesGroup(makeMutable<string | null>(null))
);

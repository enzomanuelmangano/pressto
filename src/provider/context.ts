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
  /** Number of `select` calls, mirrored to the UI thread (see `sync`). */
  selectCount: SharedValue<number>;
  /**
   * Registers a pressable's own `isSelected` value, so that a selection change
   * updates only the previous and the new selected pressable instead of every
   * pressable reading `lastTouchedPressable`. Returns the unregister function.
   */
  register: (id: string, isSelected: SharedValue<boolean>) => () => void;
  /** Whether `id` is the selected pressable, as known on the JS thread. */
  isSelected: (id: string) => boolean;
  /** Marks `id` as the last touched pressable of the group. */
  select: (id: string) => void;
  /**
   * Applies a write to `lastTouchedPressable` made outside `select` (it is a
   * public, writable SharedValue), observed on the UI thread together with
   * `selectCount`. Ignored if a `select` happened since, as that one is newer.
   */
  sync: (next: string | null, selectCount: number) => void;
};

// The selection is tracked here, on the JS thread, where presses are handled:
// reading a shared value on JS right after writing it returns the previous
// value, so the shared values only mirror it for the worklets.
export const createPressablesGroup = (
  lastTouchedPressable: SharedValue<string | null>,
  selectCount: SharedValue<number> = makeMutable(0)
): PressablesGroupValue => {
  const registry = new Map<string, SharedValue<boolean>>();
  let selected = lastTouchedPressable.get();
  let count = 0;

  const setSelected = (next: string | null) => {
    if (next === selected) {
      return;
    }
    if (selected !== null) {
      registry.get(selected)?.set(false);
    }
    if (next !== null) {
      registry.get(next)?.set(true);
    }
    selected = next;
  };

  return {
    lastTouchedPressable,
    selectCount,
    register: (id, isSelected) => {
      registry.set(id, isSelected);
      return () => {
        if (registry.get(id) === isSelected) {
          registry.delete(id);
        }
      };
    },
    isSelected: (id) => selected === id,
    select: (id) => {
      setSelected(id);
      count++;
      lastTouchedPressable.set(id);
      selectCount.set(count);
    },
    sync: (next, observedCount) => {
      if (observedCount === count) {
        setSelected(next);
      }
    },
  };
};

export const PressablesGroupContext = createContext<PressablesGroupValue>(
  createPressablesGroup(makeMutable<string | null>(null))
);

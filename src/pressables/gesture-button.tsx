import React, { forwardRef, useRef, type ComponentType } from 'react';
import type { ColorValue, ViewProps } from 'react-native';
import * as GestureHandler from 'react-native-gesture-handler';

type HitSlop =
  | number
  | Partial<
      Record<
        'left' | 'right' | 'top' | 'bottom' | 'vertical' | 'horizontal',
        number
      >
    >
  | Record<'width' | 'left', number>
  | Record<'width' | 'right', number>
  | Record<'height' | 'top', number>
  | Record<'height' | 'bottom', number>;

/**
 * Button props pressto forwards to the underlying RNGH button. Declared here
 * rather than picked from RNGH's types, which differ between RNGH 2 and 3.
 */
export type GestureButtonPassthroughProps = Pick<
  ViewProps,
  | 'testID'
  | 'accessible'
  | 'accessibilityHint'
  | 'accessibilityLabel'
  | 'accessibilityRole'
  | 'accessibilityState'
  | 'accessibilityValue'
  | 'accessibilityActions'
> & {
  hitSlop?: HitSlop;
  userSelect?: 'none' | 'auto' | 'text';
  activeCursor?: string;
  shouldCancelWhenOutside?: boolean;
  cancelsTouchesInView?: boolean;
  enableContextMenu?: boolean;
  rippleColor?: ColorValue | null;
  rippleRadius?: number | null;
  touchSoundDisabled?: boolean;
  /** RNGH 2 only: ignored on RNGH 3, where the button is native. */
  waitFor?: React.Ref<unknown> | React.Ref<unknown>[];
  /** RNGH 2 only: ignored on RNGH 3, where the button is native. */
  simultaneousHandlers?: React.Ref<unknown> | React.Ref<unknown>[];
  onLongPress?: () => void;
};

// RNGH 3 rewrote BaseButton on the hooks API: the state callbacks pressto
// relied on (onBegan, onActivated, onEnded, ...) are gone, so press-in /
// press-out never fire. RNGH 3 also ships `Touchable`, which reports
// onPressIn / onPressOut / onPress natively. Detect it at runtime so the same
// build works with both majors. `Touchable` doesn't exist on RNGH 2, so it is
// read with Reflect.get rather than a named import or `GestureHandler.Touchable`:
// webpack and Rollup (Vite) check static accesses on a namespace import and
// warn "export 'Touchable' was not found" when building against RNGH 2.
const Touchable: ComponentType<any> | undefined = Reflect.get(
  GestureHandler,
  'Touchable'
);
const BaseButton: ComponentType<any> = (GestureHandler as any).BaseButton;

export const isGestureHandlerV3 = Touchable != null;

type GestureButtonProps = {
  enabled: boolean;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  children?: React.ReactNode;
  [key: string]: any;
};

const LegacyGestureButton = forwardRef<unknown, GestureButtonProps>(
  ({ onPressIn, onPressOut, onHoverIn, onHoverOut, ...rest }, ref) => {
    // A press can report both BEGAN and ACTIVE (Android does), and END after
    // FAIL/CANCEL; report press-in and press-out once per press.
    const isPressed = useRef(false);
    const pressIn = () => {
      if (!isPressed.current) {
        isPressed.current = true;
        onPressIn();
      }
    };
    const pressOut = () => {
      if (isPressed.current) {
        isPressed.current = false;
        onPressOut();
      }
    };
    return (
      <BaseButton
        {...rest}
        ref={ref}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
        onBegan={pressIn}
        onActivated={pressIn}
        onEnded={pressOut}
        onFailed={pressOut}
        onCancelled={pressOut}
        exclusive={false}
      />
    );
  }
);

const TouchableGestureButton = forwardRef<unknown, GestureButtonProps>(
  (
    {
      enabled,
      shouldCancelWhenOutside,
      rippleColor,
      rippleRadius,
      // External gesture relations aren't supported by Touchable: it handles
      // presses natively and cooperates with scrollables on its own.
      waitFor: _waitFor,
      simultaneousHandlers: _simultaneousHandlers,
      ...rest
    },
    ref
  ) => {
    const Component = Touchable as ComponentType<any>;
    return (
      <Component
        {...rest}
        ref={ref}
        disabled={!enabled}
        // BaseButton keeps the press alive when the finger leaves and comes
        // back; Touchable cancels it by default. Keep the RNGH 2 behaviour.
        cancelOnLeave={shouldCancelWhenOutside ?? false}
        androidRipple={
          rippleColor != null
            ? { color: rippleColor, radius: rippleRadius ?? undefined }
            : undefined
        }
        exclusive={false}
      />
    );
  }
);

export const GestureButton = isGestureHandlerV3
  ? TouchableGestureButton
  : LegacyGestureButton;

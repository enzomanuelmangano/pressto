import React, { useCallback, useMemo, type ComponentProps } from 'react';
import { type ViewStyle } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { usePressablesConfig } from '../provider';
import type { PressableContextType } from '../provider/context';

const AnimatedBaseButton = Animated.createAnimatedComponent(BaseButton);
type AnimatedPressableProps = ComponentProps<typeof AnimatedBaseButton>;

export type BasePressableProps = {
  children?: React.ReactNode;
  animatedStyle?: (progress: SharedValue<number>) => ViewStyle;
  enabled?: boolean;
} & Partial<PressableContextType<'timing' | 'spring'>> &
  Partial<
    Pick<
      AnimatedPressableProps,
      | 'layout'
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
    >
  > & {
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
  };

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
    ...rest
  }) => {
    const {
      animationType: animationTypeProvider,
      config: configPropProvider,
      globalHandlers,
    } = usePressablesConfig();
    const {
      onPressIn: onPressInProvider,
      onPressOut: onPressOutProvider,
      onPress: onPressProvider,
    } = globalHandlers ?? {};

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

    const active = useSharedValue(false);

    const withAnimation = useMemo(() => {
      return animationType === 'timing' ? withTiming : withSpring;
    }, [animationType]);

    const progress = useDerivedValue<number>(() => {
      return withAnimation(active.get() ? 1 : 0, config);
    }, [config, withAnimation]);

    const onPressInWrapper = useCallback(() => {
      active.set(true);
      onPressInProvider?.();
      onPressIn?.();
    }, [active, onPressIn, onPressInProvider]);

    const onPressWrapper = useCallback(() => {
      active.set(false);
      onPressProvider?.();
      onPress?.();
    }, [active, onPress, onPressProvider]);

    const onPressOutWrapper = useCallback(() => {
      active.set(false);
      onPressOutProvider?.();
      onPressOut?.();
    }, [active, onPressOut, onPressOutProvider]);

    const rAnimatedStyle = useAnimatedStyle(() => {
      return animatedStyle ? animatedStyle(progress) : {};
    }, []);

    return (
      <AnimatedBaseButton
        {...rest}
        style={[rest?.style ?? {}, rAnimatedStyle]}
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

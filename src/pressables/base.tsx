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
  Pick<AnimatedPressableProps, 'layout' | 'entering' | 'exiting'> & {
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
  };

const BasePressable: React.FC<BasePressableProps> = ({
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
    return withAnimation(active.value ? 1 : 0, config);
  }, [config, withAnimation]);

  const onPressInWrapper = useCallback(() => {
    if (!enabled) return;
    active.value = true;
    onPressInProvider?.();
    onPressIn?.();
  }, [active, enabled, onPressIn, onPressInProvider]);

  const onPressWrapper = useCallback(() => {
    if (!enabled) return;
    active.value = false;
    onPressProvider?.();
    onPress?.();
  }, [active, enabled, onPress, onPressProvider]);

  const onPressOutWrapper = useCallback(() => {
    if (!enabled) return;
    active.value = false;
    onPressOutProvider?.();
    onPressOut?.();
  }, [active, enabled, onPressOut, onPressOutProvider]);

  const rAnimatedStyle = useAnimatedStyle(() => {
    return animatedStyle ? animatedStyle(progress) : {};
  }, []);

  const onActiveStateChange = useCallback(
    (active: boolean) => {
      if (active) {
        onPressInWrapper();
      } else {
        onPressOutWrapper();
      }
    },
    [onPressInWrapper, onPressOutWrapper]
  );

  return (
    <AnimatedBaseButton
      disabled={!enabled}
      {...rest}
      style={[rest?.style ?? {}, rAnimatedStyle]}
      onActiveStateChange={onActiveStateChange}
      onPress={onPressWrapper}
    >
      {children}
    </AnimatedBaseButton>
  );
};

export { BasePressable };

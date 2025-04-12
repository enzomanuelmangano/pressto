import React, { useCallback, useMemo, type ComponentProps } from 'react';
import {
  type GestureResponderEvent,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { usePressablesConfig } from '../provider';
import type { PressableContextType } from '../provider/context';

type AnimatedPressableProps = ComponentProps<typeof BaseButton>;

export type BasePressableProps = {
  children?: React.ReactNode;
  animatedStyle?: (progress: SharedValue<number>) => ViewStyle;
  enabled?: boolean;
} & Partial<PressableContextType<'timing' | 'spring'>> &
  PressableProps &
  Pick<AnimatedPressableProps, 'layout' | 'entering' | 'exiting'>;

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

  const onPressInWrapper = useCallback(
    (event: GestureResponderEvent) => {
      if (!enabled) return;
      active.value = true;
      onPressInProvider?.(event);
      onPressIn?.(event);
    },
    [active, enabled, onPressIn, onPressInProvider]
  );

  const onPressWrapper = useCallback(
    (event: GestureResponderEvent) => {
      if (!enabled) return;
      active.value = false;
      onPressProvider?.(event);
      onPress?.(event);
    },
    [active, enabled, onPress, onPressProvider]
  );

  const onPressOutWrapper = useCallback(
    (event: GestureResponderEvent) => {
      if (!enabled) return;
      active.value = false;
      onPressOutProvider?.(event);
      onPressOut?.(event);
    },
    [active, enabled, onPressOut, onPressOutProvider]
  );

  const rAnimatedStyle = useAnimatedStyle(() => {
    return animatedStyle ? animatedStyle(progress) : {};
  }, []);

  return (
    <BaseButton
      disabled={!enabled}
      {...rest}
      style={[rest?.style ?? {}, rAnimatedStyle]}
      onPressIn={onPressInWrapper}
      onPress={onPressWrapper}
      onPressOut={onPressOutWrapper}
    >
      {children}
    </BaseButton>
  );
};

export { BasePressable };

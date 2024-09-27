import React, { useMemo } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { AnimateProps, SharedValue } from 'react-native-reanimated';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { usePressablesConfig } from '../provider';
import type { PressableContextType } from '../provider/context';
import { unwrapSharedValue } from './utils';

type AnimatedViewProps = AnimateProps<ViewProps>;

export type BasePressableProps = {
  children?: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  animatedStyle?: (progress: SharedValue<number>) => ViewStyle;
  enabled?: boolean | SharedValue<boolean>;
} & Partial<PressableContextType<'timing' | 'spring'>> &
  AnimatedViewProps;

const BasePressable: React.FC<BasePressableProps> = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  animatedStyle,
  animationType: animationTypeProp,
  config: configProp,
  enabled: enabledProp = true,
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

  const progress = useDerivedValue(() => {
    return withAnimation(active.value ? 1 : 0, config);
  }, [config, withAnimation]);

  const enabled = useDerivedValue(() => {
    return unwrapSharedValue(enabledProp);
  }, [enabledProp]);

  const gesture = Gesture.Tap()
    .maxDuration(4000)
    .onTouchesDown(() => {
      if (!enabled.value) return;
      active.value = true;
      if (onPressInProvider != null) runOnJS(onPressInProvider)();
      if (onPressIn != null) runOnJS(onPressIn)();
    })
    .onTouchesUp(() => {
      if (!enabled.value) return;
      if (onPressProvider != null) runOnJS(onPressProvider)();
      if (onPress != null) runOnJS(onPress)();
    })
    .onFinalize(() => {
      if (!enabled.value) return;
      active.value = false;
      if (onPressOutProvider != null) runOnJS(onPressOutProvider)();
      if (onPressOut != null) runOnJS(onPressOut)();
    });

  if (typeof enabledProp === 'boolean') {
    gesture.enabled(enabledProp);
  }

  const rAnimatedStyle = useAnimatedStyle(() => {
    return animatedStyle ? animatedStyle(progress) : {};
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View {...rest} style={[rest?.style ?? {}, rAnimatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export { BasePressable };

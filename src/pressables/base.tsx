import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
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

export type BasePressableProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: StyleProp<ViewStyle>;
  animatedStyle?: (progress: SharedValue<number>) => ViewStyle;
} & Partial<PressableContextType<'timing' | 'spring'>>;

const BasePressable: React.FC<BasePressableProps> = ({
  children,
  onPress,
  onPressIn,
  onPressOut,
  style,
  animatedStyle,
  animationType: animationTypeProp,
  config: configProp,
}) => {
  const { animationType: animationTypeProvider, config: configPropProvider } =
    usePressablesConfig();

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

  const gesture = Gesture.Tap()
    .maxDuration(4000)
    .onTouchesDown(() => {
      active.value = true;
      if (onPressIn != null) runOnJS(onPressIn)();
    })
    .onTouchesUp(() => {
      if (onPress != null) runOnJS(onPress)();
    })
    .onFinalize(() => {
      active.value = false;
      if (onPressOut != null) runOnJS(onPressOut)();
    });

  const rAnimatedStyle = useAnimatedStyle(() => {
    return animatedStyle ? animatedStyle(progress) : {};
  }, []);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, rAnimatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

export { BasePressable };

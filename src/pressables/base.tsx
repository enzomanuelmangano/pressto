import React, { useCallback, useMemo } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { AnimateProps, SharedValue } from 'react-native-reanimated';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { usePressablesConfig } from '../provider';
import type { PressableContextType } from '../provider/context';
import {
  scrollableInfoShared,
  useIsInInternalScrollContext,
} from './render-scroll';
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

  const isInScrollContext = useIsInInternalScrollContext();
  const isTapped = useSharedValue(false);

  const onBegin = useCallback(() => {
    'worklet';
    if (!enabled.value) return;

    active.value = true;
    if (onPressInProvider != null) runOnJS(onPressInProvider)();
    if (onPressIn != null) runOnJS(onPressIn)();
  }, [active, enabled.value, onPressIn, onPressInProvider]);

  useAnimatedReaction(
    () => {
      if (!isInScrollContext) {
        return false;
      }

      return (
        !scrollableInfoShared.value.isScrolling &&
        isTapped.value &&
        scrollableInfoShared.value.activatedTap
      );
    },
    (activated, prevActivated) => {
      if (activated && !prevActivated) {
        return onBegin();
      }
    }
  );

  const gesture = useMemo(() => {
    const tapGesture = Gesture.Tap()
      .maxDuration(4000)
      // check if enabledProp is a boolean
      // if it's a boolean, use it to enable/disable the gesture
      // if it's not a boolean, use the value of the enabled shared value (in each callback)
      .enabled(typeof enabledProp === 'boolean' ? enabledProp : true)
      .onTouchesDown(() => {
        'worklet';
        isTapped.value = true;
        if (!isInScrollContext) {
          return onBegin();
        }
      })
      .onTouchesUp(() => {
        'worklet';
        if (!enabled.value || !active.value) return;
        if (onPressProvider != null) runOnJS(onPressProvider)();
        if (onPress != null) runOnJS(onPress)();
      })
      .onFinalize(() => {
        'worklet';
        isTapped.value = false;
        if (!enabled.value || !active.value) return;
        active.value = false;
        if (onPressOutProvider != null) runOnJS(onPressOutProvider)();
        if (onPressOut != null) runOnJS(onPressOut)();
      });

    return tapGesture;
  }, [
    active,
    enabled.value,
    enabledProp,
    isInScrollContext,
    isTapped,
    onBegin,
    onPress,
    onPressOut,
    onPressOutProvider,
    onPressProvider,
  ]);

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

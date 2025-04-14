import React, { useCallback, useMemo, type ComponentProps } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { BaseButton, type BaseButtonProps } from 'react-native-gesture-handler';
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

type AnimatedPressablePropsStyle = Omit<
  BaseButtonProps['style'],
  'width' | 'height'
> & {
  width?: number;
  height?: number;
};

export type BasePressableProps = {
  children?: React.ReactNode;
  animatedStyle?: (progress: SharedValue<number>) => ViewStyle;
  enabled?: boolean;
} & Partial<PressableContextType<'timing' | 'spring'>> &
  Pick<AnimatedPressableProps, 'layout' | 'entering' | 'exiting'> & {
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
  } & { style?: AnimatedPressablePropsStyle };

const isNewArch = (global as any)?.nativeFabricUIManager === 'Fabric';

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
      return withAnimation(active.value ? 1 : 0, config);
    }, [config, withAnimation]);

    const onPressInWrapper = useCallback(() => {
      active.value = true;
      onPressInProvider?.();
      onPressIn?.();
    }, [active, onPressIn, onPressInProvider]);

    const onPressWrapper = useCallback(() => {
      active.value = false;
      onPressProvider?.();
      onPress?.();
    }, [active, onPress, onPressProvider]);

    const onPressOutWrapper = useCallback(() => {
      active.value = false;
      onPressOutProvider?.();
      onPressOut?.();
    }, [active, onPressOut, onPressOutProvider]);

    const rAnimatedStyle = useAnimatedStyle(() => {
      return animatedStyle ? animatedStyle(progress) : {};
    }, []);

    // This code handles style calculations for the pressable component
    // On the new React Native architecture, it returns the style as-is
    // On the old architecture, it ensures the borderRadius doesn't exceed half the smallest dimension
    // This prevents visual artifacts that can occur with large border radii
    const fixedStyle = useMemo(() => {
      if (isNewArch) {
        return rest?.style;
      }

      if (!rest?.style) {
        return {};
      }

      const baseStyle = StyleSheet.flatten(rest.style) as ViewStyle;
      const computedStyle = { ...baseStyle };
      const borderRadius = Number(computedStyle.borderRadius);
      const aspectRatio = Number(baseStyle.aspectRatio);
      const width = Number(baseStyle.width ?? 0);
      const height = Number(baseStyle.height ?? 0);

      if (baseStyle.width && baseStyle.height) {
        const computedBorderRadius = Math.min(
          borderRadius,
          Math.min(height, width) / 2
        );
        return { ...computedStyle, borderRadius: computedBorderRadius };
      }

      if (baseStyle.aspectRatio) {
        if (width) {
          const _height = width / aspectRatio;
          const computedBorderRadius = Math.min(
            borderRadius,
            Math.min(_height, width) / 2
          );
          return {
            ...computedStyle,
            borderRadius: computedBorderRadius,
          };
        }

        if (height) {
          const _width = height * aspectRatio;
          const computedBorderRadius = Math.min(
            borderRadius,
            Math.min(height, _width) / 2
          );
          return {
            ...computedStyle,
            borderRadius: computedBorderRadius,
          };
        }
      }

      if (computedStyle.borderRadius) {
        const computedBorderRadius = Math.min(
          borderRadius,
          Math.min(height, width) / 2
        );

        return {
          ...computedStyle,
          borderRadius: computedBorderRadius,
        };
      }

      return computedStyle;
    }, [rest?.style]);

    return (
      <AnimatedBaseButton
        {...rest}
        style={[fixedStyle, rAnimatedStyle]}
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

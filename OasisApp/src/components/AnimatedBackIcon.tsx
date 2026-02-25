import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

const ARROW_BODY =
  "M0.827404 11.4155C0.29759 11.9172 -6.29563e-07 12.5973 -5.98567e-07 13.3064C-5.67572e-07 14.0155 0.29759 14.6956 0.827404 15.1973L12.7634 26.6145L20.7659 26.6145L9.65823 15.9822L27 15.9822L30.0898 10.6305L9.65823 10.6305L20.7659 -9.07708e-07L12.7627 -5.57873e-07L0.827404 11.4155Z";
const TRAIL_1 =
  "M29 15.9822L31 15.9822L34.0898 10.6305L32.0898 10.6305L29 15.9822Z";
const TRAIL_2 =
  "M34.813 15.9822L33 15.9822L36.0898 10.6305L38 10.6305L34.813 15.9822Z";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface AnimatedBackIconProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

//i hate and love ts

export default function AnimatedBackIcon({
  onPress,
  style,
}: AnimatedBackIconProps) {
  const isPressed = useSharedValue(0);

  const handlePressIn = () => {
    isPressed.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    isPressed.value = withTiming(0, { duration: 200 });
  };

  const arrowBodyStyle = useAnimatedStyle(() => {
    const translateX = interpolate(isPressed.value, [0, 1], [0, -2]);
    return {
      transform: [{ translateX }],
    };
  });

  const trail1Style = useAnimatedStyle(() => {
    const scaleX = interpolate(isPressed.value, [0, 1], [1, 1.3]);
    const translateX = interpolate(isPressed.value, [0, 1], [0, 2]);
    return {
      transform: [{ scaleX }, { translateX }],
    };
  });

  const trail2Style = useAnimatedStyle(() => {
    const scaleX = interpolate(isPressed.value, [0, 1], [1, 1.6]);
    const translateX = interpolate(isPressed.value, [0, 1], [0, 5]);
    return {
      transform: [{ scaleX }, { translateX }],
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Svg width="28" height="38" viewBox="0 0 38 27" fill="none">
        {/*  @ts-expect-error */}
        <AnimatedPath d={ARROW_BODY} fill="white" style={arrowBodyStyle} />
        {/*  @ts-expect-error */}
        <AnimatedPath d={TRAIL_1} fill="white" style={trail1Style} />
        {/*  @ts-expect-error */}
        <AnimatedPath d={TRAIL_2} fill="white" style={trail2Style} />
      </Svg>
    </Pressable>
  );
}

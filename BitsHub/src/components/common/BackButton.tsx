import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface BackButtonProps { onPress?: () => void; style?: StyleProp<ViewStyle>; color?: string; size?: number; animated?: boolean }

const BackButton: React.FC<BackButtonProps> = ({ onPress, style, color = "#fff", size = 28, animated = true }) => {
  const isPressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(isPressed.value, [0, 1], [0, -3]) }, { scale: interpolate(isPressed.value, [0, 1], [1, 0.95]) }] }));

  return (
    <Pressable onPress={onPress} onPressIn={() => { if (animated) isPressed.value = withTiming(1, { duration: 150 }); }} onPressOut={() => { if (animated) isPressed.value = withTiming(0, { duration: 200 }); }} style={style} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Animated.View style={animated ? animatedStyle : undefined}><Ionicons name="arrow-back" size={size} color={color} /></Animated.View>
    </Pressable>
  );
};

export default BackButton;

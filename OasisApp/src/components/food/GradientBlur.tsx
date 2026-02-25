import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width: screenWidth } = Dimensions.get("window");

interface GradientBlurProps {
  width?: number; // custom width (default = full screen)
  height?: number; // height of blur
  top?: number; // vertical position (distance from top)
  bottom?: number; // or distance from bottom
  left?: number; // horizontal position
  right?: number; // or from right
  colors?: readonly [string, string, ...string[]]; // gradient colors (at least 2 required)
  intensity?: number; // blur intensity
  blurTint?: "light" | "dark" | "default"; // tint mode
  direction?: "vertical" | "horizontal"; // gradient direction
  borderRadius?: number; // optional rounding
  zIndex?: number; // z-index for layer positioning
}

export default function GradientBlur({
  width = screenWidth,
  height = 120,
  top,
  bottom,
  left = 0,
  right,
  colors = ["rgba(255,255,255,0.8)", "transparent"],
  intensity = 80,
  blurTint = "default",
  direction = "vertical",
  borderRadius = 0,
  zIndex,
}: GradientBlurProps) {
  const start = direction === "vertical" ? { x: 0.5, y: 0 } : { x: 0, y: 0.5 };
  const end = direction === "vertical" ? { x: 0.5, y: 1 } : { x: 1, y: 0.5 };

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          top,
          bottom,
          left,
          right,
          borderRadius,
          zIndex,
        },
      ]}
      pointerEvents="none"
    >
      <BlurView
        intensity={intensity}
        tint={blurTint}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={colors}
        style={StyleSheet.absoluteFill}
        start={start}
        end={end}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    overflow: "hidden",
  },
});

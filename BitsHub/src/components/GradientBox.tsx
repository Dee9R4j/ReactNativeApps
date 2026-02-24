import { r_w } from "@/utils/responsive";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

interface GradientBoxProps { width: number; height: number; border: number; children: React.ReactNode; padding?: number; gradientColors?: string[]; innerColor?: string }

export function GradientBox({ width, height, border, children, padding = 0, gradientColors = ["#fff", "#7f7f7f", "#fff"], innerColor = "#000000" }: GradientBoxProps) {
  const borderSize = Math.max(1, Math.round(r_w(border)));
  return (
    <View style={{ width, height, margin: padding }}>
      <LinearGradient colors={gradientColors as [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: 0 }]} />
      <View style={{ position: "absolute", top: borderSize, left: borderSize, right: borderSize, bottom: borderSize, backgroundColor: innerColor, overflow: "hidden" }}>{children}</View>
    </View>
  );
}

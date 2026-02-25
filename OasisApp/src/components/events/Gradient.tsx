import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  height?: number;
  style?: ViewStyle;
}

const BlackToTransparentGradient: React.FC<Props> = ({ height = 30, style }) => {
  return (
    <LinearGradient
      colors={["rgba(0,0,0,0.91)", "rgba(0,0,0,0)"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.6 }}
      style={[styles.gradient, { height }, style]}
    />
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
});

export default BlackToTransparentGradient;

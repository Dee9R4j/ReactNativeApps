import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { r_h, r_t, r_w } from "@utils/responsive";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import LoginButtonSVG from "@/../assets/images/login/login_button.svg";
import { GradientBox } from "./GradientBox";

const BUTTON_WIDTH = r_w(320);
const BUTTON_HEIGHT = r_h(51);
const BUTTON_WIDTH_BORDER = r_w(325);
const BUTTON_HEIGHT_BORDER = r_h(54);

interface PropTypes {
  disabled?: boolean;
  onPress: () => void;
  textButton: string;
}

export function GeneralButton({ disabled, onPress, textButton }: PropTypes) {
  return (
    <GradientBox
      height={BUTTON_HEIGHT_BORDER}
      width={BUTTON_WIDTH_BORDER}
      border={2}
      padding={r_h(4)}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={styles.buttonContainer}
        activeOpacity={0.8}
      >
        {/* Background gradient */}
        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <Canvas style={StyleSheet.absoluteFill}>
            <Rect x={0} y={0} width={BUTTON_WIDTH} height={BUTTON_HEIGHT}>
              <LinearGradient
                start={vec(0, BUTTON_HEIGHT / 2)}
                end={vec(BUTTON_WIDTH, BUTTON_HEIGHT / 2)}
                colors={["#450000", "#AB0000", "#450000"]}
              />
            </Rect>
          </Canvas>
        </View>

        {/* Button SVG overlay */}
        <View style={styles.svgWrapper}>
          <LoginButtonSVG width={BUTTON_WIDTH} height={BUTTON_HEIGHT} />
        </View>

        {/* Centered text or loader */}
        <View style={styles.textWrapper}>
          {disabled ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.text}>{textButton}</Text>
          )}
        </View>
      </TouchableOpacity>
    </GradientBox>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  svgWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: r_t(20),
    fontWeight: "600",
    fontFamily: "The Last Shuriken",
  },
});

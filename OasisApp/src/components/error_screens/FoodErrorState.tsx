import React, { memo } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from "react-native";
import { r_w, r_h, r_t } from "@/utils/responsive";

export type FoodErrorStateProps = {
  title: string;
  subtitle?: string;
  illustration: ImageSourcePropType;
  onRetry?: () => void;
  ctaLabel?: string;
  showButton?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  buttonBackground?: ImageSourcePropType;
};

const BUTTON_BG = require("@assets/images/errors/try_again_btn_bg.png");
const DEFAULT_LABEL = "TRY AGAIN";

const ILLUSTRATION_WIDTH = r_w(260);
const ILLUSTRATION_HEIGHT = Math.floor((ILLUSTRATION_WIDTH * 644) / 735);
const BUTTON_WIDTH = r_w(162);
const BUTTON_HEIGHT = r_h(42);

const FoodErrorState: React.FC<FoodErrorStateProps> = ({
  title,
  subtitle,
  illustration,
  onRetry,
  ctaLabel = DEFAULT_LABEL,
  showButton = true,
  containerStyle,
  contentStyle,
  buttonBackground = BUTTON_BG,
}) => {
  const shouldRenderButton = showButton && Boolean(ctaLabel);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.content, contentStyle]}>
        <Image
          source={illustration}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} accessibilityRole="text">
            {subtitle}
          </Text>
        ) : null}
        {shouldRenderButton ? (
          <Pressable
            onPress={onRetry}
            disabled={!onRetry}
            style={({ pressed }) => [
              styles.buttonWrapper,
              pressed && styles.buttonPressed,
              !onRetry && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
          >
            <ImageBackground
              source={buttonBackground}
              style={styles.buttonBackground}
              imageStyle={styles.buttonBackgroundImage}
              resizeMode="stretch"
            >
              <Text style={styles.buttonText}></Text>
            </ImageBackground>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default memo(FoodErrorState);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: r_w(24),
    paddingVertical: r_h(32),
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: ILLUSTRATION_WIDTH,
    height: ILLUSTRATION_HEIGHT,
  },
  title: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(20),
    fontWeight: "400",
    lineHeight: r_h(24),
    color: "#FFF",
    letterSpacing: 0.6,
    textAlign: "center",
    marginTop: r_h(16),
  },
  subtitle: {
    fontFamily: "Proza Libre",
    fontSize: r_t(16),
    fontWeight: "400",
    color: "#FFF",
    textAlign: "center",
    lineHeight: r_h(21.6),
    paddingHorizontal: r_w(12),
    marginTop: r_h(4),
  },
  buttonWrapper: {
    marginTop: r_h(18),
  },
  buttonBackground: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBackgroundImage: {
    resizeMode: "stretch",
  },
  buttonText: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(18),
    fontWeight: "400",
    color: "#FFF",
    lineHeight: r_h(21.6),
    textAlign: "center",
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

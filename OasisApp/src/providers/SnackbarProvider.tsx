// context/SnackbarProvider.tsx
import { GradientBox } from "@/components/GradientBox";
import { r_h, r_t, r_w } from "@/utils/responsive";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Easing,
} from "react-native";

interface SnackbarConfig {
  message: string;
  type: "success" | "error";
  color?: string;
  image?: any;
}

interface SnackbarContextType {
  showSnackbar: (config: SnackbarConfig) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

const snackbarWidth = r_w(350);
const snackbarHeight = r_h(60);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<SnackbarConfig>({
    message: "",
    type: "success",
    color: "rgba(0,0,0,0.5)",
    image: require("@assets/images/snackbarClouds.png"),
  });

  const slideAnim = useRef(new Animated.Value(120)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const showSnackbar = useCallback(
    ({ message, type, color, image }: SnackbarConfig) => {
      setConfig({
        message,
        type,
        color:
          color ||
          (type === "success"
            ? "#386A00" // green tone
            : "rgba(255, 0, 0, 0.4)"), // red tone
        image: image || require("@assets/images/snackbarClouds.png"),
      });
      setVisible(true);
    },
    []
  );

  useEffect(() => {
    if (visible) {
      // Animate in: slide up, fade in, scale up
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide after delay
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 120,
            duration: 350,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => setVisible(false));
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {visible && (
        <Animated.View
          style={[
            styles.snackbarWrapper,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <GradientBox width={snackbarWidth} height={snackbarHeight} border={1}>
            <View style={styles.shadowContainer}>
              <ImageBackground
                source={config.image}
                resizeMode="cover"
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
              >
                <View
                  style={[
                    styles.overlay,
                    { backgroundColor: config.color || "rgba(0,0,0,0.5)" },
                  ]}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.text}>{config.message}</Text>
                </View>
              </ImageBackground>
            </View>
          </GradientBox>
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  snackbarWrapper: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowContainer: {
    overflow: "hidden",
  },
  imageBackground: {
    width: snackbarWidth,
    height: snackbarHeight,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  imageStyle: {
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,

  },
  textContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    color: "#fff",
    fontSize: r_t(14),
    fontFamily: "The Last Shuriken",
    textAlign: "center",
  },
});

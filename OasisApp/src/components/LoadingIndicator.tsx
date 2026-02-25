import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import { getStatusBarHeight } from "@/utils/safeArea";
import LottieView from "lottie-react-native";

interface LoadingIndicatorProps {
  title?: string;
  subtitle?: string;
  size?: "small" | "large";
  color?: string; // Kept for backwards compatibility, but Lottie takes over
}

const LoadingIndicator = ({
  title,
  subtitle,
  size = "large",
  color = "#fff",
}: LoadingIndicatorProps) => {
  
  const lottieSize = size === "small" ? 40 : 80;

  const animationNode = (
    <LottieView
      source={require("@assets/rives/loading.json")}
      autoPlay
      loop
      style={{ width: lottieSize, height: lottieSize }}
    />
  );

  if (!title && !subtitle) {
    return animationNode;
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.loadingContainer}>
        {animationNode}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 16,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#a0a0a0",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingIndicator;

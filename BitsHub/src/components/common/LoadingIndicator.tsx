import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { r_w } from "@/utils/responsive";

interface LoadingIndicatorProps { title?: string; subtitle?: string; size?: "small" | "large"; color?: string }

const LoadingIndicator = ({ title, subtitle, size = "large", color = "#fff" }: LoadingIndicatorProps) => (
  <View style={styles.container}>
    {title && <Text style={styles.title}>{title}</Text>}
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    <ActivityIndicator size={size} color={color} style={{ marginTop: 20 }} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "transparent", padding: 16 },
  title: { color: "white", fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitle: { color: "#a0a0a0", fontSize: 16, textAlign: "center", marginBottom: 16 },
});

export default LoadingIndicator;

import React, { createContext, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutUp } from "react-native-reanimated";

interface SnackbarData { message: string; type: "success" | "error" | "info" }

const SnackbarContext = createContext<{ show: (data: SnackbarData) => void }>({ show: () => {} });

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarData | null>(null);

  const show = useCallback((data: SnackbarData) => {
    setSnackbar(data);
    setTimeout(() => setSnackbar(null), 3000);
  }, []);

  const colors = { success: "#27AE60", error: "#E74C3C", info: "#3498DB" };

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      {snackbar && (
        <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={[styles.container, { backgroundColor: colors[snackbar.type] }]}>
          <Text style={styles.text}>{snackbar.message}</Text>
          <Pressable onPress={() => setSnackbar(null)}><Text style={styles.dismiss}>✕</Text></Pressable>
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: { position: "absolute", top: 60, left: 16, right: 16, padding: 16, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", zIndex: 9999 },
  text: { color: "#fff", fontSize: 14, fontWeight: "500", flex: 1 },
  dismiss: { color: "#fff", fontSize: 18, marginLeft: 12 },
});

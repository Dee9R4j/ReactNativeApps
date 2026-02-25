import { useFastStore } from "@/state/fast/fast";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@react-navigation/native";
import myTheme from "@/utils/myTheme";
import { ActivityIndicator, Text, View } from "react-native";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSecureStore } from "@/state/secure/secure";
import { initializeDatabase, resetDatabase } from "@/models/init";
import { SnackbarProvider } from "@/providers/SnackbarProvider";

export { ErrorBoundary } from "expo-router";

void SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(false);

  // For custom fonts
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
    "CantoraOne-Regular": require("@assets/fonts/events/CantoraOne-Regular.ttf"),
    Firlest: require("@assets/fonts/events/firlest-regular.otf"),
    "The Last Shuriken": require("@assets/fonts/The-Last-Shuriken.ttf"),
    "Nuku Nuku": require("@assets/fonts/events/nuku1.ttf"),
    "Quattrocento Sans": require("assets/fonts/QuattrocentoSans-Regular.ttf"),
    "Quattrocento Sans Bold": require("assets/fonts/QuattrocentoSans-Bold.ttf"),
    "Proza Libre": require("assets/fonts/ProzaLibre-Regular.ttf"),
    "Proza Libre Bold": require("assets/fonts/ProzaLibre-Bold.ttf"),
    "JAPAN RAMEN": require("assets/fonts/japan-ramen.regular.otf"),
    Amanojaku: require("assets/fonts/Amanojaku-Demo.otf"),
    Roboto: require("@assets/fonts/Roboto.ttf"),
  });

  // Auth state
  const pref = useFastStore();
  const storeUser = useSecureStore((state) => state.user_id);

  // Initialize database
  useEffect(() => {
    const initDb = async () => {
      try {
        await resetDatabase(); // Dev mode — reset on each launch
        setDbReady(true);
        console.log("✅ Database ready");
      } catch (e: any) {
        console.error("❌ Database init failed:", e);
        setDbError(true);
        setDbReady(true); // Allow app to continue
      }
    };
    initDb();
  }, []);

  // Handle font loading errors
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  // Hide splash when fonts are loaded
  useEffect(() => {
    if (loaded) {
      console.log("✅ Fonts loaded");
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Show loading while DB/fonts initialize
  if (!dbReady || !loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <ActivityIndicator size="large" color="#56A8E8" />
      </View>
    );
  }

  if (dbError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#121212",
        }}
      >
        <Text style={{ color: "#fff" }}>Error initializing database</Text>
      </View>
    );
  }

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <ThemeProvider value={myTheme}>
            <StatusBar style="light" backgroundColor="dark" />
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="authentication"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="private" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default RootLayout;

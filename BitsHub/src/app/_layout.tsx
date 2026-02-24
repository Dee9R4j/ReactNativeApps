import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { useSecureStore } from "@/state/secure/secure";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Manrope-Regular": require("../../assets/fonts/Manrope/Manrope-Regular.ttf"),
    "Manrope-Regular-400": require("../../assets/fonts/Manrope/Manrope-Regular.ttf"),
    "Manrope-Medium": require("../../assets/fonts/Manrope/Manrope-Medium.ttf"),
    "Manrope-SemiBold": require("../../assets/fonts/Manrope/Manrope-SemiBold.ttf"),
    "Manrope-SemiBold-600": require("../../assets/fonts/Manrope/Manrope-SemiBold.ttf"),
    "Manrope-Bold": require("../../assets/fonts/Manrope/Manrope-Bold.ttf"),
    "Manrope-ExtraBold": require("../../assets/fonts/Manrope/Manrope-ExtraBold.ttf"),
    "Manrope-Light": require("../../assets/fonts/Manrope/Manrope-Light.ttf"),
    "Manrope-Light-300": require("../../assets/fonts/Manrope/Manrope-Light.ttf"),
    "Manrope-Light-400": require("../../assets/fonts/Manrope/Manrope-Light.ttf"),
    "Manrope-ExtraLight": require("../../assets/fonts/Manrope/Manrope-ExtraLight.ttf"),
    "own-regular": require("../../assets/fonts/OwnersTRIALWide-Medium-BF64361ef58e5aa.otf"),
    "SpaceMono-Regular": require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();
  const segments = useSegments();
  const token = useSecureStore((state) => state.getToken());
  const isAdmin = useSecureStore((state) => state.admin);

  // Fallback to avoid crashes if custom fonts fail. We should silence font loading errors for dummy app
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {});
    } else {
      setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 2000); // safety fallback
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    const inLoginGroup = segments[0] === "login";
    const inPrivateGroup = segments[0] === "private";
    const inAdminGroup = segments[0] === "admin";

    if (!token) {
      // User is not authenticated
      if (!inLoginGroup) {
        router.replace("/login/authentication");
      }
    } else {
      // User is authenticated
      if (inLoginGroup) {
        if (isAdmin) {
          router.replace("/admin");
        } else {
          router.replace("/private/tabs/events");
        }
      } else if (inAdminGroup && !isAdmin) {
        // Prevent normal users from accessing admin routes
        router.replace("/private/tabs/events");
      }
    }
  }, [token, segments, isAdmin, loaded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

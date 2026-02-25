import DrawerContent from "@/components/DrawerContent";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import React, { useCallback, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function UserLayout() {
  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => <DrawerContent {...props} />,
    [],
  );

  const baseScreenOptions = useMemo(
    () => ({
      headerShown: false,
      drawerType: "front" as const,
      drawerStyle: {
        backgroundColor: "#1a1a1a",
        width: 280,
      },
      overlayColor: "rgba(0, 0, 0, 0.6)",
      drawerActiveTintColor: "#ffffff",
      drawerInactiveTintColor: "#cccccc",
      lazy: true,
      unmountOnBlur: false,
    }),
    [],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={renderDrawerContent}
        screenOptions={({ route }) => {
          const focusedRoute =
            getFocusedRouteNameFromRoute(route) ?? "index";
          const isHomeRoute = route.name === "home";
          return {
            ...baseScreenOptions,
            swipeEnabled: isHomeRoute,
            swipeEdgeWidth: isHomeRoute ? 50 : 0,
          };
        }}
      >
        <Drawer.Screen name="home" options={{ headerShown: false }} />
        <Drawer.Screen name="drawer" options={{ headerShown: false }} />
        <Drawer.Screen name="notifications" options={{ headerShown: false }} />
        <Drawer.Screen name="sos" options={{ headerShown: false }} />
        <Drawer.Screen name="onboarding" options={{ headerShown: false }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

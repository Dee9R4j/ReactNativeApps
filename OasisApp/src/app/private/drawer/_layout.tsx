/**
 * Drawer screens layout — Stack navigator wrapper
 * Expo Router auto-discovers screens in subfolders
 */
import { Stack } from "expo-router";
import React from "react";

export default function DrawerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}

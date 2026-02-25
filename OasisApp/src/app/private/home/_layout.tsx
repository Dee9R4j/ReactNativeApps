import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        gestureDirection: "horizontal",
        animationDuration: 200,
        animationTypeForReplace: "push",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="wallet"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="merch"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="qr"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="shows"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
        }}
      />
      <Stack.Screen
        name="food"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="events"
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 200,
        }}
      />
    </Stack>
  );
}

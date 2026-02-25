import React from "react";
import { Stack } from "expo-router";

const transferLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default transferLayout;

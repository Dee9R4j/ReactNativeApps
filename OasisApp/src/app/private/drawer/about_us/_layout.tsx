import { Stack } from 'expo-router';
import React from 'react';

const AboutLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AboutLayout;
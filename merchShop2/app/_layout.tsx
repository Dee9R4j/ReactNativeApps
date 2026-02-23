//app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { ShopProvider } from '../src/context/ShopContext';
import NetworkProvider from '../src/components/NetworkProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ShopProvider>
          <NetworkProvider>
            <StatusBar style="dark" translucent={true} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="orders" options={{ presentation: 'modal', headerShown: true, title: 'My Orders' }} />
              <Stack.Screen name="wishlist" options={{ presentation: 'modal', headerShown: true, title: 'My Wishlist' }} />
              <Stack.Screen name="product/[id]" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="about" options={{ presentation: 'modal', title: 'About Us', headerShown: true }} />
              <Stack.Screen name="contact" options={{ presentation: 'modal', title: 'Contact Us', headerShown: true }} />
            </Stack>
          </NetworkProvider>
        </ShopProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
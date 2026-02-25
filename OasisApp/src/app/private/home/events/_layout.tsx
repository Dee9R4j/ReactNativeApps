import { Stack } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useFastStore } from '@/state/fast/fast'; 

export default function EventsLayout() {
  
  const signedStoreIn = useFastStore((state) => state.signedStoreIn);

  // This hook disables the Android hardware back button
  useEffect(() => {
    const backAction = () => {

      if (signedStoreIn) {
        BackHandler.exitApp();
        return true; 
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
    
  }, []); 

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, 
      }}
    />
  );
}
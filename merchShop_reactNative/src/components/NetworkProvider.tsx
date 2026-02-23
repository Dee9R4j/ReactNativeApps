//NetworkProvider.tsx
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Network from 'expo-network';

export default function NetworkProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isInternetReachable) {
        Alert.alert('No Internet', 'Please check your internet connection');
      }
    };
    
    checkNetwork();
    const interval = setInterval(checkNetwork, 10000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
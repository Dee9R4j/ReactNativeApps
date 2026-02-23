//NetworkProvider.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, Platform } from 'react-native';
import * as Network from 'expo-network';

export default function NetworkProvider({ children }: { children: React.ReactNode }) {
  const appState = useRef(AppState.currentState);
  const [isOfflineAlertVisible, setIsOfflineAlertVisible] = useState(false);

  const checkNetwork = async (isInitialCheck = false) => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isInternetReachable) {
        if (!isOfflineAlertVisible) {
          setIsOfflineAlertVisible(true);
          Alert.alert(
            'No Internet Connection',
            'Please check your internet connection and try again.',
            [{ text: 'OK', onPress: () => setIsOfflineAlertVisible(false) }],
            { cancelable: false }
          );
        }
      } else {
        // If internet becomes reachable and an alert was visible, allow it to be shown again if connection drops.
        // This part is tricky because Alert.dismiss() is not universally available or reliable.
        // Managing visibility with state is a more robust approach.
        if (isOfflineAlertVisible && !isInitialCheck) { // Only dismiss if it was shown due to this provider
            // Alert might have been dismissed by user already.
            // No direct way to dismiss an Alert programmatically in all cases.
            // The state `isOfflineAlertVisible` helps prevent multiple alerts.
        }
        setIsOfflineAlertVisible(false); // Reset alert visibility state
      }
    } catch (error) {
      console.warn("Network check failed:", error);
      // Fallback for platforms where getNetworkStateAsync might fail or not be fully supported
      if (!isOfflineAlertVisible) {
        setIsOfflineAlertVisible(true);
        Alert.alert(
          'Network Check Unavailable',
          'Could not verify internet connection. Please ensure you are connected.',
          [{ text: 'OK', onPress: () => setIsOfflineAlertVisible(false) }],
          { cancelable: false }
        );
      }
    }
  };

  useEffect(() => {
    checkNetwork(true); // Initial check

    // Subscription for app state changes (e.g., app comes to foreground)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        checkNetwork(); // Check network when app comes to foreground
      }
      appState.current = nextAppState;
    });

    // Periodic check (optional, can be battery intensive)
    // const interval = setInterval(checkNetwork, 30000); // Check every 30 seconds

    return () => {
      subscription.remove();
      // clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
}
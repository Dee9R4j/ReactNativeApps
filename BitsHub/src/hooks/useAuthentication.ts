/**
 * Authentication Hook
 * Biometric authentication using expo-local-authentication
 */
import { useState, useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export const useAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticateUser = useCallback(async (): Promise<boolean> => {
    setIsAuthenticating(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) return true; // Skip if no biometric hardware

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) return true; // Skip if not enrolled

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  return { authenticateUser, isAuthenticating };
};

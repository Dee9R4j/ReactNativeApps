import { useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export const useAuth = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const showProceedAnywayAlert = (): Promise<boolean> => {
        return new Promise((resolve) => {
            Alert.alert(
                "Authentication Not Available",
                "Biometric authentication or device security is not set up. You can still proceed with your transaction, but we recommend setting up device security for better protection.",
                [
                    { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                    {
                        text: "Setup Security",
                        onPress: () => {
                            if (Platform.OS === "ios") {
                                Linking.openURL("App-Prefs:TOUCHID_PASSCODE");
                            } else {
                                Linking.sendIntent("android.settings.SETTINGS").catch(() => {
                                    Alert.alert("Error", "Could not open device settings.");
                                });
                            }
                            resolve(false);
                        },
                    },
                    { text: "Proceed Anyway", onPress: () => resolve(true) },
                ]
            );
        });
    };

    const tryDeviceCredentialAuth = async (): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Use your device PIN, pattern, or password to confirm your transaction",
                cancelLabel: "Cancel",
                disableDeviceFallback: false,
            });
            if (result.success) return true;
            return await showProceedAnywayAlert();
        } catch (error) {
            console.error("Device credential auth error:", error);
            return await showProceedAnywayAlert();
        }
    };

    const authenticateUser = async (): Promise<boolean> => {
        try {
            setIsAuthenticating(true);
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) return await showProceedAnywayAlert();

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) return await tryDeviceCredentialAuth();

            const authTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
            let promptMessage = "Authenticate to confirm your transaction";
            if (authTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                promptMessage = "Use your fingerprint to confirm transaction";
            } else if (authTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                promptMessage = "Use face recognition to confirm transaction";
            } else if (authTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
                promptMessage = "Use iris recognition to confirm transaction";
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage,
                cancelLabel: "Cancel",
                fallbackLabel: "Use PIN/Password",
                disableDeviceFallback: false,
            });

            if (result.success) return true;
            if (result.error !== "user_cancel") {
                Alert.alert("Authentication Failed", "Could not authenticate. Please try again.");
            }
            return false;
        } catch (error) {
            console.error("Authentication error:", error);
            Alert.alert("Authentication Error", "An error occurred during authentication.");
            return false;
        } finally {
            setIsAuthenticating(false);
        }
    };

    return { isAuthenticating, authenticateUser };
};

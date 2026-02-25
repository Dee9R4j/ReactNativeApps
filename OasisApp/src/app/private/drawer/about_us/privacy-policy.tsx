import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { getStatusBarHeight } from "@/utils/safeArea";
import LoadingIndicator from "@/components/LoadingIndicator";
import ScreenHeader from "@/components/ScreenHeader";

const PRIVACY_POLICY_URL =
  "https://dvm-bitspilani.github.io/"

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Privacy Policy" />
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: PRIVACY_POLICY_URL }}
          style={styles.webview}
          containerStyle={styles.webviewWrapper}
          startInLoadingState={true}
          renderLoading={() => (
            <LoadingIndicator title="Loading Privacy Policy..." />
          )}
          injectedJavaScript={`
            (function() {
              document.body.style.backgroundColor = '#1a1a1a';
              document.documentElement.style.backgroundColor = '#1a1a1a';
              
              const style = document.createElement('style');
              style.innerHTML = \`
                * {
                  background-color: #1a1a1a !important;
                  color: #ffffff !important;
                }
                body, html {
                  background-color: #1a1a1a !important;
                }
              \`;
              document.head.appendChild(style);
            })();
            true;
          `}
          onLoad={() => {}}
          backgroundColor="#1a1a1a"
          mixedContentMode="compatibility"
          domStorageEnabled={true}
          javaScriptEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: getStatusBarHeight(),
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  webviewWrapper: {
    backgroundColor: "#1a1a1a",
  },
  webview: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
});

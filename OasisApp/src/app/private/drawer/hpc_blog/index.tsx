import React from "react";
import { StyleSheet, SafeAreaView, } from "react-native";

import { getStatusBarHeight } from "@/utils/safeArea";
import { WebView } from 'react-native-webview';
import ScreenHeader from "@/components/ScreenHeader";


  const customCSS = `
      body {
        background-color: #f0f0f0 !important;
        font-family: sans-serif !important;
      }
      h1 {
        color: #333 !important;
      }
      .my-custom-class {
        border: 1px solid blue;
        padding: 10px;
      }
    `;


     const injectedJavaScript = `
      (function() {
        var style = document.createElement('style');
        style.innerHTML = \`${customCSS}\`; // Use backticks for template literals
        document.head.appendChild(style);
      })();
      true; // Important: The injectedJavaScript needs to return a boolean value
    `;
  
export default function aboutUs() {
  return (
    <SafeAreaView style={styles.container}>
      
      <ScreenHeader title="HPC Blog" showBackButton={true} />
      <WebView 
        source={{ uri: 'https://dvm-bitspilani.github.io/OasisApp-2025-blogs/hpc.html' }} 
        style={{ flex: 1 }} 
        injectedJavaScript={injectedJavaScript}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: getStatusBarHeight(),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#ffffff",
  },
});

import 'dotenv/config';
import { withPlugins } from '@expo/config-plugins';
import { withBuildProperties } from 'expo-build-properties';

export default ({ config }) => withPlugins(config, [
  [withBuildProperties, {
    android: {
      newArchEnabled: true,
      extraProguardRules: "-keep public class com.yourcompany.workouttrainer.BuildConfig { *; }"
    },
    ios: {
      newArchEnabled: true,
      extraPods: [
        { name: 'ReactNativeLocalization', path: '../node_modules/react-native-localization' }
      ]
    },
  }],
  [
    "expo-screen-orientation",
    {
      "initialOrientation": "PORTRAIT"
    }
  ],
  (config) => ({
    ...config,
    owner: "dee2005p",
    expo: {
      ...config.expo,
      name: "WorkoutTrainer2",
      slug: "WorkoutTrainer2",
      version: "1.0.0",
      orientation: "portrait",
      jsEngine: "hermes",
      icon: "./assets/icon.png",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#080808"
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#080808"
        },
        package: "com.yourcompany.workouttrainer",
        versionCode: 1,
        jsEngine: "hermes",
        permissions: [
            "INTERNET",
            "ACCESS_NETWORK_STATE",
            "ACCESS_WIFI_STATE"
        ],
        networkSecurityConfig: "@xml/network_security_config",
        softwareKeyboardLayoutMode: "resize"
      },
      ios: {
        jsEngine: "hermes",
        supportsTablet: true,
        bundleIdentifier: "com.yourcompany.workouttrainer",
        buildNumber: "1.0.0",
        requireFullScreen: true
      },
      extra: {
        eas: {
          projectId: "9c43bae2-251b-443a-b8c3-bb8129ec7b61"
        },
        apiKey: process.env.EXPO_PUBLIC_API_KEY,
      },
      runtimeVersion: {
        policy: "appVersion"
      },
      updates: {
        url: "https://u.expo.dev/9c43bae2-251b-443a-b8c3-bb8129ec7b61",
        enabled: true,
        checkAutomatically: "ON_LOAD",
        fallbackToCacheTimeout: 30000
      },
      plugins: [
        ["expo-screen-orientation", { "initialOrientation": "PORTRAIT" }],
        ["expo-font"],
        ["expo-build-properties"]
      ]
    }
  })
]);
import { loginUser } from "@api/login-auth.api";
import { googleAuth } from "@api/google-auth.api";
import { useFastStore } from "@/state/fast/fast";
import { AuthStoreType, useSecureStore } from "@/state/secure/secure";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
import { ScrollingHero } from "@components/login/ScrollingHero";
import { OasisTitleCard } from "@components/login/TitleCard";
import { r_h, r_t, r_w } from "@utils/responsive";
import { GradientTextBox } from "@components/login/GradientTextBox";
import { LoginButton } from "@components/login/LoginButton";
import { GoogleSignIn } from "@components/login/GoogleSignInButton";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import BackgroundSVG from "@/../assets/images/login/background_pattern.svg";
import { router } from "expo-router";
import PostHog from "posthog-react-native";
import { posthog } from "@utils/posthog";

export default function LoginScreen() {
  const { showSnackbar } = useSnackbar();
  const insets = useSafeAreaInsets();
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const handleOutsideTap = () => {
    usernameRef.current?.blur();
    passwordRef.current?.blur();
    Keyboard.dismiss();
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const ctx = useSecureStore() as AuthStoreType;
  const pref = useFastStore();

  const keyboard = useAnimatedKeyboard();

  const translatePasswordStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -1 * keyboard.height.value * 0.5,
        },
      ],
    };
  });

  const animatedMadeWithStyle = useAnimatedStyle(() => {
    return {
      opacity: keyboard.height.value > 0 ? 0 : 1,
    };
  });

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, ({ endCoordinates }) => {
      setKeyboardHeight(endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();
    keyboard.height.set((_v) => 0);

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");
    setLoadingLogin(true);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const res = await loginUser({
      username: trimmedUsername,
      password: trimmedPassword,
      reg_token: undefined,
    });

    console.log("EArlier tokens found ? :", ctx.JWT);

    if (res.success && res.data) {
      const {
        JWT,
        user_id,
        qr_code,
        name,
        email,
        phone,
        referral_code,
        bitsian_id,
        fcm_token,
      } = res.data;

      ctx.setToken(
        JWT,
        user_id,
        qr_code,
        name,
        email,
        phone,
        referral_code,
        bitsian_id,
      );
      // Set Bitsian flag based on bitsian_id presence
      ctx.setIsBitsian(!!(bitsian_id && String(bitsian_id).trim().length > 0));

      setUsername("");
      setPassword("");
      pref.setLoggedIn(true);
      pref.setShouldShowOnboarding(!pref.hasSeenOnboarding);

      posthog.identify(`${user_id}`, {
        name: name,
        email: email,
      });

      if (res.data.user_id === 17635) {
        pref.setStoreLoggedIn(true);
        console.log("STore wala banda logged in");
        router.replace("/private/home/events" as any);
        pref.setShouldShowOnboarding(false);
      }

      console.log("ℹ️ Dummy mode: skipping FCM token send/subscription");
      router.replace("/private/home" as any);
    } else {
      showSnackbar({
        message: res.errorMessage || "Login failed",
        type: "error",
      });
    }

    setLoadingLogin(false);
  };

  const handleGoogleLogin = async () => {
    Keyboard.dismiss();
    keyboard.height.set((_v) => 0);
    setError("");
    setLoadingGoogle(true);

    const res = await loginUser({
      username: "test1",
      password: "testing321",
      reg_token: undefined,
    });

    if (res.success && res.data) {
      const {
        JWT,
        user_id,
        qr_code,
        name,
        email,
        phone,
        referral_code,
        bitsian_id,
        fcm_token,
      } = res.data;

      ctx.setToken(
        JWT,
        user_id,
        qr_code,
        name,
        email,
        phone,
        referral_code,
        bitsian_id,
      );
      ctx.setIsBitsian(!!(bitsian_id && String(bitsian_id).trim().length > 0));

      setUsername("");
      setPassword("");
      pref.setLoggedIn(true);
      pref.setShouldShowOnboarding(!pref.hasSeenOnboarding);

      posthog.identify(`${user_id}`, {
        name: name,
        email: email,
      });

      if (res.data.user_id === 17635) {
        pref.setStoreLoggedIn(true);
        router.replace("/private/home/events" as any);
        pref.setShouldShowOnboarding(false);
      } else {
        router.replace("/private/home" as any);
      }
    } else {
      showSnackbar({
        message: res.errorMessage || "Login failed",
        type: "error",
      });
      console.log(`❌ ${res.errorMessage || "Login failed"}`);
    }

    setLoadingGoogle(false);
  };

  const [KC, SetKC] = useState<string[]>([]);

  const KonamiCode = (gesture: string) => {
    const code = ["UP", "DOWN", "LEFT", "RIGHT"] as const;
    console.log(gesture);
    SetKC((prev) => {
      // Keep only the last 8 inputs
      const next = [...prev, gesture].slice(-4);
      if (next.length === 4) {
        const isMatch = code.every((c, i) => next[i] === c);
        const wisdom = [
          "SIX SEVEN!!!",
          "Open air...",
          "Launched before day 0",
          "Webstorm > VSCode",
          "I <3 Claude Sonnet 4.5",
          "Posthog clarity",
        ];
        if (isMatch) {
          let random_int = Math.floor(Date.now() % wisdom.length);
          showSnackbar({
            message: wisdom[random_int],
            type: "success",
          });
          // reset after success so it can be triggered again
          return [];
        }
      }
      return next;
    });
  };

  const upGesture = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd(() => {
      runOnJS(KonamiCode)("UP");
    });
  const downGesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd(() => {
      runOnJS(KonamiCode)("DOWN");
    });
  const leftGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      runOnJS(KonamiCode)("LEFT");
    });
  const rightGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      runOnJS(KonamiCode)("RIGHT");
    });

  const compositeGesture = Gesture.Exclusive(
    upGesture,
    downGesture,
    leftGesture,
    rightGesture,
  );

  useEffect(() => {
    if (error) {
      showSnackbar({
        message: error,
        type: "error",
      });
    }
  }, [error]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <TouchableWithoutFeedback onPress={handleOutsideTap} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            zIndex: 4,
            backgroundColor: "#000",
            borderWidth: 3,
          }}
        >
          <View
            style={{
              flex: 1,
              zIndex: 10,
              height: r_h(852),
              overflow: "hidden",
            }}
          >
            <Animated.View style={[styles.container, translatePasswordStyle]}>
              <TouchableWithoutFeedback style={styles.carouselContainer}>
                <ScrollingHero />
              </TouchableWithoutFeedback>
              <GestureDetector gesture={compositeGesture}>
                <OasisTitleCard />
              </GestureDetector>
              <View>
                <View style={{ width: r_w(320) }}>
                  <GradientTextBox
                    type={"username"}
                    value={username}
                    style={styles.inputBox}
                    usernameRef={usernameRef}
                    onChangeText={setUsername}
                    onSubmitEditing={handleLogin}
                    placeholder={"username (test1)"}
                  />
                </View>
              </View>
              <Animated.View style={[{ width: r_w(320) }]}>
                <GradientTextBox
                  type={"password"}
                  value={password}
                  style={styles.inputBox}
                  passwordRef={passwordRef}
                  onChangeText={setPassword}
                  onSubmitEditing={handleLogin}
                  placeholder={"password (testing321)"}
                />
              </Animated.View>

              <LoginButton disabled={loadingLogin} onPress={handleLogin} />
              <GoogleSignIn
                onPress={handleGoogleLogin}
                disabled={loadingGoogle}
              />
            </Animated.View>
            <View
              style={[
                styles.footer,
                {
                  bottom: insets.bottom + 24 - keyboardHeight,
                  backgroundColor: "transparent",
                  zIndex: 100,
                },
              ]}
            >
              <Text style={styles.footerText}>
                Made with <Text style={styles.heart}>♥</Text> by DVM
              </Text>
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 1,
              overflow: "hidden",
              alignItems: "center",
              bottom: r_h(0),
            }}
          >
            <BackgroundSVG width={r_w(383)} height={r_h(222)} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  carouselContainer: {
    width: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  container: {
    flex: 1,
    alignItems: "center",
    alignSelf: "stretch",
    width: "100%",
  },
  footer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    bottom: 24,
  },
  footerText: {
    color: "#fff",
    fontSize: r_t(13.89),
    letterSpacing: r_t(0.589),
    fontWeight: "400",
    fontFamily: "The Last Shuriken",
    zIndex: 500,
  },
  heart: {
    color: "#FF3D5A",
    fontSize: r_t(13.89),
    fontWeight: "bold",
  },
  inputBox: {
    width: "100%",
    height: r_h(51),
    marginBottom: 16,
  },
});

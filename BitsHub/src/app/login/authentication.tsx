import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { mockApi } from "@/api/mockAdapter";
import { useSecureStore } from "@/state/secure/secure";
import { Ionicons } from "@expo/vector-icons";
import {
  LOGIN_BACKGROUND_PNG,
  IMAGE_10_PNG,
  IMAGE_9_PNG,
  IMAGE_8_PNG,
  IMAGE_7_PNG,
} from "@/utils/common";

export default function Authentication() {
  const router = useRouter();
  const setToken = useSecureStore((state) => state.setToken);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await mockApi.login(username, password);

      if (response.success) {
        setToken({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userID: response.userID,
          admin: response.admin,
          username: response.username,
        });
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStandardLogin = async () => {
    setUsername("dummyDemoUser");
    setPassword("anything");
    try {
      setLoading(true);
      setError("");
      const response = await mockApi.login("dummyDemoUser", "anything");

      if (response.success) {
        setToken({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userID: response.userID,
          admin: response.admin,
          username: response.username,
        });
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={LOGIN_BACKGROUND_PNG}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Bubble decoration images */}
      <Image
        source={IMAGE_10_PNG}
        style={styles.topRightImage}
        resizeMode="contain"
      />
      <Image
        source={IMAGE_7_PNG}
        style={styles.topLeftImage}
        resizeMode="contain"
      />
      <Image
        source={IMAGE_8_PNG}
        style={styles.bottomLeftImage}
        resizeMode="contain"
      />
      <Image
        source={IMAGE_9_PNG}
        style={styles.bottomRightImage}
        resizeMode="contain"
      />

      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>BITSHub</Text>

        <View style={styles.formContainer}>
          {/* Username Input */}
          <View style={styles.inputRow}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username (e.g. admin1 or test1)"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputRow}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password (e.g. testing321)"
              placeholderTextColor="#aaa"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? "eye" : "eye-off"}
                size={20}
                color="#aaa"
                style={styles.iconRight}
              />
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign in</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Google/Demo Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleStandardLogin}
          >
            <Image
              source={require("../../../assets/images/google.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>
              Continue as Standard User
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with <Text style={styles.heart}>♥</Text> by DVM
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 2,
  },
  title: {
    fontSize: 65,
    color: "#fff",
    fontFamily: "own-regular",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000050",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4047CD",
    marginBottom: 16,
    paddingHorizontal: 12,
    width: "100%",
    height: 48,
    shadowColor: "#4047CD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  icon: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    height: 48,
    letterSpacing: 0.5,
  },
  signInButton: {
    backgroundColor: "#3C00AE",
    borderRadius: 8,
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 18,
    shadowColor: "#3C00AE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signInButtonText: {
    fontFamily: "Manrope-SemiBold-600",
    color: "#fff",
    fontSize: 18,
    letterSpacing: 0,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 5,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#FCFCFC",
  },
  orText: {
    color: "#FCFCFC",
    marginHorizontal: 8,
    fontSize: 15,
    fontFamily: "Manrope-Light-300",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    width: "100%",
    minHeight: 48,
    paddingVertical: 15,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 2,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
  },
  errorText: {
    color: "#FF4444",
    marginBottom: 15,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  heart: {
    color: "#FF3D5A",
    fontSize: 16,
    fontWeight: "bold",
  },
  topRightImage: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 200,
    height: 200,
    zIndex: 1,
    elevation: 1,
  },
  topLeftImage: {
    position: "absolute",
    top: 1,
    left: 0,
    width: 149,
    height: 249,
    zIndex: 1,
    elevation: 1,
  },
  bottomLeftImage: {
    position: "absolute",
    bottom: 5,
    left: 0,
    width: 148,
    height: 200,
    zIndex: 1,
    elevation: 1,
  },
  bottomRightImage: {
    position: "absolute",
    bottom: -40,
    right: 0,
    width: 167,
    height: 270,
    zIndex: 1,
    elevation: 1,
  },
});

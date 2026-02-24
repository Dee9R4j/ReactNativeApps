import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSecureStore } from "@/state/secure/secure";
import QRCode from "react-native-qrcode-svg";
import { QR_BG_PNG, GLOW } from "@/utils/common";

export default function MyQRScreen() {
  const router = useRouter();
  const userId = useSecureStore((state) => state.userID);
  const username = useSecureStore((state) => state.username);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Glow background */}
      <View style={styles.glowWrapper}>
        <Image source={GLOW} style={styles.glowImage} resizeMode="cover" />
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My QR Code</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.name}>{username || "Dummy User"}</Text>
          <Text style={styles.uid}>ID: {userId}</Text>

          <View style={styles.qrWrapper}>
            <QRCode
              value={userId || "UNKNOWN"}
              size={200}
              color="#1F005B"
              backgroundColor="#fff"
            />
          </View>
          <Text style={styles.scanText}>Show this QR at the venue</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  glowWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
  },
  glowImage: {
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Manrope-SemiBold-600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1,
  },
  card: {
    backgroundColor: "#0E002B",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#1F005B",
    shadowColor: "rgba(14, 0, 43, 0.75)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Manrope-Bold",
  },
  uid: {
    color: "#BCBCBC",
    fontSize: 14,
    marginBottom: 30,
    fontFamily: "Manrope-Regular",
  },
  qrWrapper: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
  },
  scanText: {
    color: "#5B5CE2",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope-SemiBold-600",
  },
});

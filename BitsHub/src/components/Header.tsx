import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import MenuIcon from "@assets/icons/headermenu.svg";
import QrIcon from "@assets/icons/headerqr.svg";
import { useSecureStore } from "@/state/secure/secure";

interface HeaderProps {
  onMenuPress: () => void;
}

export default function Header({ onMenuPress }: HeaderProps) {
  const openDrawer = onMenuPress;
  const username = useSecureStore((state) => state.username);
  const displayName = username?.trim() || "User";

  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <View style={styles.topRowleft}>
          <Pressable onPress={openDrawer}>
            {({ pressed }) => (
              <MenuIcon
                width={30}
                height={30}
                fill="white"
                style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>

          <Text style={styles.title}>{`Hello ${displayName}!`}</Text>
        </View>

        <Link href="/private/qr" asChild>
          <Pressable>
            {({ pressed }) => (
              <QrIcon
                width={24}
                height={24}
                fill="white"
                style={{ marginRight: 0, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Link>
      </View>

      <View style={styles.bottomRow} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 0,
    margin: 0,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#090013",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 120,
  },
  topRow: {
    paddingTop: 59,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 123,
  },
  topRowleft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    width: 106,
    flexShrink: 0,
    color: "#E4E4E4",
    fontFamily: "Manrope-SemiBold-600",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "700",
  },
  bottomRow: {
    height: 102,
    backgroundColor: "transparent",
  },
});

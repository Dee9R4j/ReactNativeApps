import React, { useEffect } from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBaseStore as useNotificationStore } from "@/state/base/base";
import { router } from "expo-router";

interface NotificationBellProps {
  color?: string;
  size?: number;
  style?: any;
}

export default function NotificationBell({
  color = "#fff",
  size = 24,
  style,
}: NotificationBellProps) {
  const { unreadCount, refreshUnreadCount } = useNotificationStore();

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  const handlePress = () => {
    router.push("/private/notifications" as any);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="notifications-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? "99+" : unreadCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#F44336",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});

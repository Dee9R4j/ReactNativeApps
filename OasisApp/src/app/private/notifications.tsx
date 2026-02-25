import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ImageBackground,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useBaseStore as useNotificationStore } from "@/state/base/base";
import type { NotificationItem } from "@/state/base/notificationSlice";
import { getStatusBarHeight } from "@/utils/safeArea";

import NotificationCard from "@/components/notifications/NotificationCard";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
import ScreenHeader from "@/components/ScreenHeader";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<NotificationItem>,
);

const { width, height } = Dimensions.get("window");
export default function NotificationsScreen() {
  const {
    notifications,
    error,
    fetchNotifications,
    markAsRead,
    refreshUnreadCount,
  } = useNotificationStore();

  const [refreshing, setRefreshing] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      showSnackbar({
        message: "Network error, please try again",
        type: "error",
      });
    }
  }, [error, showSnackbar]);

  useFocusEffect(
    useCallback(() => {
      useNotificationStore.setState({ isScreenActive: true } as any);

      headerOpacity.value = 0;
      headerTranslateY.value = -20;
      contentOpacity.value = 0;
      contentTranslateY.value = 30;

      headerOpacity.value = withTiming(1, { duration: 500 });
      headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });

      contentOpacity.value = withDelay(250, withTiming(1, { duration: 600 }));
      contentTranslateY.value = withDelay(
        250,
        withSpring(0, { damping: 18, stiffness: 100 }),
      );

      const loadNotifications = async () => {
        try {
          await fetchNotifications();
          await refreshUnreadCount();
        } finally {
          setIsDataLoaded(true);
        }
      };

      const timeoutId = setTimeout(loadNotifications, 200);

      return () => {
        clearTimeout(timeoutId);
        useNotificationStore.setState({ isScreenActive: false } as any);
        setIsDataLoaded(false);
      };
    }, [fetchNotifications, refreshUnreadCount]),
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchNotifications();
      await refreshUnreadCount();
    } catch (err: any) {
      console.error("Error refreshing notifications:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
      await refreshUnreadCount();
    }

    // Priority 1: Use the URL field if available (for generic deep links)
    if (notification.url) {
      const normalizedUrl = notification.url.toLowerCase().trim();

      // Map URL to route
      if (normalizedUrl.includes("food")) {
        router.push("/private/home/food/stalls" as any);
      } else if (normalizedUrl.includes("event")) {
        router.push("/private/home/events" as any);
      } else if (normalizedUrl.includes("wallet")) {
        router.push("/private/home/wallet" as any);
      } else if (normalizedUrl.includes("merch")) {
        router.push("/private/home/merch" as any);
      } else if (normalizedUrl.includes("show")) {
        router.push("/private/home/shows" as any);
      } else if (normalizedUrl.includes("qr")) {
        router.push("/private/home/qr" as any);
      } else if (normalizedUrl.includes("about")) {
        router.push("/private/drawer/about_us" as any);
      } else if (normalizedUrl.includes("contact")) {
        router.push("/private/drawer/contact_us" as any);
      } else if (normalizedUrl.includes("developer")) {
        router.push("/private/drawer/developers" as any);
      } else if (normalizedUrl.includes("general")) {
        router.push("/private/drawer/general_info" as any);
      } else if (normalizedUrl.includes("sponsor")) {
        router.push("/private/drawer/sponsors" as any);
      } else if (normalizedUrl.includes("map")) {
        router.push("/private/drawer/map" as any);
      } else if (normalizedUrl.includes("order")) {
        router.push("/private/home/food/orders/" as any);
      }
      // If URL doesn't match any pattern, just mark as read without navigation
      return;
    }

    // Priority 2: Check for order_update type (backward compatibility)
    if (notification.type === "order_update" && notification.order_id) {
      router.push("/private/home/food/orders/" as any);
      return;
    }

    // Priority 3: No URL and no specific type - just mark as read without navigation
    // This allows notifications to work without requiring a URL parameter
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const getDaySuffix = (d: number) => {
      if (d >= 11 && d <= 13) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${formattedHours}:${formattedMinutes} ${ampm}, ${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  const renderNotification = useCallback(
    ({ item, index }: { item: NotificationItem; index: number }) => (
      <Animated.View
        entering={
          isDataLoaded ? undefined : FadeInDown.delay(index * 100).duration(400)
        }
        exiting={FadeOutUp.duration(300)}
        layout={Layout.springify()}
      >
        <NotificationCard
          item={item}
          onPress={() => handleNotificationPress(item)}
          formatTime={formatTime}
        />
      </Animated.View>
    ),
    [isDataLoaded],
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Animated.View
        style={styles.emptyState}
        entering={FadeInDown.delay(200).duration(500)}
      >
        <Ionicons name="notifications-off-outline" size={80} color="#666" />
        <Text style={styles.emptyStateTitle}>No Notifications Yet</Text>
        <Text style={styles.emptyStateSubtitle}>
          Your order updates and other alerts will appear here.
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={[{flex: 1}, styles.container]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("@assets/images/common-bg-png.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScreenHeader title="NOTIFICATIONS" />

        <Animated.View style={[{ flex: 1 }, contentAnimatedStyle]}>
          <AnimatedFlashList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={90}
            removeClippedSubviews={true}
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#fff"
              />
            }
            ListEmptyComponent={renderEmptyState}
          />
        </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  list: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  listContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 500,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
});

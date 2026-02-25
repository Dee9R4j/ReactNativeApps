import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeOut,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { useOrdersContext } from "./_layout";
import OrderCard from "@/components/food/OrderCard";
import { Order } from "@/utils/food-types";
import FoodErrorState from "@/components/error_screens/FoodErrorState";
import LoadingIndicator from "@/components/LoadingIndicator";
import { r_w, r_h, r_t } from "@/utils/responsive";

const AnimatedRenderItem = React.memo(
  ({
    item,
    onOtpSeen,
    index,
  }: {
    item: Order;
    onOtpSeen: (orderId: number, otp?: number) => void;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 80, 300)).duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <OrderCard order={item} onOtpSeen={onOtpSeen} />
    </Animated.View>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.status === nextProps.item.status &&
      prevProps.item.otp_seen === nextProps.item.otp_seen &&
      prevProps.item.otp === nextProps.item.otp
    );
  }
);

export default function ActiveOrdersScreen() {
  const {
    filteredOrders,
    isRefreshingOrders,
    isFetchingMoreOrders,
    onRefresh,
    loadMoreOrders,
    handleOtpSeen,
    error,
    ordersHasMore,
  } = useOrdersContext();

  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.98);

  useFocusEffect(
    useCallback(() => {
      translateY.value = 30;
      opacity.value = 0;
      scale.value = 0.98;

      let scaleTimeout: ReturnType<typeof setTimeout>;
      let translateTimeout: ReturnType<typeof setTimeout>;

      opacity.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.quad),
      });

      scaleTimeout = setTimeout(() => {
        scale.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        });
      }, 50);

      translateTimeout = setTimeout(() => {
        translateY.value = withTiming(0, {
          duration: 450,
          easing: Easing.out(Easing.cubic),
        });
      }, 100);

      return () => {
        clearTimeout(scaleTimeout);
        clearTimeout(translateTimeout);
      };
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const filteredActiveOrders = useMemo(
    () =>
      filteredOrders
        .filter((order) => [0, 1, 2].includes(order.status))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
    [filteredOrders]
  );

  const hasTriggeredEndReach = useRef(false);

  useEffect(() => {
    hasTriggeredEndReach.current = false;
  }, [filteredActiveOrders.length]);

  const handleEndReached = useCallback(() => {
    if (
      hasTriggeredEndReach.current ||
      isFetchingMoreOrders ||
      !ordersHasMore ||
      filteredActiveOrders.length === 0
    ) {
      return;
    }

    hasTriggeredEndReach.current = true;
    loadMoreOrders();
  }, [
    filteredActiveOrders.length,
    isFetchingMoreOrders,
    loadMoreOrders,
    ordersHasMore,
  ]);

  const renderItem: ListRenderItem<Order> = useCallback(
    ({ item, index }) => (
      <AnimatedRenderItem item={item} onOtpSeen={handleOtpSeen} index={index} />
    ),
    [handleOtpSeen]
  );

  const keyExtractor = useCallback((item: Order) => item.id.toString(), []);

  const hasData = filteredActiveOrders.length > 0;
  const showError = error && !hasData;

  const ListHeaderComponent = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {hasData ? "ACTIVE" : "NO ACTIVE ORDERS"}
        </Text>
      </View>
    );
  }, [hasData]);

  const ListFooterComponent = useCallback(() => {
    if (isFetchingMoreOrders) {
      return (
        <View style={styles.footerLoader}>
          <LoadingIndicator subtitle="Loading more orders..." />
        </View>
      );
    }
    // Add extra padding to prevent hiding behind blur/tab bar
    return <View style={styles.footerSpacer} />;
  }, [isFetchingMoreOrders]);

  const getItemType = useCallback((item: Order) => {
    return `order-${item.id}`;
  }, []);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <FlashList<Order>
        data={filteredActiveOrders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemType={getItemType}
        removeClippedSubviews={false}
        estimatedItemSize={168}
        contentContainerStyle={styles.listContent}
        onRefresh={onRefresh}
        refreshing={isRefreshingOrders}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={
          <Animated.View style={styles.emptyStateContainer}>
            {showError ? (
              <FoodErrorState
                title="SOMETHING WENT WRONG"
                subtitle="Pull down to try again."
                illustration={require("@assets/images/errors/something_when_wrong_bg.png")}
                onRetry={onRefresh}
                containerStyle={styles.errorStateContainer}
              />
            ) : (
              <FoodErrorState
                title="NO ACTIVE ORDERS"
                subtitle="Your active orders will appear here once you place them."
                illustration={require("@assets/images/errors/no_orders_yet_bg.png")}
                showButton={false}
                containerStyle={styles.errorStateContainer}
              />
            )}
          </Animated.View>
        }
        drawDistance={300}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  flashList: {
    flex: 1,
    backgroundColor: "transparent",
  },
  listContent: {
    paddingHorizontal: r_w(16),
    paddingTop: r_h(4),
    paddingBottom: r_h(18),
    backgroundColor: "transparent",
  },
  headerContainer: {
    paddingVertical: r_h(12),
    paddingHorizontal: r_w(4),
    marginBottom: r_h(8),
  },
  headerText: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(20),
    fontWeight: "400",
    color: "#FFF",
    letterSpacing: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  footerLoader: {
    paddingVertical: r_h(20),
    alignItems: "center",
  },
  footerSpacer: {
    height: r_h(120), // Extra padding to prevent hiding behind blur/tab bar
  },
  errorStateContainer: {
    paddingVertical: 0,
  },
});

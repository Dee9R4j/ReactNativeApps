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
      entering={FadeInDown.delay(index * 100).duration(400)}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify()}
    >
      <OrderCard order={item} onOtpSeen={onOtpSeen} />
    </Animated.View>
  )
);

export default function CompletedOrdersScreen() {
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

  const filteredCompletedOrders = useMemo(
    () =>
      filteredOrders
        .filter((order) => [3, 4].includes(order.status))
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
    [filteredOrders]
  );

  const hasTriggeredEndReach = useRef(false);

  useEffect(() => {
    hasTriggeredEndReach.current = false;
  }, [filteredCompletedOrders.length]);

  const handleEndReached = useCallback(() => {
    if (
      hasTriggeredEndReach.current ||
      isFetchingMoreOrders ||
      !ordersHasMore ||
      filteredCompletedOrders.length === 0
    ) {
      return;
    }

    hasTriggeredEndReach.current = true;
    loadMoreOrders();
  }, [
    filteredCompletedOrders.length,
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

  const hasData = filteredCompletedOrders.length > 0;
  const showError = error && !hasData;

  const ListHeaderComponent = useCallback(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>COMPLETED</Text>
      </View>
    );
  }, []);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <FlashList<Order>
        data={filteredCompletedOrders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        removeClippedSubviews
        estimatedItemSize={93}
        contentContainerStyle={styles.listContent}
        onRefresh={onRefresh}
        refreshing={isRefreshingOrders}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={
          isFetchingMoreOrders ? (
            <LoadingIndicator subtitle="Loading more orders..." />
          ) : null
        }
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
                title="NO COMPLETED ORDERS"
                subtitle="Your completed orders will appear here."
                illustration={require("@assets/images/errors/no_orders_yet_bg.png")}
                showButton={false}
                containerStyle={styles.errorStateContainer}
              />
            )}
          </Animated.View>
        }
        drawDistance={200}
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
    paddingTop: 0,
    paddingBottom: r_h(12),
    backgroundColor: "transparent",
  },
  headerContainer: {
    paddingHorizontal: r_w(4),
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
  errorStateContainer: {
    paddingVertical: 0,
  },
});

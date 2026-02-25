import React, {
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
  ImageBackground,
} from "react-native";
import { router, Stack } from "expo-router";
import { useBaseStore } from "@/state/base/base";
import FoodSearchBox from "@/components/food/FoodSearchBox";
import FilterModal from "@/components/food/FilterModal";
import GradientBlur from "@/components/food/GradientBlur";
import { OrdersContextType, Order } from "@/utils/food-types";
import LoadingIndicator from "@/components/LoadingIndicator";
import { useFirebaseOrderUpdates } from "@/hooks/useFirebaseOrderUpdates";
import FoodHeader from "@/components/food/FoodHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { r_w, r_h, r_t } from "@/utils/responsive";
import {
  FlashList,
  ListRenderItem,
  type ContentStyle,
} from "@shopify/flash-list";
import Animated, {
  FadeInDown,
  FadeOut,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import OrderCard from "@/components/food/OrderCard";
import FoodErrorState from "@/components/error_screens/FoodErrorState";
import { useFocusEffect } from "@react-navigation/native";

const OrdersContext = createContext<OrdersContextType | null>(null);
export const useOrdersContext = () => useContext(OrdersContext)!;

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

function OrdersProvider() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const horizontalPadding = r_w(25);
  const orders = useBaseStore((state) => state.orders);
  const isLoading = useBaseStore((state) => state.isLoadingOrders);
  const isRefreshingOrders = useBaseStore(
    (state) => state.isRefreshingOrders
  );
  const isFetchingMoreOrders = useBaseStore(
    (state) => state.isFetchingMoreOrders
  );
  const ordersHasMore = useBaseStore((state) => state.ordersHasMore);
  const ordersCurrentPage = useBaseStore(
    (state) => state.ordersCurrentPage
  );
  const error = useBaseStore((state) => state.ordersError);
  const fetchOrders = useBaseStore((state) => state.fetchOrders);
  const fetchStalls = useBaseStore((state) => state.fetchStalls);
  const markOtpAsSeen = useBaseStore((state) => state.markOtpAsSeen);

  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSearchGradient, setShowSearchGradient] = useState(false);

  const backgroundHeight = useMemo(() => {
    return screenHeight + insets.top + insets.bottom;
  }, [screenHeight, insets.top, insets.bottom]);

  const activeOrdersForListener = useMemo(
    () => orders.filter((order) => [0, 1, 2].includes(order.status)),
    [orders]
  );

  useFirebaseOrderUpdates({
    activeOrders: activeOrdersForListener,
    enabled: !isLoading,
  });

  const onRefresh = useCallback(async () => {
    // Fetch stalls first to update MMKV cache, then fetch orders
    // This ensures vendor images and colors are cached before rendering orders
    await fetchStalls();
    await fetchOrders({ page: 1, isRefresh: true, force: true });
  }, [fetchOrders, fetchStalls]);

  const loadMoreOrders = useCallback(() => {
    if (!isFetchingMoreOrders && ordersHasMore) {
      fetchOrders({ page: ordersCurrentPage + 1 });
    }
  }, [isFetchingMoreOrders, ordersHasMore, ordersCurrentPage, fetchOrders]);

  const handleOtpSeen = useCallback(
    (orderId: number, otp?: number) => {
      (markOtpAsSeen as any)(orderId, otp);
    },
    [markOtpAsSeen]
  );

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh])
  );

  const searchFilteredOrders = useMemo(() => {
    if (!search.trim()) return orders;
    const s = search.toLowerCase();
    return orders.filter(
      (o) =>
        o.vendor_name.toLowerCase().includes(s) ||
        o.id.toString().includes(s) ||
        o.items.some((item: any) => item.name.toLowerCase().includes(s))
    );
  }, [search, orders]);

  const filteredOrders = useMemo(() => {
    if (selectedFilters.length === 0) return searchFilteredOrders;

    // Check if order matches any of the selected filters
    return searchFilteredOrders.filter((order) => {
      return selectedFilters.some((filter) => {
        if (filter === "active") return [0, 1, 2].includes(order.status);
        if (filter === "completed") return [3, 4].includes(order.status);
        return false;
      });
    });
  }, [selectedFilters, searchFilteredOrders]);

  // Sort orders: active orders first (status 0,1,2), then completed orders (status 3,4)
  const sortedOrders = useMemo(() => {
    const activeOrders = filteredOrders.filter((order) =>
      [0, 1, 2].includes(order.status)
    );
    const completedOrders = filteredOrders.filter((order) =>
      [3, 4].includes(order.status)
    );

    return [
      ...activeOrders.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
      ...completedOrders.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    ];
  }, [filteredOrders]);

  // Create data with section headers
  const ordersWithHeaders = useMemo(() => {
    const activeOrders = sortedOrders.filter((order) =>
      [0, 1, 2].includes(order.status)
    );
    const completedOrders = sortedOrders.filter((order) =>
      [3, 4].includes(order.status)
    );

    const result: (Order | { type: "header"; id: string; title: string })[] =
      [];

    // If there are no orders at all, return empty array to show EmptyListComponent
    if (activeOrders.length === 0 && completedOrders.length === 0) {
      return result;
    }

    // Add active section
    if (activeOrders.length > 0) {
      result.push({ type: "header", id: "active-header", title: "ACTIVE" });
      result.push(...activeOrders);
    } else if (selectedFilters.includes("active")) {
      // Only show "NO ACTIVE ORDERS" header if active filter is applied and there are some completed orders
      result.push({
        type: "header",
        id: "no-active-header",
        title: "NO ACTIVE ORDERS",
      });
    }

    // Add completed section
    if (completedOrders.length > 0) {
      result.push({
        type: "header",
        id: "completed-header",
        title: "COMPLETED",
      });
      result.push(...completedOrders);
    }

    return result;
  }, [sortedOrders, selectedFilters]);

  const contextValue = useMemo(
    () => ({
      search,
      setSearch,
      filter: selectedFilters,
      setFilter: setSelectedFilters,
      loading: isLoading,
      isRefreshingOrders,
      isFetchingMoreOrders,
      ordersHasMore,
      onRefresh,
      loadMoreOrders,
      handleOtpSeen,
      filteredOrders: sortedOrders,
      error,
    }),
    [
      search,
      selectedFilters,
      isLoading,
      isRefreshingOrders,
      isFetchingMoreOrders,
      ordersHasMore,
      onRefresh,
      loadMoreOrders,
      handleOtpSeen,
      sortedOrders,
      error,
    ]
  );

  // IMPORTANT: All hooks must be called before any conditional returns
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

  const hasTriggeredEndReach = useRef(false);

  useEffect(() => {
    hasTriggeredEndReach.current = false;
  }, [ordersWithHeaders.length]);

  const handleEndReached = useCallback(() => {
    if (
      hasTriggeredEndReach.current ||
      isFetchingMoreOrders ||
      !ordersHasMore ||
      ordersWithHeaders.length === 0
    ) {
      return;
    }

    hasTriggeredEndReach.current = true;
    loadMoreOrders();
  }, [
    ordersWithHeaders.length,
    isFetchingMoreOrders,
    loadMoreOrders,
    ordersHasMore,
  ]);

  const renderItem: ListRenderItem<
    Order | { type: "header"; id: string; title: string }
  > = useCallback(
    ({ item, index }) => {
      if ("type" in item && item.type === "header") {
        return (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{item.title}</Text>
          </View>
        );
      }
      return (
        <AnimatedRenderItem
          item={item as Order}
          onOtpSeen={handleOtpSeen}
          index={index}
        />
      );
    },
    [handleOtpSeen]
  );

  const keyExtractor = useCallback(
    (item: Order | { type: "header"; id: string; title: string }) => {
      if ("type" in item && item.type === "header") {
        return item.id;
      }
      return (item as Order).id.toString();
    },
    []
  );

  const hasData = ordersWithHeaders.length > 0;
  const showError = error && !hasData;
  const isInitialLoading = isLoading && orders.length === 0;

  return (
    <OrdersContext.Provider value={contextValue as any}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View pointerEvents="none" style={styles.backgroundLayer}>
          <ImageBackground
            source={require("@assets/images/food/background-image.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
        <FoodHeader
          title="ORDERS"
          showBackButton
          showCartIcon
          onCartPress={() =>
            router.push({
              pathname: "/private/home/food/cart",
              params: { source: "orders" },
            })
          }
        />

        {isInitialLoading ? (
          <LoadingIndicator title="Orders" subtitle="Fetching your orders..." />
        ) : (
          <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <View
              style={[
                styles.searchContainer,
                { paddingHorizontal: horizontalPadding },
              ]}
            >
              <FoodSearchBox
                value={search}
                onChangeText={setSearch}
                placeholder="Search Orders"
                showFilter
                onFilterPress={() => setIsFilterOpen((prev) => !prev)}
                filterOpen={isFilterOpen}
              />

              {/* Gradient Blur below search bar - darker above, lighter below */}
              {showSearchGradient && (
                <GradientBlur
                  zIndex={5}
                  width={screenWidth}
                  height={r_h(45)}
                  top={r_h(55)}
                  left={0}
                  colors={["rgba(0,0,0,0.91)", "rgba(0,0,0,0)"]}
                  intensity={0}
                  blurTint="dark"
                  direction="vertical"
                />
              )}

              <FilterModal
                visible={isFilterOpen}
                onClose={() => {
                  setIsFilterOpen(false);
                  setSelectedFilters([]);
                }}
                selectedValues={selectedFilters}
                onValueChange={setSelectedFilters}
                button1Label="ACTIVE"
                button2Label="COMPLETED"
                button1Value="active"
                button2Value="completed"
              />
            </View>

            <Animated.View style={[styles.listContainer, animatedStyle]}>
              <FlashList<Order | { type: "header"; id: string; title: string }>
                data={ordersWithHeaders}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                removeClippedSubviews
                estimatedItemSize={93}
                contentContainerStyle={
                  [
                    styles.listContent,
                    { paddingHorizontal: horizontalPadding },
                  ] as ContentStyle
                }
                onScroll={(event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  setShowSearchGradient(offsetY > 5);
                }}
                scrollEventThrottle={16}
                onRefresh={onRefresh}
                refreshing={isRefreshingOrders}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
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
                        title="NO ORDERS YET"
                        subtitle="Your orders will appear here once you place them."
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
            {/* Gradient Blur above tab bar - below total card */}
            <GradientBlur
              width={r_w(393)}
              height={r_h(100)}
              bottom={r_h(0)}
              left={0}
              colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 1)"]}
              intensity={0}
              blurTint="dark"
              direction="vertical"
              borderRadius={r_w(12)}
              zIndex={1}
            />
          </View>
        )}
      </View>
    </OrdersContext.Provider>
  );
}

export default function OrdersLayout() {
  return <OrdersProvider />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  searchContainer: {
    paddingHorizontal: r_w(16),
    paddingVertical: r_h(8),
    backgroundColor: "transparent",
    alignItems: "stretch",
    marginTop: r_h(7),
    gap: r_h(8),
    width: "100%",
    zIndex: 10,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  listContent: {
    paddingTop: r_h(4),
    paddingBottom: r_h(12),
    backgroundColor: "transparent",
  },
  sectionHeader: {
    paddingVertical: r_h(12),
    paddingHorizontal: r_w(34),
    // marginBottom: 8,
    marginTop: r_h(4),
  },
  sectionHeaderText: {
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

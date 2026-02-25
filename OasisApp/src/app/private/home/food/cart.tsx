import {
  StyleSheet,
  View,
  Pressable,
  useWindowDimensions,
  Platform,
  ImageBackground,
} from "react-native";
import { Text } from "react-native";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useCartSource } from "./_layout";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

import Animated, {
  Layout,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  Keyframe,
  type SharedValue,
} from "react-native-reanimated";

import { useBaseStore } from "@/state/base/base";
import { useFastStore } from "@/state/fast/fast";
import { selectGlobalTotal } from "@/state/fast/slices/food";
import CartStallCard from "@/components/food/CartStallCard";
import FoodSearchBox from "@/components/food/FoodSearchBox";
import { useAuth } from "@/hooks/useAuthentication";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
import EmptyListComponent from "@/components/food/EmptyListComponent";
import LoadingIndicator from "@/components/LoadingIndicator";
import FoodHeader from "@/components/food/FoodHeader";
import MenuTotalCardBg from "@assets/images/food/menu-totalcard-bg.svg";
import GradientBlur from "@/components/food/GradientBlur";
import { OrderRequestVendor, CartStall, CartItem } from "@/utils/food-types";
import {
  useFoodScreenEntrance,
  useCartFeedbackAnimation,
  usePressAnimation,
} from "@/components/food/foodAnimations";
import { r_w, r_h, r_t } from "@/utils/responsive";
import FoodErrorState from "@/components/error_screens/FoodErrorState";

const TOTAL_CARD_ASPECT_RATIO = 376 / 75;

const formatPrice = (value: number) =>
  Math.round(value).toLocaleString("en-IN");

type CartStallWithMeta = CartStall & {
  location?: string | null;
  imageUrl?: string | null;
  imageBackgroundColor?: string | null;
};

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<CartStallWithMeta>
);

const PlaceOrderCard = React.memo(
  ({
    totalPrice,
    cardWidth,
    cardHeight,
    disabled,
    isLoading,
    onPress,
  }: {
    totalPrice: number;
    cardWidth: number;
    cardHeight: number;
    disabled: boolean;
    isLoading: boolean;
    onPress: () => void;
  }) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

    return (
      <Animated.View
        layout={Layout.springify()}
        style={[
          styles.totalCardWrapper,
          animatedStyle,
          { width: cardWidth, height: cardHeight },
          disabled && styles.totalCardDisabled,
        ]}
      >
        <Pressable
          style={styles.totalPressable}
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Place order"
        >
          <MenuTotalCardBg
            width={cardWidth}
            height={cardHeight}
            style={styles.totalCardBg}
          />
          <View style={styles.totalContent}>
            <View style={styles.totalAmountRow}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalValue}>₹ {formatPrice(totalPrice)}</Text>
            </View>
            <View style={styles.ctaPill}>
              {isLoading ? (
                <LoadingIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.ctaText}>Pay Now</Text>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

PlaceOrderCard.displayName = "PlaceOrderCard";

const exitingAnimation = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ scale: 1 }, { translateX: 0 }],
  },
  100: {
    opacity: 0,
    transform: [{ scale: 0.85 }, { translateX: 60 }],
  },
}).duration(260);

export default function CartScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ source?: string }>();
  const { setCartSource } = useCartSource();

  // Set the cart source when screen mounts or when source param changes
  useEffect(() => {
    setCartSource(params.source || "stalls");

    // Cleanup: reset to stalls when unmounting
    return () => {
      setCartSource(null);
    };
  }, [params.source, setCartSource]);

  const cart = useFastStore((state) => state.cart);
  const addItem = useFastStore((state) => state.addItem);
  const clearStall = useFastStore((state) => state.clearStall);
  const clearCart = useFastStore((state) => state.clearCart);
  const placeOrder = useBaseStore((state) => state.placeOrder);
  const isLoading = useBaseStore((state) => state.isCartLoading);
  const stalls = useBaseStore((state) => state.stalls);

  const totalPrice = useFastStore(
    (state) => selectGlobalTotal(state).totalPrice
  );

  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [showSearchGradient, setShowSearchGradient] = useState(false);
  const { authenticateUser } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { headerStyle, searchStyle, contentStyle } = useFoodScreenEntrance();
  const feedbackStyle = useCartFeedbackAnimation(orderStatus);
  const keyboard = useAnimatedKeyboard();
  const defaultFooterPadding = useMemo(
    () => Math.max(insets.bottom - r_h(6), 0),
    [insets.bottom]
  );
  const activeFooterPadding = useMemo(
    () => Math.max(insets.bottom, r_h(10)),
    [insets.bottom]
  );
  const iosKeyboardInset = useMemo(
    () => (Platform.OS === "ios" ? insets.bottom : 0),
    [insets.bottom]
  );
  const footerBaseBottom = useMemo(
    () => Math.max(insets.bottom + r_h(12), r_h(20)),
    [insets.bottom]
  );

  const cartStalls = useMemo(() => {
    return Object.entries(cart).map(([id, data]: [string, any]) => ({
      id,
      name: data.stallName as string,
      items: Object.values(data.items) as CartItem[],
    }));
  }, [cart]);

  const stallMetaMap = useMemo(() => {
    const map = new Map<
      string,
      {
        location?: string | null;
        imageUrl?: string | null;
        imageBackgroundColor?: string | null;
      }
    >();
    stalls.forEach((stallItem) => {
      map.set(stallItem.id.toString(), {
        location: stallItem.location,
        imageUrl: stallItem.image_url,
        imageBackgroundColor: stallItem.image_background_color,
      });
    });
    return map;
  }, [stalls]);

  const filteredCartStalls = useMemo(
    () =>
      cartStalls
        .map((stall) => {
          if (!search.trim()) {
            return stall;
          }

          const filteredItems = stall.items.filter((item: any) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );

          if (stall.name.toLowerCase().includes(search.toLowerCase())) {
            return stall;
          }

          if (filteredItems.length > 0) {
            return { ...stall, items: filteredItems };
          }

          return null;
        })
        .filter((stall): stall is CartStall => stall !== null),
    [cartStalls, search]
  );

  const enrichedCartStalls = useMemo(() => {
    return filteredCartStalls.map<CartStallWithMeta>((stall) => {
      const meta = stallMetaMap.get(stall.id);
      return {
        ...stall,
        location: meta?.location ?? null,
        imageUrl: meta?.imageUrl ?? null,
        imageBackgroundColor: meta?.imageBackgroundColor ?? null,
      };
    });
  }, [filteredCartStalls, stallMetaMap]);

  const backgroundHeight = useMemo(() => {
    return screenHeight + insets.top + insets.bottom;
  }, [screenHeight, insets.top, insets.bottom]);

  const handlePlaceOrder = useCallback(async () => {
    if (totalPrice <= 0 || isLoading) {
      return;
    }

    const isAuthenticated = await authenticateUser();
    if (!isAuthenticated) {
      return;
    }

    const orderData: OrderRequestVendor[] = Object.entries(cart).map(
      ([stallId, stallData]: [string, any]) => ({
        vendor: parseInt(stallId, 10),
        items: Object.values(stallData.items).map((item: any) => ({
          itemclass_id: parseInt(item.id, 10),
          quantity: item.quantity,
        })),
      })
    );

    const res = await placeOrder(orderData);

    if (res.success) {
      setOrderStatus("success");
      clearCart();
      showSnackbar({
        message: "Order placed successfully!",
        type: "success",
      });
      setTimeout(() => setOrderStatus("idle"), 1000);
      router.push("/private/home/food/orders");
    } else {
      setOrderStatus("error");
      showSnackbar({
        message: res.errorMessage || "Failed to place order.",
        type: "error",
      });
      setTimeout(() => setOrderStatus("idle"), 1000);
    }
  }, [authenticateUser, cart, isLoading, placeOrder, showSnackbar, totalPrice]);

  const handleItemQuantityChange = useCallback((stallInfo: any, item: any, newQuantity: number) => {
    addItem(stallInfo.id, stallInfo.name, {
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      isVeg: item.is_veg ?? item.isVeg,
      quantity: newQuantity,
    });
  }, [addItem]);

  const renderCartStall = useCallback(
    ({ item: stall }: { item: CartStallWithMeta }) => (
      <Animated.View
        layout={Layout.springify()}
        exiting={exitingAnimation}
        style={styles.cartItemWrapper}
      >
        <CartStallCard
          stall={stall as any}
          onItemQuantityChange={handleItemQuantityChange}
          onRemoveStall={() => {
            clearStall(stall.id);
          }}
        />
      </Animated.View>
    ),
    [handleItemQuantityChange, clearStall]
  );

  const keyExtractor = useCallback((stall: CartStallWithMeta) => stall.id, []);

  const footerKeyboardStyle = useAnimatedStyle(() => {
    const keyboardHeight = keyboard.height.value;
    const isKeyboardVisible = keyboardHeight > 0;

    if (isKeyboardVisible) {
      const keyboardOffset = Math.max(0, keyboardHeight - iosKeyboardInset);
      return {
        bottom: footerBaseBottom + keyboardOffset,
        paddingBottom: activeFooterPadding,
      };
    }

    // When keyboard is not visible, match stalls screen positioning
    return {
      bottom: 10,
      paddingBottom: 0,
    };
  }, [footerBaseBottom, activeFooterPadding, iosKeyboardInset]);

  const horizontalPadding = r_w(25);
  const gridPaddingHorizontal = horizontalPadding;

  const totalCardWidth = useMemo(() => {
    const cardPaddingHorizontal = r_w(16);
    const availableWidth = screenWidth - cardPaddingHorizontal * 2;
    return Math.min(availableWidth, screenWidth * 0.95);
  }, [screenWidth]);

  const totalCardHeight = useMemo(() => {
    if (totalCardWidth <= 0) {
      return 0;
    }
    return totalCardWidth / TOTAL_CARD_ASPECT_RATIO;
  }, [totalCardWidth]);

  const listBottomPadding = useMemo(() => {
    return totalCardHeight + footerBaseBottom + 56;
  }, [totalCardHeight, footerBaseBottom]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View pointerEvents="none" style={styles.backgroundLayer}>
        <ImageBackground
          source={require("@assets/images/food/background-image.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <Animated.View style={headerStyle}>
        <FoodHeader
          title="CART"
          showBackButton
          onBackPress={() => {
            // Navigate back to the source screen
            const source = params.source || "stalls";
            if (source === "orders") {
              router.push("/private/home/food/orders");
            } else {
              router.push("/private/home/food/stalls");
            }
          }}
          showCartIcon
          onCartPress={() =>
            router.push({
              pathname: "/private/home/food/cart",
              params: { source: params.source || "stalls" },
            })
          }
        />
      </Animated.View>

      <View style={styles.innerContainer}>
        <Animated.View style={[styles.searchContainer, searchStyle]}>
          <View style={{ paddingHorizontal: horizontalPadding }}>
            <FoodSearchBox
              value={search}
              onChangeText={setSearch}
              placeholder="Search Cart"
              width={"100%"}
            />
          </View>

          {/* Gradient Blur below search bar - darker above, lighter below */}
          {/* {showSearchGradient && (
            <GradientBlur
              width={screenWidth}
              height={r_h(40)}
              top={r_h(50)}
              left={0}
              colors={["rgba(0,0,0,0.91)", "rgba(0,0,0,0)"]}
              intensity={0}
              blurTint="dark"
              direction="vertical"
              zIndex={5}
            />
          )} */}
        </Animated.View>

        {cartStalls.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <FoodErrorState
              title="CART IS EMPTY"
              subtitle="Add items from stalls to see them here!"
              illustration={require("@assets/images/errors/cart_is_empty_bg.png")}
              showButton={false}
              containerStyle={styles.errorStateContainer}
            />
          </View>
        ) : (
          <>
            <Animated.View style={[styles.listWrapper, contentStyle]}>
              <AnimatedFlashList
                data={enrichedCartStalls}
                renderItem={renderCartStall}
                keyExtractor={keyExtractor}
                estimatedItemSize={260}
                showsVerticalScrollIndicator={false}
                onScroll={(event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  setShowSearchGradient(offsetY > 5);
                }}
                scrollEventThrottle={16}
                contentContainerStyle={[
                  styles.listContainer,
                  {
                    paddingHorizontal: horizontalPadding,
                    paddingBottom: listBottomPadding,
                  },
                ]}
                ListFooterComponent={
                  <View style={[styles.listfooter, { height: r_h(70) }]}></View>
                }
                ListEmptyComponent={
                  <EmptyListComponent
                    title="No items found"
                    message="Try adjusting your search."
                  />
                }
              />
            </Animated.View>

            {totalCardWidth > 0 && (
              <Animated.View
                style={[
                  styles.footerContainer,
                  feedbackStyle,
                  footerKeyboardStyle,
                ]}
              >
                <PlaceOrderCard
                  totalPrice={totalPrice}
                  cardWidth={totalCardWidth}
                  cardHeight={totalCardHeight}
                  disabled={isLoading || totalPrice <= 0}
                  isLoading={isLoading}
                  onPress={handlePlaceOrder}
                />
              </Animated.View>
            )}
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
          </>
        )}
      </View>

      {orderStatus === "success" && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 1000, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }]} pointerEvents="none">
           <LottieView
             source={require("@assets/rives/Green_tick.json")}
             autoPlay
             loop={false}
             style={{ width: 150, height: 150 }}
           />
        </View>
      )}
      {orderStatus === "error" && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 1000, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }]} pointerEvents="none">
           <LottieView
             source={require("@assets/rives/Sad_Failed.json")}
             autoPlay
             loop={false}
             style={{ width: 150, height: 150 }}
           />
        </View>
      )}
    </View>
  );
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
  innerContainer: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: r_h(8),
    marginTop: r_h(16),
    alignItems: "stretch",
    width: "100%",
    zIndex: 10,
  },
  listWrapper: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: r_w(16),
    paddingTop: r_h(6),
    alignItems: "center",
  },
  cartItemWrapper: {
    overflow: "hidden",
    width: "100%",
    alignItems: "center",
  },
  footerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  totalCardWrapper: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  totalCardDisabled: {
    opacity: 0.7,
  },
  totalPressable: {
    width: "100%",
    height: "100%",
  },
  totalCardBg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  totalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: r_w(24),
    height: "100%",
  },
  totalAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: r_w(6),
  },
  totalLabel: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(18),
    color: "white",
    fontWeight: "400",
    letterSpacing: 1.2,
  },
  totalValue: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(18),
    color: "white",
    fontWeight: "400",
    letterSpacing: 1.2,
  },
  ctaPill: {
    position: "relative",
    paddingVertical: r_h(8),
    paddingHorizontal: r_w(20),
  },
  ctaText: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(18),
    color: "#FFF",
    fontWeight: "400",
    textAlign: "right",
    textShadowColor: "rgba(255, 237, 211, 0.40)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: r_w(9.6),
  },
  //jugaad, 'not recommended'
  listfooter: {
    width: "100%",
    // borderWidth: 4,
    // borderColor: 'white',
    marginTop: r_h(15),
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: r_w(24),
  },
  errorStateContainer: {
    paddingVertical: 0,
  },
});

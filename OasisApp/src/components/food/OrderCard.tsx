import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image as RNImage,
  StyleProp,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Layout,
  FadeIn,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Order } from "@/utils/food-types";
import { seeOtp } from "@/api/food.api";
import { useSnackbar } from "@/providers/SnackbarProvider";
import LoadingIndicator from "@/components/LoadingIndicator";
import { SPRING_CONFIGS } from "@/components/food/foodAnimations";
import { getCachedVendorData } from "@/utils/vendorCache";

// Status icons
import OrderCardStatusReady from "@assets/images/food/ordercard-status-ready.svg";
import OrderCardStatusPending from "@assets/images/food/ordercard-status-pending.svg";
import OrderCardStatusCompleted from "@assets/images/food/ordercard-status-completed.svg";
import OrderCardStatusPreparing from "@assets/images/food/ordercard-status-preparing.svg";
import OrderCardStatusCancelled from "@assets/images/food/ordercard-status-canelled.svg";
import OrderButtonPattern from "@assets/images/food/button-pattern.svg";
import VegIcon from "@assets/images/food/menucard-veg-icon.svg";
import NonVegIcon from "@assets/images/food/menucard-nonveg-icon.svg";
import CartCardBottomLayerBg from "@assets/images/food/cartcard-3rdlayer-bg.svg";

const OrderCardBtnBg = require("@assets/images/food/ordercard-btn-bg.png");
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { r_w, r_h, r_t } from "@/utils/responsive";

const BASE_CARD_WIDTH = 343;
const CARD_HEIGHT = 144;
const LOGO_WIDTH = 144;
const BORDER_COLOR = "rgba(255,255,255,0.75)";

interface OrderCardProps {
  order: Order;
  onOtpSeen: (orderId: number, otp?: number) => void;
}

const getStatusIcon = (status: number) => {
  switch (status) {
    case 0:
      return OrderCardStatusPending;
    case 1:
      return OrderCardStatusPreparing;
    case 2:
      return OrderCardStatusReady;
    case 3:
      return OrderCardStatusCompleted;
    case 4:
      return OrderCardStatusCancelled;
    default:
      return null;
  }
};

// ---------- STATUS BADGE ----------
const StatusBadge = React.memo(
  ({ status, isNew }: { status: number; isNew: boolean }) => {
    const scale = useSharedValue(isNew ? 0 : 1);

    useEffect(() => {
      if (isNew) {
        scale.value = withSpring(1, SPRING_CONFIGS.bouncy);
      } else {
        scale.value = withSequence(
          withSpring(1.08, { damping: 12, stiffness: 280 }),
          withSpring(1, { damping: 12, stiffness: 220 })
        );
      }
    }, [isNew, status]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const StatusIcon = getStatusIcon(status);
    if (!StatusIcon) return null;

    return (
      <Animated.View style={[styles.statusIconWrapper, animatedStyle]}>
        <StatusIcon width={r_w(74)} height={r_h(20)} />
      </Animated.View>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

// ---------- ITEMS LIST ----------
const ItemsList = React.memo(
  ({ items, isExpanded }: { items: any[]; isExpanded: boolean }) => {
    if (!Array.isArray(items) || items.length === 0)
      return <Text style={styles.itemName}>No items found</Text>;

    const itemsToShow =
      items.length === 1 ? items : isExpanded ? items : items.slice(0, 3);

    return (
      <View style={styles.itemsContainer}>
        {itemsToShow.map((item, index) => (
          <Animated.View
            key={`${item.id}-${index}`}
            entering={FadeIn.delay(index * 50).duration(200)}
            layout={Layout.springify()}
            style={styles.itemRow}
          >
            <View style={styles.itemLeft}>
              <View style={styles.vegIconWrapper}>
                {item.is_veg ? (
                  <VegIcon width={r_w(15)} height={r_h(15)} />
                ) : (
                  <NonVegIcon width={r_w(15)} height={r_h(15)} />
                )}
              </View>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemPrice}>₹{item.unit_price}</Text>
              <Text style={styles.itemQuantity}>×{item.quantity}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    );
  }
);
ItemsList.displayName = "ItemsList";

// ---------- BUTTONS ----------
const OrderCardButton: React.FC<{
  text: string;
  onPress: () => void;
  disabled?: boolean;
  faded?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}> = React.memo(
  ({
    text,
    onPress,
    disabled = false,
    faded = false,
    isLoading = false,
    style,
  }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.buttonBase,
        faded ? styles.buttonFadedBackground : styles.buttonActiveBackground,
        style,
        pressed && !disabled && !isLoading && styles.buttonPressed,
      ]}
    >
      <RNImage
        source={OrderCardBtnBg}
        style={styles.buttonBgPattern}
        resizeMode="cover"
      />
      <OrderButtonPattern
        width="120%"
        height="120%"
        pointerEvents="none"
        preserveAspectRatio="xMidYMid slice"
        style={[styles.buttonPattern, faded && styles.buttonPatternFaded]}
      />
      {isLoading ? (
        <LoadingIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={[styles.btnText, faded && styles.btnTextFaded]}>
          {text}
        </Text>
      )}
    </Pressable>
  )
);
OrderCardButton.displayName = "OrderCardButton";

const OtpDisplay: React.FC<{
  otp?: string | number;
  style?: StyleProp<ViewStyle>;
  faded?: boolean;
}> = React.memo(({ otp, style, faded = false }) => (
  <View
    style={[
      styles.buttonBase,
      faded ? styles.buttonFadedBackground : styles.buttonActiveBackground,
      style,
    ]}
  >
    <RNImage
      source={OrderCardBtnBg}
      style={styles.buttonBgPattern}
      resizeMode="cover"
    />
    <OrderButtonPattern
      width="120%"
      height="120%"
      pointerEvents="none"
      preserveAspectRatio="xMidYMid slice"
      style={[styles.buttonPattern, faded && styles.buttonPatternFaded]}
    />
    <Text style={[styles.otpText, faded && styles.btnTextFaded]}>
      {otp || "------"}
    </Text>
  </View>
));
OtpDisplay.displayName = "OtpDisplay";

// ---------- MAIN CARD ----------
const OrderCard: React.FC<OrderCardProps> = ({ order, onOtpSeen }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [lastStatus, setLastStatus] = useState(order.status);

  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();

  const widthScale = screenWidth / 393;
  const heightScale = screenHeight / 852;

  // Get vendor data from MMKV cache for instant access
  const vendorData = useMemo(() => {
    const cached = getCachedVendorData(order.vendor_name);
    return {
      imageUrl: cached?.imageUrl || order.vendor_image || "",
      backgroundColor:
        cached?.backgroundColor || order.vendor_image_background_color || null,
    };
  }, [
    order.vendor_name,
    order.vendor_image,
    order.vendor_image_background_color,
  ]);

  useEffect(() => {
    if (order.status !== lastStatus) {
      setLastStatus(order.status);
      cardScale.value = withSequence(
        withSpring(1.02, { damping: 15, stiffness: 200 }),
        withSpring(1, SPRING_CONFIGS.gentle)
      );
      cardOpacity.value = withSequence(
        withTiming(0.85, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [order.status]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const handleGetOtp = useCallback(async () => {
    if (order.otp_seen) {
      showSnackbar({
        message: "You have already seen this OTP.",
        type: "error",
      });
      return;
    }

    if (order.status === 0) {
      showSnackbar({
        message:
          "Please wait for your order to be accepted before getting OTP.",
        type: "error",
      });
      return;
    }

    setIsLoadingOtp(true);
    try {
      const res = await seeOtp(order.id);
      if (res.success) {
        showSnackbar({
          message: res.data.detail || res.data.detial,
          type: "success",
        });
        const otpMatch = (res.data.detail || res.data.detial || "").match(
          /(\d{4})/
        );
        const otpFromResponse = otpMatch ? parseInt(otpMatch[1]) : order.otp;
        onOtpSeen(order.id, otpFromResponse);
      } else {
        showSnackbar({
          message: res.errorMessage || "An error occurred",
          type: "error",
        });
      }
    } finally {
      setIsLoadingOtp(false);
    }
  }, [order, showSnackbar, onOtpSeen]);

  const subtotal = useMemo(() => {
    if (order.items?.length) {
      return order.items.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );
    }
    return order.price;
  }, [order.items, order.price]);

  const showOtp = order.otp_seen && order.status !== 4;
  const showGetOtpButton = !order.otp_seen && order.status !== 4;

  // Fade logic based on status
  // Status 0 (Pending), 1 (Preparing): fade GET OTP button
  // Status 2 (Ready): NO FADE - show GET OTP and OTP clearly
  // Status 3 (Completed): fade OTP (order is done)
  // Status 4 (Cancelled): fade both GET OTP and OTP
  const shouldFadeGetOtp =
    order.status === 0 || order.status === 1 || order.status === 4;
  const shouldFadeOtp = order.status === 3 || order.status === 4;

  return (
    <Animated.View
      layout={Layout.springify().damping(20)}
      style={[styles.cardContainer, cardAnimatedStyle]}
    >
      <View style={styles.cardInner}>
        <View
          style={[
            styles.logoBox,
            vendorData.backgroundColor && {
              backgroundColor: vendorData.backgroundColor,
            },
          ]}
        >
          {vendorData.imageUrl && !imageError ? (
            <Image
              source={{ uri: vendorData.imageUrl }}
              style={styles.logoImage}
              contentFit="contain"
              transition={200}
              cachePolicy="memory-disk"
              recyclingKey={order.vendor_name}
              onError={() => {
                console.warn(
                  `Failed to load image for vendor: ${order.vendor_name}`
                );
                setImageError(true);
              }}
              priority="high"
            />
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>
                {order.vendor_name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <StatusBadge
            status={order.status}
            isNew={order.status !== lastStatus}
          />
          <Text style={styles.stallName} numberOfLines={2}>
            {order.vendor_name}
          </Text>
          <Text style={styles.orderId}>Order #{order.id}</Text>

          <View style={styles.buttonContainer}>
            {showOtp ? (
              <OtpDisplay
                otp={order.otp}
                faded={shouldFadeOtp}
                style={styles.buttonLeft}
              />
            ) : showGetOtpButton ? (
              <OrderCardButton
                text="GET OTP"
                onPress={handleGetOtp}
                isLoading={isLoadingOtp}
                faded={shouldFadeGetOtp}
                style={styles.buttonLeft}
              />
            ) : (
              <View
                style={[
                  styles.buttonBase,
                  styles.buttonFadedBackground,
                  styles.buttonLeft,
                ]}
              >
                <RNImage
                  source={OrderCardBtnBg}
                  style={styles.buttonBgPattern}
                  resizeMode="cover"
                />
                <OrderButtonPattern
                  width="120%"
                  height="120%"
                  pointerEvents="none"
                  preserveAspectRatio="xMidYMid slice"
                  style={[styles.buttonPattern, styles.buttonPatternFaded]}
                />
              </View>
            )}
            <OrderCardButton
              text={isExpanded ? "VIEW LESS" : "VIEW MORE"}
              onPress={toggleExpand}
              style={styles.buttonRight}
            />
          </View>
        </View>
      </View>

      {isExpanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={styles.expandedContainer}
        >
          <View style={styles.middleLayer}>
            <View style={styles.middleInner}>
              <ItemsList items={order.items || []} isExpanded={isExpanded} />
            </View>
          </View>

          <View
            style={[
              styles.bottomLayer,
              { height: r_h(46), marginHorizontal: r_w(-4) },
            ]}
          >
            <CartCardBottomLayerBg
              width={r_w(BASE_CARD_WIDTH)}
              height={r_h(46)}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.bottomContent}>
              <Text style={styles.subtotalLabel}>SUBTOTAL</Text>
              <Text style={styles.subtotalValue}>₹ {subtotal}</Text>
            </View>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

// Memoize the component to prevent unnecessary re-renders
const arePropsEqual = (prev: OrderCardProps, next: OrderCardProps) => {
  return (
    prev.order.id === next.order.id &&
    prev.order.status === next.order.status &&
    prev.order.otp_seen === next.order.otp_seen &&
    prev.order.otp === next.order.otp &&
    prev.order.items?.length === next.order.items?.length &&
    prev.order.vendor_name === next.order.vendor_name &&
    prev.onOtpSeen === next.onOtpSeen
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: r_h(12),
    alignSelf: "center",
    borderRadius: r_w(10),
  },
  cardInner: {
    width: r_w(BASE_CARD_WIDTH),
    height: r_h(CARD_HEIGHT),
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    overflow: "hidden",
  },
  logoBox: {
    width: r_w(LOGO_WIDTH),
    height: r_h(CARD_HEIGHT),
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 0,
    borderRightColor: BORDER_COLOR,
  },
  logoImage: {
    width: r_w(LOGO_WIDTH),
    height: r_h(CARD_HEIGHT),
  },
  placeholderBox: {
    width: r_w(108),
    height: r_h(108),
    backgroundColor: "#333",
    borderRadius: r_w(8),
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#FFF",
    fontFamily: "The Last Shuriken",
    fontSize: r_t(32),
    fontWeight: "bold",
  },
  infoBox: {
    width: r_w(BASE_CARD_WIDTH - LOGO_WIDTH),
    padding: r_w(12),
    backgroundColor: "#000",
  },
  statusIconWrapper: { marginBottom: r_h(8) },
  stallName: {
    color: "#FFF",
    fontFamily: "Proza Libre",
    fontSize: r_t(15),
    fontWeight: "500",
  },
  orderId: {
    color: "#C6C6C6",
    fontFamily: "Proza Libre",
    fontSize: r_t(12),
    marginTop: r_h(3),
    letterSpacing: 0.5,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: "auto",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderColor: BORDER_COLOR,
    height: r_h(41),
  },
  buttonBase: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRightWidth: 1,
    borderColor: BORDER_COLOR,
  },
  buttonLeft: {
    borderRightWidth: 1,
  },
  buttonRight: {
    borderRightWidth: 0,
  },
  buttonActiveBackground: {
    backgroundColor: "#9F0700",
  },
  buttonFadedBackground: {
    backgroundColor: "#190000",
  },
  buttonBgPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
  buttonPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.32,
  },
  buttonPatternFaded: {
    opacity: 0.16,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  btnText: {
    color: "#FFFFFF",
    fontFamily: "The Last Shuriken",
    fontSize: r_t(12),
    letterSpacing: 0.6,
  },
  btnTextFaded: {
    color: "#D1C0C0",
  },
  otpText: {
    color: "#E5E5E5",
    fontFamily: "The Last Shuriken",
    fontSize: r_t(13),
    letterSpacing: 1.2,
  },
  expandedContainer: { width: r_w(BASE_CARD_WIDTH) },
  middleLayer: {
    width: r_w(BASE_CARD_WIDTH),
    backgroundColor: "rgba(0,0,0,0.94)",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderTopWidth: 0,
  },
  middleInner: {
    paddingHorizontal: r_w(18),
    // paddingVertical: r_h(14),
    paddingTop: r_h(7),
  },
  itemsContainer: { marginBottom: r_h(8) },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: r_w(8),
  },
  vegIconWrapper: {
    width: r_w(15),
    height: r_h(15),
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: r_w(8),
  },
  itemName: {
    width: r_w(150),
    flexShrink: 0,
    color: "#FFF",
    fontFamily: "Quattrocento Sans",
    fontSize: r_t(17),
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: r_h(18),
    letterSpacing: 0.09,
    textShadowColor: "rgba(255, 255, 255, 0.25)",
    textShadowOffset: { width: 0.25, height: 0 },
    textShadowRadius: 0,
  },
  itemRight: { flexDirection: "row", alignItems: "center" },
  itemPrice: {
    width: r_w(53),
    // height: r_h(16),
    flexShrink: 0,
    color: "#FFF",
    fontFamily: "Quattrocento Sans",
    fontSize: r_t(18),
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: r_h(18),
    letterSpacing: 0.108,
    textShadowColor: "rgba(255, 255, 255, 0.25)",
    textShadowOffset: { width: 0.25, height: 0 },
    textShadowRadius: 0,
  },
  itemQuantity: {
    color: "#C6C6C6",
    fontFamily: "Proza Libre",
    fontSize: r_t(14),
    marginLeft: 0,
  },
  bottomLayer: {
    justifyContent: "center",
    overflow: "hidden",
    marginLeft: 0,
    marginTop: r_h(-1),
  },
  bottomContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: r_w(24),
    // paddingVertical: r_h(12),
  },
  subtotalLabel: {
    fontFamily: "The Last Shuriken",
    color: "#FFF",
    fontSize: r_t(18),
    letterSpacing: 1.2,
  },
  subtotalValue: {
    fontFamily: "The Last Shuriken",
    color: "#FFF",
    fontSize: r_t(18),
    letterSpacing: 1.2,
  },
});

export default React.memo(OrderCard, arePropsEqual);

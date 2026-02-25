import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  Layout,
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import CartItemCard from "@/components/food/CartItemCard";
import {
  CartMenuItem,
  StallInfo,
  CartStall as BaseCartStall,
} from "@/utils/food-types";

import CartCardTopLayerBg from "@assets/images/food/cartcard-toplayer-bg.svg";
import CartCardBottomLayerBg from "@assets/images/food/cartcard-3rdlayer-bg.svg";
import CloseIcon from "@assets/images/food/cartcard-cross-icon.svg";
import LocationIcon from "@assets/images/food/menuhero-location-icon.svg";

import { SPRING_CONFIGS } from "@/components/food/foodAnimations";
import { LinearGradient } from "expo-linear-gradient"; 
import { r_w, r_h, r_t } from "@/utils/responsive";

const BASE_CARD_WIDTH = 343;
const BASE_IMAGE_WIDTH = 140;
const BASE_TOP_HEIGHT = 95;
const BASE_BOTTOM_HEIGHT = 48;

type CartStallWithMeta = BaseCartStall & {
  location?: string | null;
  imageUrl?: string | null;
  imageBackgroundColor?: string | null;
};

interface CartStallCardProps {
  stall: CartStallWithMeta;
  onItemQuantityChange: (
    stallInfo: StallInfo,
    item: CartMenuItem,
    newQuantity: number
  ) => void;
  onRemoveStall: (stallId: string) => void;
}

const FALLBACK_IMAGE = "https://via.placeholder.com/300x180";

const formatPrice = (value: number) =>
  Math.round(value).toLocaleString("en-IN");

const CartStallCard: React.FC<CartStallCardProps> = ({
  stall,
  onItemQuantityChange,
  onRemoveStall,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const cardWidth = Math.min(r_w(BASE_CARD_WIDTH), screenWidth - r_w(24));
  const scale = cardWidth / r_w(BASE_CARD_WIDTH);
  const imageWidth = r_w(BASE_IMAGE_WIDTH) * scale;
  const topHeight = r_h(BASE_TOP_HEIGHT) * scale;
  const bottomHeight = r_h(BASE_BOTTOM_HEIGHT) * scale;

  // --- Shared animation values ---
  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);

  // Animate subtle pop-in when stall items change
  useEffect(() => {
    cardScale.value = withSequence(
      withSpring(1.02, SPRING_CONFIGS.snappy),
      withSpring(1, SPRING_CONFIGS.gentle)
    );
    cardOpacity.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withTiming(1, { duration: 120 })
    );
  }, [stall.items.length]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const stallSubtotal = useMemo(() => {
    return stall.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [stall.items]);

  const stallInfo = useMemo(
    () => ({ id: stall.id, name: stall.name }),
    [stall.id, stall.name]
  );

  // Get background color from stall data, fallback to white
  const imageBackgroundColor = useMemo(() => {
    const bgColor = stall.imageBackgroundColor;
    if (bgColor && bgColor.trim() && bgColor.toLowerCase() !== "none") {
      return bgColor.trim();
    }
    return "#FFFFFF";
  }, [stall.imageBackgroundColor]);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemoveStall = useCallback(() => {
    setIsDeleting(true);
    cardScale.value = withSequence(
      withSpring(0.95, SPRING_CONFIGS.snappy),
      withSpring(1, SPRING_CONFIGS.gentle)
    );
    setTimeout(() => {
      onRemoveStall(stall.id);
    }, 1500); // Allow time for lottie animation
  }, [onRemoveStall, stall.id]);

  return (
    <Animated.View
      entering={FadeIn.springify()}
      exiting={FadeOut.springify()}
      layout={Layout.springify().damping(20)}
      style={[styles.cardWrapper, { width: cardWidth }, cardAnimatedStyle]}
    >
      {isDeleting && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16 }]}>
          <LottieView
            source={require("@assets/rives/Delete_message.json")}
            autoPlay
            loop={false}
            style={{ width: "80%", height: "80%" }}
          />
        </View>
      )}
      {/* --- Gradient border background --- */}
      <LinearGradient
        colors={["#FF8A00", "#FF2A6D"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradientBorder}
      />

      <View style={styles.innerContainer}>
        {/* --- Top Section --- */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.imageWrapper,
              {
                width: imageWidth,
                height: topHeight,
                backgroundColor: imageBackgroundColor,
              },
            ]}
          >
            <Image
              source={{
                uri:
                  stall.imageUrl && stall.imageUrl.toLowerCase() !== "none"
                    ? stall.imageUrl
                    : FALLBACK_IMAGE,
              }}
              style={styles.stallImage}
              resizeMode="contain"
            />
          </View>

          <View
            style={[
              styles.topInfoWrapper,
              { width: cardWidth - imageWidth, height: topHeight },
            ]}
          >
            <CartCardTopLayerBg
              width={cardWidth - imageWidth + 2}
              height={topHeight + 2}
              style={[StyleSheet.absoluteFillObject, { top: -1, left: -1 }]}
              preserveAspectRatio="none"
            />

            <Pressable
              onPress={handleRemoveStall}
              hitSlop={12}
              style={styles.closeButton}
            >
              <CloseIcon width={20 * scale} height={20 * scale} />
            </Pressable>

            <View style={styles.topInfoContent}>
              <Text
                style={[styles.stallName, { fontSize: 16 * scale }]}
                numberOfLines={2}
              >
                {stall.name}
              </Text>

              {(stall.location || "").trim().length > 0 && (
                <View style={styles.locationRow}>
                  <LocationIcon width={14 * scale} height={14 * scale} />
                  <Text
                    style={[styles.locationText, { fontSize: 15 * scale }]}
                    numberOfLines={1}
                  >
                    {stall.location}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* --- Middle Section --- */}
        <Animated.View
          entering={FadeIn.duration(200)}
          layout={Layout.springify()}
          style={[
            styles.middleLayer,
            { paddingHorizontal: 18 * scale, paddingTop: 10 * scale },
          ]}
        >
          {stall.items.map((item, index) => (
            <CartItemCard
              key={item.id}
              item={item}
              scale={scale}
              isLast={index === stall.items.length - 1}
              onQuantityChange={(newQuantity) =>
                onItemQuantityChange(stallInfo, item, newQuantity)
              }
            />
          ))}
        </Animated.View>

        {/* --- Bottom Layer --- */}
        <View
          style={[
            styles.bottomLayer,
            { height: bottomHeight, marginHorizontal: 0 },
          ]}
        >
          <CartCardBottomLayerBg
            width={cardWidth + 2}
            height={bottomHeight}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.bottomContent}>
            <Text style={[styles.subtotalLabel, { fontSize: 18 * scale }]}>
              SUBTOTAL
            </Text>
            <Text style={[styles.subtotalValue, { fontSize: 18 * scale }]}>
              ₹ {formatPrice(stallSubtotal)}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: r_h(12),
    overflow: "hidden",
    position: "relative",
    borderBottomLeftRadius: r_w(10),
    borderBottomRightRadius: r_w(10),
  },
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(255,255,255,0.75)",
  },
  topRow: {
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
  },
  imageWrapper: {
    overflow: "hidden",
    // backgroundColor is applied inline with dynamic color
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.75)",
  },
  stallImage: { width: "100%", height: "100%" },
  topInfoWrapper: {
    position: "relative",
    justifyContent: "center",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: r_h(26),
    right: r_w(16),
    zIndex: 2,
  },
  topInfoContent: {
    justifyContent: "center",
    paddingHorizontal: r_w(16),
  },
  stallName: {
    color: "#FFF",
    fontFamily: "Proza Libre",
    width: r_w(150),
    fontSize: 16,
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: r_h(6),
    gap: r_w(6),
  },
  locationText: {
    color: "#EBEBEB",
    fontFamily: "Quattrocento Sans",
    fontWeight: "700",
  },
  middleLayer: {
    backgroundColor: "rgba(0,0,0,0.94)",
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.75)",
  },
  bottomLayer: {
    justifyContent: "center",
    overflow: "hidden",
    marginVertical: r_h(-1),
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: r_w(24),
  },
  subtotalLabel: {
    fontFamily: "The Last Shuriken",
    color: "#FFF",
    letterSpacing: 1.2,
  },
  subtotalValue: {
    fontFamily: "The Last Shuriken",
    color: "#FFF",
    letterSpacing: 1.2,
  },
});

export default React.memo(CartStallCard);

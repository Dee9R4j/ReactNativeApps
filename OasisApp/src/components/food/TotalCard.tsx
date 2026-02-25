import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { usePressAnimation } from "@/components/food/foodAnimations";
import MenuTotalCardBg from "@assets/images/food/menu-totalcard-bg.svg";
import { r_w, r_h, r_t } from "@/utils/responsive";

const formatPrice = (value: number) =>
  Math.round(value).toLocaleString("en-IN");

interface TotalCardProps {
  totalPrice: number;
  cardWidth: number;
  cardHeight: number;
  buttonText?: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  sparkleProgress?: any;
}

const TotalCard = React.memo(
  ({
    totalPrice,
    cardWidth,
    cardHeight,
    buttonText = "VIEW CART",
    onPress,
    disabled = false,
  }: TotalCardProps) => {
    const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

    const handlePress = () => {
      if (onPress) {
        onPress();
      } else {
        router.push({
          pathname: "/private/home/food/cart" as any,
          params: { source: "stalls" },
        });
      }
    };

    return (
      <Animated.View
        entering={FadeInDown.duration(400).springify()}
        style={[
          styles.totalCardWrapper,
          animatedStyle,
          { width: cardWidth, height: cardHeight },
          disabled && styles.totalCardDisabled,
        ]}
      >
        <Pressable
          style={{ width: "100%", height: "100%" }}
          onPress={handlePress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
        >
          <MenuTotalCardBg
            width={cardWidth}
            height={cardHeight}
            style={styles.totalCardBg}
          />
          <View style={styles.totalContent}>
            <View style={styles.totalAmountRow}>
              <Text style={styles.totalLabel}>TOTAL: </Text>
              <Text style={styles.totalValue}>₹ {formatPrice(totalPrice)}</Text>
            </View>
            <View style={styles.viewCartPill}>
              <Text style={styles.viewCartText}>{buttonText}</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  totalCardWrapper: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  totalCardDisabled: {
    opacity: 0.6,
  },
  totalCardBg: {
    position: "absolute",
  },
  totalContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: r_w(20),
    height: "100%",
  },
  totalAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: r_w(4),
    paddingLeft: r_w(9),
  },
  totalLabel: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(18),
    color: "#FFF",
    fontWeight: "400",
  },
  totalValue: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(18),
    color: "#FFF",
    fontWeight: "400",
  },
  viewCartPill: {
    paddingVertical: r_h(8),
    paddingHorizontal: r_w(18),
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  viewCartText: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(18),
    color: "#FFF",
    fontWeight: "400",
    textAlign: "right",
    textShadowColor: "rgba(255, 237, 211, 0.40)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: r_w(9.6),
  },
});

export default TotalCard;

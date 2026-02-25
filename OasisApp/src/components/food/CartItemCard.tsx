import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { Layout } from "react-native-reanimated";

import VegIcon from "@assets/images/food/menucard-veg-icon.svg";
import NonVegIcon from "@assets/images/food/menucard-nonveg-icon.svg";
import PlusIcon from "@assets/images/food/menucard-plus-icon.svg";
import MinusIcon from "@assets/images/food/menucard-minus-icon.svg";

import { CartItem } from "@/utils/food-types";
import { r_w, r_h, r_t } from "@/utils/responsive";

interface CartItemCardProps {
  item: CartItem;
  scale: number;
  isLast?: boolean;
  onQuantityChange: (newQuantity: number) => void;
}

const BASE_NAME_WIDTH = 203;

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  scale,
  isLast = false,
  onQuantityChange,
}) => {
  const nameWidth = Math.max(r_w(148), r_w(BASE_NAME_WIDTH) * scale);
  const verticalSpacing = Math.max(r_h(8), r_h(12) * scale);

  const handleIncrease = useCallback(() => {
    onQuantityChange(item.quantity + 1);
  }, [item.quantity, onQuantityChange]);

  const handleDecrease = useCallback(() => {
    onQuantityChange(item.quantity - 1);
  }, [item.quantity, onQuantityChange]);

  return (
    <Animated.View
      layout={Layout.springify().damping(20)}
      style={[
        styles.container,
        {
          paddingBottom: verticalSpacing,
          marginBottom: isLast ? 0 : verticalSpacing,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          {item.is_veg ? (
            <VegIcon width={15} height={15} />
          ) : (
            <NonVegIcon width={15} height={15} />
          )}
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text
            style={styles.itemPrice}
            accessibilityLabel={`Price ₹${Math.round(item.price)}`}
          >
            ₹ {Math.round(item.price)}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.controlsWrapper}>
          <Pressable
            onPress={handleDecrease}
            accessibilityLabel={`Decrease quantity of ${item.name}`}
            accessibilityRole="button"
          >
            <MinusIcon width={27 } height={27} />
          </Pressable>

          <Text
            style={[styles.quantityText, { fontSize: 20 * scale }]}
            accessibilityLabel={`Quantity ${item.quantity}`}
          >
            {item.quantity}
          </Text>

          <Pressable
            onPress={handleIncrease}
            accessibilityLabel={`Increase quantity of ${item.name}`}
            accessibilityRole="button"
          >
            <PlusIcon width={27} height={27} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    // borderBottomColor: "rgba(255,255,255,0.22)",
    // height: r_h(58),
    // paddingBottom: r_
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flexShrink: 1,
  },
  textWrapper: {
    flexShrink: 1,
  },
  iconWrapper: {
    width: 15,
    height: 15,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    width: r_w(150),
    flexShrink: 0,
    color: "#FFF",
    fontFamily: "Quattrocento Sans",
    fontSize: 17,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: r_h(18),
    letterSpacing: 0.09,
    textShadowColor: "rgba(255, 255, 255, 0.25)",
    textShadowOffset: { width: 0.25, height: 0 },
    textShadowRadius: 0,
    paddingBottom: r_h(10),
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: r_h(12),
    gap: r_w(16),
  },
  itemPrice: {
    // width: 53,
    height: 16,
    flexShrink: 0,
    color: "#FFF",
    fontFamily: "Quattrocento Sans",
    fontSize: 19,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: 0.108,
    textShadowColor: "rgba(255, 255, 255, 0.25)",
    textShadowOffset: { width: 0.25, height: 0 },
    textShadowRadius: 0,
  },
  controlsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: r_w(12),
  },
  quantityText: {
    fontFamily: "The Last Shuriken",
    color: "#FFFFFF",
    letterSpacing: 1.2,
    textAlign: "center",
    minWidth: r_w(32),
  },
});

export default React.memo(CartItemCard);

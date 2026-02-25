import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { CartItem, MenuItem } from "@/utils/food-types";
import { useFastStore } from "@/state/fast/fast";
import { useBaseStore } from "@/state/base/base";
import LoadingIndicator from "@/components/LoadingIndicator";
import { r_w, r_h, r_t } from "@/utils/responsive";

import ActiveCardBg from "@assets/images/food/menucard-active-bg.svg";
import InactiveTitleBg from "@assets/images/food/menucard-inactive-title-bg.svg";
import InactiveAddBg from "@assets/images/food/menucard-inactive-add-bg.svg";
import VegIcon from "@assets/images/food/menucard-veg-icon.svg";
import NonVegIcon from "@assets/images/food/menucard-nonveg-icon.svg";
import PlusIcon from "@assets/images/food/menucard-plus-icon.svg";
import MinusIcon from "@assets/images/food/menucard-minus-icon.svg";

interface MenuItemCardProps {
  item: MenuItem;
  stallId: string;
  onQuantityChange: (newQuantity: number) => void;
}

const BASE_CARD_WIDTH = 344;
const BASE_CARD_HEIGHT = 81;
const BASE_INACTIVE_ADD_WIDTH = 96;
const BASE_ACTIVE_CARD_WIDTH = 342.852;
const INACTIVE_ADD_RATIO = BASE_INACTIVE_ADD_WIDTH / BASE_CARD_WIDTH;
const ACTIVE_WIDTH_RATIO = BASE_ACTIVE_CARD_WIDTH / BASE_CARD_WIDTH;

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  stallId,
  onQuantityChange,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const CARD_WIDTH = r_w(BASE_CARD_WIDTH);
  const CARD_HEIGHT = r_h(BASE_CARD_HEIGHT);
  const cardWidth = Math.min(CARD_WIDTH, screenWidth - r_w(32));
  const inactiveAddWidth = cardWidth * INACTIVE_ADD_RATIO;
  const inactiveTitleWidth = cardWidth - inactiveAddWidth;
  const activeWidth = cardWidth * ACTIVE_WIDTH_RATIO;
  const actionWidth = Math.max(r_w(96), Math.min(r_w(118), cardWidth * 0.3));

  const quantity = useFastStore(
    useCallback(
      (state) => state.cart[stallId]?.items[item.id.toString()]?.quantity || 0,
      [stallId, item.id]
    )
  );
  
  const isCartLoading = false; // FastStore is synchronous
  const isLoading = useBaseStore((state) => state.isLoadingMenu);

  const isProcessing = isCartLoading || isLoading;

  const handleAdd = useCallback(() => {
    if (!isProcessing && item.is_available) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onQuantityChange(1);
    }
  }, [isProcessing, item.is_available, onQuantityChange]);

  const handleIncrease = useCallback(() => {
    if (!isProcessing) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onQuantityChange(quantity + 1);
    }
  }, [isProcessing, onQuantityChange, quantity]);

  const handleDecrease = useCallback(() => {
    if (!isProcessing) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onQuantityChange(quantity - 1);
    }
  }, [isProcessing, onQuantityChange, quantity]);

  const isActive = quantity > 0;

  return (
    <View
      style={[styles.cardWrapper, { width: cardWidth, height: CARD_HEIGHT }]}
    >
      {/* Background Layers */}
      <View pointerEvents="none" style={styles.backgroundLayer}>
        {isActive ? (
          <ActiveCardBg
            width={activeWidth}
            height={CARD_HEIGHT}
            style={[styles.activeBg, { left: (cardWidth - activeWidth) / 2 }]}
          />
        ) : (
          <>
            <InactiveTitleBg
              width={inactiveTitleWidth}
              height={CARD_HEIGHT}
              style={styles.inactiveTitleBg}
            />
            <InactiveAddBg
              width={inactiveAddWidth}
              height={CARD_HEIGHT}
              style={styles.inactiveAddBg}
            />
          </>
        )}
      </View>

      {/* Main Flexbox Content */}
      <View
        style={[styles.contentRow, { width: cardWidth, height: CARD_HEIGHT }]}
      >
        {/* LEFT SECTION */}
        <View style={styles.infoSection}>
          <View style={styles.vegIconWrapper}>
            {item.is_veg ? (
              <VegIcon width={18} height={18} />
            ) : (
              <NonVegIcon width={18} height={18} />
            )}
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.itemPrice}>₹ {item.price}</Text>
          </View>
        </View>

        {/* RIGHT SECTION */}
        <View style={[styles.actionSection, { width: actionWidth }]}>
          {!item.is_available ? (
            <Text style={styles.notAvailable}>NOT AVAILABLE</Text>
          ) : isProcessing && quantity > 0 ? (
            <LoadingIndicator size="small" color="#FFE6CE" />
          ) : quantity === 0 ? (
            <Pressable
              style={styles.addButtonHitbox}
              onPress={handleAdd}
              disabled={isProcessing}
            >
              <Text style={styles.addButtonLabel}>ADD</Text>
            </Pressable>
          ) : (
            <View style={styles.quantityPill}>
              <Pressable
                onPress={handleDecrease}
                style={styles.quantityButton}
                disabled={isProcessing}
              >
                <MinusIcon width={27} height={27} />
              </Pressable>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Pressable
                onPress={handleIncrease}
                style={styles.quantityButton}
                disabled={isProcessing}
              >
                <PlusIcon width={27} height={27} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    position: "relative",
    justifyContent: "center",
    marginLeft: r_w(6),
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBg: { position: "absolute" },
  inactiveTitleBg: { position: "absolute", left: 0 },
  inactiveAddBg: { position: "absolute", right: 0 },

  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: r_w(20),
  },

  // Left section (veg icon + text)
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexShrink: 1,
    flex: 1,
  },
  vegIconWrapper: {
    marginRight: r_w(10),
    marginTop: r_h(4),
    marginLeft: -6,
  },
  textBlock: {
    flexShrink: 1,
  },
  itemName: {
    fontFamily: "Quattrocento Sans",
    fontSize: r_t(18),
    color: "#FFF",
    letterSpacing: 1,
    flexWrap: "wrap",
    lineHeight: r_t(22),
  },
  itemPrice: {
    fontFamily: "Quattrocento Sans",
    fontSize: r_t(18),
    color: "#FFF",
    fontWeight: "700",
    marginTop: r_h(4),
  },

  // Right section (add / quantity)
  actionSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  notAvailable: {
    fontFamily: "Cantora One",
    fontSize: r_t(9),
    letterSpacing: 1,
    color: "#F3C7B5",
    paddingLeft: r_w(25),
    position: "relative",
    left: r_w(25),
  },
  addButtonHitbox: {
    height: r_h(40),
    width: r_w(88),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    left: r_w(30),
  },
  addButtonLabel: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(22),
    color: "#fff",
    letterSpacing: 2,
  },
  quantityPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: r_w(6),
    paddingVertical: r_h(5),
    gap: r_w(8),
    position: "relative",
    top: 0,
  },
  quantityButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: r_w(4),
  },
  quantityText: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(22),
    color: "#fff",
    letterSpacing: 1.5,
    minWidth: r_w(28),
    textAlign: "center",
    marginVertical: -5,
  },
});

export default React.memo(MenuItemCard, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.is_available === nextProps.item.is_available &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.stallId === nextProps.stallId
  );
});

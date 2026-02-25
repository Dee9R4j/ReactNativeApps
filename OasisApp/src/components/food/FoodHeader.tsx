import React, { useMemo, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AnimatedBackIcon from "@components/AnimatedBackIcon";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";

// Import SVG components
import CartIconSvg from "@assets/images/food/cart-icon.svg";
import CartIconClosedSvg from "@assets/images/food/cart-icon-closed.svg";
import { useFastStore } from "@/state/fast/fast";
import { selectCartItemCount } from "@/state/fast/slices/food";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FoodHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showCartIcon?: boolean;
  onCartPress?: () => void;
  rightComponent?: React.ReactNode;
}

const FoodHeader: React.FC<FoodHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  showCartIcon = false,
  onCartPress,
  rightComponent,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const topInset = Math.max(insets.top, 12);
  const widthScale = screenWidth / 393;
  const horizontalPadding = 25 * widthScale;

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const cartItemCount = useFastStore((state) => selectCartItemCount(state));

  // Trigger animation when cart count changes
  useEffect(() => {
    if (cartItemCount > 0) {
      // Cancel any ongoing animations to allow restart
      cancelAnimation(scale);
      cancelAnimation(rotation);

      // Reset to base values immediately
      scale.value = 1;
      rotation.value = 0;

      // Start new animation sequence
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );
      rotation.value = withSequence(
        withTiming(-3, { duration: 50 }),
        withTiming(3, { duration: 50 }),
        withTiming(-3, { duration: 40 }),
        withTiming(3, { duration: 40 }),
        withTiming(2, { duration: 50 })
      );
    }
  }, [cartItemCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { paddingTop: topInset, paddingHorizontal: horizontalPadding },
        ]}
      >
        {showBackButton ? (
          <AnimatedBackIcon
            onPress={onBackPress || (() => router.back())}
            style={styles.backButton}
          />
        ) : (
          <View style={styles.backButton} />
        )}

        <Text style={styles.title}>{title}</Text>

        <View style={styles.right}>
          {showCartIcon && onCartPress ? (
            <TouchableOpacity
              onPress={onCartPress}
              style={styles.cartButton}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="View cart"
            >
              <Animated.View style={animatedStyle}>
                {cartItemCount > 0 ? (
                  <CartIconSvg width={33} height={34} fill="#FFF" />
                ) : (
                  <CartIconClosedSvg width={33} height={34} fill="#FFF" />
                )}
              </Animated.View>
              {cartItemCount > 0 && (
                <View style={styles.cartBadge} pointerEvents="none">
                  <Text style={styles.cartBadgeText}>
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            rightComponent
          )}
        </View>
      </View>

      <View
        style={[
          styles.dividerContainer,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        <View style={styles.divider} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-end", // align bottom edges
    justifyContent: "space-between",
    paddingBottom: 6, // small bottom padding for breathing room
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40, // match right section width to center title perfectly
    height: 40,
    justifyContent: "flex-end", // align bottom of icon
    alignItems: "flex-start",
    paddingBottom: 2, // align icon baseline
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "400",
    color: "#FFF",
    fontFamily: "The Last Shuriken",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    letterSpacing: 2.24,
    lineHeight: 30, // slightly reduced to align better
    marginBottom: 2,
    paddingRight: 3, // nudges text to align visually with icons
  },
  right: {
    width: 46, // increased to accommodate larger icon
    height: 46,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  cartButton: {
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: 3,
    right: 9.5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#FFF",
    fontFamily: "Cantora One",
    fontSize: 15,
    lineHeight: 18,
    textAlign: "center",
    // paddingRight: 3,
    fontWeight: 900,
  },
  dividerContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "#FFF",
  },
});

export default FoodHeader;

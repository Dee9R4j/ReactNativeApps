/**
 * Custom Animated Tab Bar
 * Sliding indicator, ordered tabs, hidden routes
 */
import { CartIcon, FoodIcon, ShowsIcon, StallsIcon, WalletIcon } from "@/components/icons";
import { r_h, r_t, r_w } from "@/utils/responsive";
import React, { useEffect } from "react";
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TAB_BAR_HEIGHT = 94;
export const TAB_HORIZONTAL_PADDING = r_w(16);
const ACTIVE_BOX_WIDTH = 66;
const ACTIVE_BOX_HEIGHT = 55;
const ACTIVE_BOX_RADIUS = 8.5;

type TabBarProps = { state: any; descriptors: Record<string, any>; navigation: any };

const getTabIcon = (name: string, color: string, size: number = 24) => {
  switch (name) {
    case "food/index": return <StallsIcon size={size} color={color} />;
    case "food/cart": return <CartIcon size={size} color={color} />;
    case "food/orders": return <FoodIcon size={size} color={color} />;
    case "shows/shows": return <ShowsIcon size={size} color={color} />;
    case "wallet/wallet": return <WalletIcon size={size} color={color} />;
    default: return <StallsIcon size={size} color={color} />;
  }
};

const TAB_LABELS: Record<string, string> = { "food/index": "Stalls", "food/cart": "Cart", "food/orders": "Orders", "shows/shows": "Shows", "wallet/wallet": "Wallet" };
const TAB_ORDER = ["food/index", "food/cart", "food/orders", "shows/shows", "wallet/wallet"];
const HIDDEN_ROUTES = new Set(["food/stalls/[id]"]);

export const FoodTabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const visibleRoutes = React.useMemo(() => state.routes.filter((route: { name: string }) => !HIDDEN_ROUTES.has(route.name)), [state.routes]);

  const orderedRoutes = React.useMemo(() => {
    const prioritized = TAB_ORDER.map((name) => visibleRoutes.find((route: { name: string }) => route.name === name)).filter(Boolean) as typeof visibleRoutes;
    const extras = visibleRoutes.filter((route: { name: string }) => !TAB_ORDER.includes(route.name));
    return [...prioritized, ...extras];
  }, [visibleRoutes]);

  const activeRoute = state.routes[state.index];
  const activeRouteKey = activeRoute?.key;

  const visualActiveName = React.useMemo(() => {
    const visibleActiveRoute = orderedRoutes.find((route: { key: string }) => route.key === activeRouteKey);
    if (visibleActiveRoute) return visibleActiveRoute.name;
    return activeRoute?.name?.startsWith("food/stalls/") ? "food/index" : "food/index";
  }, [orderedRoutes, activeRouteKey, activeRoute]);

  const activeTabIndex = React.useMemo(() => {
    const index = orderedRoutes.findIndex((route: { name: string }) => route.name === visualActiveName);
    return index >= 0 ? index : 0;
  }, [orderedRoutes, visualActiveName]);

  const containerWidth = useSharedValue(0);
  const tabIndexSV = useSharedValue(0);
  useEffect(() => { tabIndexSV.value = activeTabIndex; }, [activeTabIndex]);
  const tabCount = orderedRoutes.length || 1;
  const indicatorWidth = r_w(ACTIVE_BOX_WIDTH);

  const targetX = useDerivedValue(() => {
    if (containerWidth.value === 0) return TAB_HORIZONTAL_PADDING;
    const totalContentWidth = containerWidth.value - TAB_HORIZONTAL_PADDING * 2;
    const singleTabWidth = totalContentWidth / tabCount;
    const centerOfTargetTab = TAB_HORIZONTAL_PADDING + singleTabWidth * tabIndexSV.value + singleTabWidth / 2;
    return centerOfTargetTab - indicatorWidth / 2;
  }, [tabCount, indicatorWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: containerWidth.value > 0 ? 1 : 0,
    transform: [{ translateX: withSpring(targetX.value, { damping: 18, stiffness: 180, mass: 0.6 }) }],
  }));

  const handleLayout = React.useCallback((e: LayoutChangeEvent) => { containerWidth.value = e.nativeEvent.layout.width; }, []);

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBarBackground} />
      <Animated.View pointerEvents="none" style={[styles.activeIndicatorBox, indicatorStyle, { width: indicatorWidth }]} />
      <View style={styles.tabBarContent} onLayout={handleLayout}>
        {orderedRoutes.map((route: { key: string; name: string }) => {
          const isActualActive = state.routes[state.index]?.key === route.key;
          const { options } = descriptors[route.key];
          const label = TAB_LABELS[route.name] ?? route.name;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isActualActive && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity key={route.key} accessibilityRole="button" accessibilityState={isActualActive ? { selected: true } : {}} accessibilityLabel={options.tabBarAccessibilityLabel} onPress={onPress} style={styles.tabButton} activeOpacity={0.7}>
              {getTabIcon(route.name, "#F5F5F5", r_w(24))}
              <Text style={styles.tabLabel}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: { height: r_h(TAB_BAR_HEIGHT), justifyContent: "flex-start", alignItems: "center", position: "relative", overflow: "visible", width: "100%" },
  tabBarBackground: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#0C0021" },
  activeIndicatorBox: { position: "absolute", top: r_h(13), left: 0, height: r_h(ACTIVE_BOX_HEIGHT), backgroundColor: "#060377", borderRadius: r_w(ACTIVE_BOX_RADIUS), zIndex: 1 },
  tabBarContent: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-evenly", width: "100%", paddingHorizontal: TAB_HORIZONTAL_PADDING, paddingTop: r_h(22), zIndex: 2 },
  tabButton: { flex: 1, alignItems: "center", justifyContent: "center", gap: r_h(4) },
  tabLabel: { fontSize: r_t(12), fontWeight: "500", color: "#F5F5F5", textAlign: "center" },
});

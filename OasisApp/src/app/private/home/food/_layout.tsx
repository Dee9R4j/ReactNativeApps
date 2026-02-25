import React, { createContext, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  LayoutChangeEvent,
  Image,
  ImageBackground,
} from "react-native";
import { Tabs } from "expo-router";
import { getStatusBarHeight } from "@/utils/safeArea";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { r_w, r_h, r_t } from "@/utils/responsive";
import GradientBlur from "@/components/food/GradientBlur";
import { useSecureStore } from "@/state/secure/secure";
import { useKeyboardVisibility } from "@/hooks/useKeyboardVisibility";

// Context for tracking cart source
type CartSourceContextType = {
  cartSource: string | null;
  setCartSource: (source: string | null) => void;
};

const CartSourceContext = createContext<CartSourceContextType>({
  cartSource: null,
  setCartSource: () => {},
});

export const useCartSource = () => useContext(CartSourceContext);

const STATUS_BAR_HEIGHT = getStatusBarHeight();
const HIDDEN_ROUTES = new Set(["cart", "stalls/[id]"]);
const TAB_LABELS: Record<string, string> = {
  stalls: "STALLS",
  orders: "ORDERS",
  split: "SPLIT",
  cart: "CART",
};
const TAB_ORDER_BITSIAN = ["split", "stalls", "orders"];
const TAB_ORDER_NON_BITSIAN = ["cart", "stalls", "orders"];
const BASE_TAB_BAR_HEIGHT = 75;
const BASE_TAB_HORIZONTAL_PADDING = r_w(16);
const HOUSE_ASPECT_RATIO = 153 / 101;

type TabBarProps = {
  state: any;
  descriptors: Record<string, any>;
  navigation: any;
  width: number;
  tabContainerWidth: number;
  onTabLayout: (event: LayoutChangeEvent) => void;
  houseTranslateX: SharedValue<number>;
  hasMeasured: React.MutableRefObject<boolean>;
  cartSource: string | null;
  tabBarHeight: number;
  tabHorizontalPadding: number;
  isBitsian: boolean;
};

const FoodTabBar: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
  width,
  tabContainerWidth,
  onTabLayout,
  houseTranslateX,
  hasMeasured,
  cartSource,
  tabBarHeight,
  tabHorizontalPadding,
  isBitsian,
}) => {
  // Determine which tab order to use based on bitsian status
  const TAB_ORDER = isBitsian ? TAB_ORDER_BITSIAN : TAB_ORDER_NON_BITSIAN;

  // Update hidden routes based on bitsian status
  const hiddenRoutes = React.useMemo(() => {
    const routes = new Set(["stalls/[id]"]);
    if (isBitsian) {
      routes.add("cart"); // Hide cart for Bitsians, show split
    } else {
      routes.add("split"); // Hide split for non-Bitsians, show cart
    }
    return routes;
  }, [isBitsian]);

  const HIDDEN_ROUTE_MAPPING = React.useMemo(() => {
    const defaultMapping: Record<string, string> = {
      "stalls/[id]": "stalls",
      cart: isBitsian ? "stalls" : "stalls", // For Bitsians, cart is hidden
      split: isBitsian ? "stalls" : "stalls", // For non-Bitsians, split is hidden
    };

    if (cartSource === "orders") {
      return {
        ...defaultMapping,
        cart: "orders",
      };
    }
    return defaultMapping;
  }, [cartSource, isBitsian]);
  const visibleRoutes = React.useMemo(
    () =>
      state.routes.filter(
        (route: { name: string }) => !hiddenRoutes.has(route.name)
      ),
    [state.routes, hiddenRoutes]
  );

  const orderedRoutes = React.useMemo(() => {
    const prioritized = TAB_ORDER.map((name) =>
      visibleRoutes.find((route: { name: string }) => route.name === name)
    ).filter(Boolean) as typeof visibleRoutes;
    const extras = visibleRoutes.filter(
      (route: { name: string }) => !TAB_ORDER.includes(route.name)
    );
    return [...prioritized, ...extras];
  }, [visibleRoutes]);

  const tabCount = orderedRoutes.length || 1;

  const tabWidth = React.useMemo(() => {
    if (!tabContainerWidth) {
      return 0;
    }

    return (tabContainerWidth - tabHorizontalPadding * 2) / tabCount;
  }, [tabContainerWidth, tabCount, tabHorizontalPadding]);

  const overlayWidth = React.useMemo(() => {
    if (!tabWidth) {
      return tabBarHeight * HOUSE_ASPECT_RATIO;
    }

    return tabWidth * 1.2;
  }, [tabWidth, tabBarHeight]);

  const overlayHeight = overlayWidth / HOUSE_ASPECT_RATIO;
  const overlayTop =
    (tabBarHeight - overlayHeight) / 2 - (overlayHeight - tabBarHeight) * 0.35;
  const activeRoute = state.routes[state.index];
  const activeRouteKey = activeRoute?.key;

  const visibleActiveRoute = React.useMemo(
    () =>
      orderedRoutes.find(
        (route: { key: string }) => route.key === activeRouteKey
      ),
    [orderedRoutes, activeRouteKey]
  );

  const visualActiveName = React.useMemo(() => {
    if (visibleActiveRoute) {
      return visibleActiveRoute.name;
    }

    if (!activeRoute) {
      return "stalls";
    }

    return (
      HIDDEN_ROUTE_MAPPING[activeRoute.name] ||
      (activeRoute.name?.startsWith("stalls/") ? "stalls" : "stalls")
    );
  }, [visibleActiveRoute, activeRoute, HIDDEN_ROUTE_MAPPING]);

  const activeTabIndex = React.useMemo(() => {
    const index = orderedRoutes.findIndex(
      (route: { name: string }) => route.name === visualActiveName
    );

    return index >= 0 ? index : 0;
  }, [orderedRoutes, visualActiveName]);

  const baseLeft = React.useMemo(() => {
    if (!tabWidth) {
      return tabHorizontalPadding;
    }

    return tabHorizontalPadding + tabWidth / 2 - overlayWidth / 2;
  }, [tabWidth, overlayWidth, tabHorizontalPadding]);

  const targetTranslate = React.useMemo(() => {
    if (!tabWidth) {
      return baseLeft;
    }

    return baseLeft + activeTabIndex * tabWidth;
  }, [baseLeft, activeTabIndex, tabWidth]);

  React.useEffect(() => {
    if (!tabWidth) {
      return;
    }

    if (!hasMeasured.current) {
      houseTranslateX.value = targetTranslate;
      hasMeasured.current = true;
      return;
    }

    houseTranslateX.value = withSpring(targetTranslate, {
      damping: 18,
      stiffness: 180,
      mass: 0.6,
    });
  }, [tabWidth, targetTranslate, houseTranslateX, hasMeasured]);

  const houseOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: houseTranslateX.value }],
  }));

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBarBackgroundContainer}>
        <Image
          source={require("@assets/images/food/tabbar-background.png")}
          style={styles.tabBarBackground}
          resizeMode="stretch"
        />
      </View>

      {/* Gradient Blur above tab bar - darker below, lighter above */}
      {/* <GradientBlur
        width={width - 10}
        height={r_h(100)}
        bottom={r_h(BASE_TAB_BAR_HEIGHT)}
        left={0}
        colors={["rgba(0,0,0,0)", "rgba(0, 0, 0, 1)"]}
        intensity={0}
        blurTint="dark"
        direction="vertical"
        borderRadius={r_w(12)}
        zIndex={1}
      /> */}

      {overlayWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.houseOverlay,
            houseOverlayStyle,
            {
              width: overlayWidth,
              height: overlayHeight,
              top: overlayTop,
            },
          ]}
        >
          <Image
            source={require("@assets/images/food/house.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </Animated.View>
      )}

      <View style={styles.tabBarContent} onLayout={onTabLayout}>
        {orderedRoutes.map((route: { key: string; name: string }) => {
          const isActualActive = state.routes[state.index]?.key === route.key;
          const isVisualActive = route.name === visualActiveName;
          const { options } = descriptors[route.key];
          const descriptorLabel = (options.tabBarLabel ??
            options.title ??
            route.name) as string;
          const label = TAB_LABELS[route.name] ?? descriptorLabel;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isActualActive && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isActualActive ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isVisualActive
                    ? styles.tabLabelActive
                    : styles.tabLabelInactive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const isKeyboardVisible = useKeyboardVisibility();
  const [tabContainerWidth, setTabContainerWidth] = React.useState(0);
  const [cartSource, setCartSource] = useState<string | null>(null);

  // Get bitsian status from auth store
  const isBitsian = useSecureStore((state) => state.isbitsian);

  const TAB_BAR_HEIGHT = r_h(BASE_TAB_BAR_HEIGHT);
  const TAB_HORIZONTAL_PADDING = BASE_TAB_HORIZONTAL_PADDING;
  const houseTranslateX = useSharedValue(TAB_HORIZONTAL_PADDING);
  const hasMeasured = React.useRef(false);
  const backgroundHeight = height + STATUS_BAR_HEIGHT + TAB_BAR_HEIGHT;

  const handleTabLayout = React.useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const nextWidth = nativeEvent.layout.width;
      if (Math.abs(nextWidth - tabContainerWidth) > 0.5) {
        setTabContainerWidth(nextWidth);
      }
    },
    [tabContainerWidth]
  );

  return (
    <CartSourceContext.Provider value={{ cartSource, setCartSource }}>
      <View style={styles.safeArea}>
        <ImageBackground
          source={require("@assets/images/food/background-image.png")}
          style={styles.background}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Tabs
            initialRouteName="stalls"
            backBehavior="initialRoute"
            screenOptions={{
              headerShown: false,
              sceneStyle: styles.sceneContainer,
              lazy: true,
            }}
            tabBar={(props) =>
              isKeyboardVisible ? null : (
                <FoodTabBar
                  {...props}
                  width={width}
                  tabContainerWidth={tabContainerWidth}
                  onTabLayout={handleTabLayout}
                  houseTranslateX={houseTranslateX}
                  hasMeasured={hasMeasured}
                  cartSource={cartSource}
                  tabBarHeight={TAB_BAR_HEIGHT}
                  tabHorizontalPadding={TAB_HORIZONTAL_PADDING}
                  isBitsian={isBitsian}
                />
              )
            }
          >
            <Tabs.Screen
              name="stalls"
              options={{
                title: "Stalls",
              }}
            />
            {isBitsian ? (
              <Tabs.Screen
                name="split"
                options={{
                  title: "Split",
                }}
              />
            ) : (
              <Tabs.Screen
                name="cart"
                options={{
                  title: "Cart",
                }}
              />
            )}
            <Tabs.Screen
              name="orders"
              options={{
                title: "Orders",
                lazy: true,
              }}
            />
            {isBitsian ? (
              <Tabs.Screen
                name="cart"
                options={{
                  href: null,
                }}
              />
            ) : (
              <Tabs.Screen
                name="split"
                options={{
                  href: null,
                }}
              />
            )}
            <Tabs.Screen
              name="stalls/[id]"
              options={{
                href: null,
              }}
            />
          </Tabs>
        </View>
      </View>
    </CartSourceContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    // paddingTop: STATUS_BAR_HEIGHT,
  },
  sceneContainer: {
    backgroundColor: "transparent",
  },
  tabBarWrapper: {
    marginTop: 0,
    height: r_h(BASE_TAB_BAR_HEIGHT),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "visible",
    width: "100%",
  },
  tabBarBackgroundContainer: {
    position: "absolute",
    top: 0,
    left: r_w(-2),
    right: r_w(-2),
    bottom: r_h(-2),
    zIndex: 0,
    overflow: "hidden",
    margin: 0,
  },
  tabBarBackground: {
    width: "100%",
    height: "100%",
  },
  houseOverlay: {
    position: "absolute",
    zIndex: 2,
    left: 0,
  },
  tabBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: BASE_TAB_HORIZONTAL_PADDING,
    zIndex: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: r_h(18),
    alignItems: "center",
  },
  tabLabel: {
    fontFamily: "The Last Shuriken",
    fontSize: r_t(20),
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: -0.23,
    position: "relative",
    top: r_h(7),
  },
  tabLabelActive: {
    color: "black",
  },
  tabLabelInactive: {
    color: "#C5C5C5",
  },
});

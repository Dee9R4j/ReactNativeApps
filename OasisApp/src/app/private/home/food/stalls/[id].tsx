import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import Animated, {
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import type { ContentStyle } from "@shopify/flash-list";
import {
  usePressAnimation,
  useHeroParallax,
  useFoodScreenEntrance,
} from "@/components/food/foodAnimations";

import MenuItemCard from "@/components/food/MenuItemCard";
import FoodSearchBox from "@/components/food/FoodSearchBox";
import FilterModal from "@/components/food/FilterModal";
import LoadingIndicator from "@/components/LoadingIndicator";
import EmptyListComponent from "@/components/food/EmptyListComponent";
import FoodHeader from "@/components/food/FoodHeader";
import { useBaseStore } from "@/state/base/base";
import { useFastStore } from "@/state/fast/fast";
import { selectGlobalTotal } from "@/state/fast/slices/food";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
import { MenuItem } from "@/utils/food-types";
import { r_w, r_h, r_t } from "@/utils/responsive";
import { getCachedVendorData } from "@/utils/vendorCache";
import FoodErrorState from "@/components/error_screens/FoodErrorState";

import MenuHeroBg from "@assets/images/food/menu-hero.svg";
import TotalCard from "@/components/food/TotalCard";
import GradientBlur from "@/components/food/GradientBlur";
import LocationIcon from "@assets/images/food/menuhero-location-icon.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BASE_HERO_WIDTH = 353;
const BASE_HERO_HEIGHT = 175;
const BASE_HERO_IMAGE_HEIGHT = 84;
const BASE_CARD_LIST_GAP = 12;
const TOTAL_CARD_ASPECT_RATIO = 376 / 75;

const formatPrice = (value: number) =>
  Math.round(value).toLocaleString("en-IN");

export default function StallMenuScreen() {
  const { id, name, location, imageUrl, imageBackgroundColor } =
    useLocalSearchParams<{
      id: string;
      name: string;
      location: string;
      imageUrl: string;
      imageBackgroundColor?: string;
    }>();
  // const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const widthScale = screenWidth / 393;
  const heightScale = screenHeight / 852;

  const menuItems = useBaseStore((state) => state.menu);
  const isLoading = useBaseStore((state) => state.isLoadingMenu);
  const error = useBaseStore((state) => state.menuError);
  const fetchMenu = useBaseStore((state) => state.fetchMenu);
  const addItem = useFastStore((state) => state.addItem);
  const stalls = useBaseStore((state) => state.stalls);

  const { showSnackbar } = useSnackbar();

  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSearchGradient, setShowSearchGradient] = useState(false);

  const stallInfo = useMemo(() => ({ id: id!, name: name! }), [id, name]);

  // Get background color from database
  const heroBackgroundColor = useMemo(() => {
    // First try from URL params
    if (
      imageBackgroundColor &&
      imageBackgroundColor.trim() &&
      imageBackgroundColor.toLowerCase() !== "none"
    ) {
      return imageBackgroundColor.trim();
    }

    // Then try from stalls database
    const stallId = id ? parseInt(id, 10) : NaN;
    if (!Number.isNaN(stallId)) {
      const stall = stalls.find((s) => s.id === stallId);

      // Check image_background_color field (fallback to tags for backward compatibility)
      const dbColor = stall?.image_background_color || (stall as any)?.tags;

      if (
        dbColor &&
        typeof dbColor === "string" &&
        dbColor.trim() &&
        dbColor.toLowerCase() !== "none"
      ) {
        return dbColor.trim();
      }
    }

    // Default fallback
    return "#FFFFFF";
  }, [imageBackgroundColor, id, stalls]);

  // Enhanced hero parallax with smoother animations
  const {
    scrollHandler: parallaxScrollHandler,
    heroImageStyle,
    heroOpacityStyle,
    heroTextStyle,
  } = useHeroParallax();

  // Combined scroll handler for parallax and gradient
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Call the parallax scroll handler
      if (
        parallaxScrollHandler &&
        typeof parallaxScrollHandler === "object" &&
        "onScroll" in parallaxScrollHandler
      ) {
        (parallaxScrollHandler as any).onScroll(event);
      }
      // Update gradient visibility on UI thread
      runOnJS(setShowSearchGradient)(event.contentOffset.y > 5);
    },
  });

  // Entrance animations for screen
  const { headerStyle: entranceHeaderStyle, contentStyle } =
    useFoodScreenEntrance();

  useEffect(() => {
    if (id) {
      fetchMenu(parseInt(id, 10));
    }
  }, [id, fetchMenu]);

  useEffect(() => {
    if (error) {
      showSnackbar({
        message: "Network error, please try again",
        type: "error",
      });
    }
  }, [error, showSnackbar]);

  const totalPrice = useFastStore(
    (state) => selectGlobalTotal(state).totalPrice
  );

  const backgroundHeight = useMemo(() => {
    return screenHeight + insets.top + insets.bottom;
  }, [screenHeight, insets.bottom, insets.top]);

  const HERO_WIDTH = r_w(BASE_HERO_WIDTH);
  const HERO_HEIGHT = r_h(BASE_HERO_HEIGHT);
  const HERO_IMAGE_HEIGHT = r_h(BASE_HERO_IMAGE_HEIGHT);
  const CARD_LIST_GAP = r_h(BASE_CARD_LIST_GAP);

  const totalCardWidth = useMemo(() => {
    const gridPaddingHorizontal = r_w(16);
    const availableWidth = screenWidth - gridPaddingHorizontal * 2;
    return Math.min(availableWidth, screenWidth * 0.95);
  }, [screenWidth]);

  const totalCardHeight = useMemo(() => {
    if (totalCardWidth === 0) {
      return 0;
    }

    return totalCardWidth / TOTAL_CARD_ASPECT_RATIO;
  }, [totalCardWidth]);

  const listBottomPadding = useMemo(() => {
    return totalCardHeight + r_h(10) + r_h(64);
  }, [totalCardHeight]);

  const totalCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      bottom: 10,
    };
  }, []);

  const onRefresh = useCallback(() => {
    if (id) {
      fetchMenu(parseInt(id, 10));
    }
  }, [id, fetchMenu]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      // Don't show unavailable items
      if (!item.is_available) {
        return false;
      }

      const matchesSearch = item.name.toLowerCase().includes(query);

      // If no filters selected, show all items
      if (selectedFilters.length === 0) {
        return matchesSearch;
      }

      // Check if item matches any of the selected filters
      const matchesFilter = selectedFilters.some((filter) => {
        if (filter === "Veg") return item.is_veg;
        if (filter === "Non_Veg") return !item.is_veg;
        return false;
      });

      return matchesSearch && matchesFilter;
    });
  }, [menuItems, search, selectedFilters]);

  const hasAvailableMenuItems = useMemo(() => {
    return menuItems.some((item) => item.is_available);
  }, [menuItems]);

  const handleQuantityChange = useCallback(
    (item: MenuItem, newQuantity: number) => {
      addItem(stallInfo.id, stallInfo.name, {
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        isVeg: item.is_veg,
        quantity: newQuantity,
      });
    },
    [stallInfo, addItem]
  );

  const renderMenuItem = useCallback(
    ({ item, index }: { item: MenuItem; index: number }) => (
      <Animated.View
        entering={FadeInDown.delay(Math.min(index * 40, 400))
          .duration(350)
          .springify()
          .damping(18)}
        layout={Layout.springify()}
      >
        <MenuItemCard
          item={item}
          stallId={id!}
          onQuantityChange={(quantity) => handleQuantityChange(item, quantity)}
        />
      </Animated.View>
    ),
    [handleQuantityChange, id]
  );

  const keyExtractor = useCallback((item: MenuItem) => item.id.toString(), []);

  const heroImageSource = useMemo(() => {
    console.log("Menu Screen - imageUrl from params:", imageUrl);
    console.log("Menu Screen - imageUrl type:", typeof imageUrl);
    console.log("Menu Screen - imageBackgroundColor:", imageBackgroundColor);

    // Try MMKV cache first for instant access
    if (name) {
      const cached = getCachedVendorData(name);
      if (cached && cached.imageUrl && cached.imageUrl !== "none") {
        console.log("Menu Screen - Using cached image:", cached.imageUrl);
        return { uri: cached.imageUrl };
      }
    }

    // Then try params
    if (imageUrl && imageUrl !== "none" && imageUrl.trim() !== "") {
      console.log("Menu Screen - Using param image:", imageUrl);
      return { uri: imageUrl };
    }

    // Fallback to placeholder
    console.log("Menu Screen - Using placeholder image");
    return {
      uri: "https://via.placeholder.com/320x160?text=OASIS",
    };
  }, [imageUrl, name]);

  return (
    <View style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: name || "Menu",
          headerShown: false,
        }}
      />

      <View pointerEvents="none" style={styles.backgroundLayer}>
        <ImageBackground
          source={require("@assets/images/food/background-image.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <Animated.View style={entranceHeaderStyle}>
        <FoodHeader
          title="FOOD"
          showBackButton
          showCartIcon
          onCartPress={() =>
            router.push({
              pathname: "/private/home/food/cart",
              params: { source: "stalls" },
            })
          }
        />
      </Animated.View>

      <Animated.View style={styles.contentWrapper}>
        {isLoading && menuItems.length === 0 ? (
          <View style={styles.centerContent}>
            <LoadingIndicator title={name || "Menu"} />
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <FoodErrorState
              title="SOMETHING WENT WRONG"
              subtitle="Pull down to try again."
              illustration={require("@assets/images/errors/something_when_wrong_bg.png")}
              onRetry={onRefresh}
            />
          </View>
        ) : (
          <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            style={contentStyle}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            <FlashList
              data={filteredItems}
              renderItem={renderMenuItem}
              keyExtractor={keyExtractor}
              estimatedItemSize={93}
              contentContainerStyle={
                [
                  styles.listContent,
                  {
                    paddingBottom: listBottomPadding,
                  },
                ] as ContentStyle
              }
              ItemSeparatorComponent={() => <View style={styles.itemSpacer} />}
              showsVerticalScrollIndicator={false}
              onRefresh={onRefresh}
              refreshing={isLoading}
              ListHeaderComponent={
                <View style={styles.listHeader}>
                  <Animated.View
                    style={[styles.heroContainer, heroOpacityStyle]}
                  >
                    <MenuHeroBg
                      width={HERO_WIDTH}
                      height={HERO_HEIGHT}
                      style={[styles.heroBackground]}
                    />
                    <Animated.View
                      style={[
                        styles.heroImageWrapper,
                        heroImageStyle,
                        {
                          backgroundColor: heroBackgroundColor,
                        },
                      ]}
                    >
                      <Image
                        source={heroImageSource}
                        style={styles.heroImage}
                        resizeMode="contain"
                      />
                    </Animated.View>
                    <Animated.Text
                      style={[styles.heroTitle, heroTextStyle]}
                      numberOfLines={1}
                    >
                      {name}
                    </Animated.Text>
                    <Animated.View
                      style={[styles.heroLocationRow, heroTextStyle]}
                    >
                      <LocationIcon width={20} height={20} />
                      <Text style={styles.heroLocation} numberOfLines={1}>
                        {location}
                      </Text>
                    </Animated.View>
                  </Animated.View>

                  <View style={styles.searchSection}>
                    <FoodSearchBox
                      value={search}
                      onChangeText={setSearch}
                      placeholder="Search Menu"
                      showFilter
                      onFilterPress={() => setIsFilterOpen((prev) => !prev)}
                      width="100%"
                      filterOpen={isFilterOpen}
                    />

                    {/* Gradient Blur below search bar - darker above, lighter below */}
                    {/* {showSearchGradient && (
                      <GradientBlur
                        width={screenWidth}
                        height={r_h(40)}
                        top={r_h(55)}
                        left={-30}
                        colors={["rgba(0,0,0,0.91)", "rgba(0,0,0,0)"]}
                        intensity={0}
                        blurTint="dark"
                        direction="vertical"
                        zIndex={5}
                      />
                    )} */}

                    <FilterModal
                      visible={isFilterOpen}
                      onClose={() => {
                        setIsFilterOpen(false);
                        setSelectedFilters([]);
                      }}
                      selectedValues={selectedFilters}
                      onValueChange={setSelectedFilters}
                      button1Label="Veg"
                      button2Label="Non Veg"
                      button1Value="Veg"
                      button2Value="Non_Veg"
                    />
                  </View>
                </View>
              }
              ListFooterComponent={
                <View
                  style={[styles.listfooter, { height: 70 * heightScale }]}
                ></View>
              }
              ListEmptyComponent={() =>
                !hasAvailableMenuItems ? (
                  <View style={styles.emptyStateWrapper}>
                    <FoodErrorState
                      title="NO MENU ITEMS"
                      subtitle="Please check again later."
                      illustration={require("@assets/images/errors/no_menu_items_available_bg.png")}
                      onRetry={onRefresh}
                      containerStyle={styles.errorStateContainer}
                    />
                  </View>
                ) : (
                  <EmptyListComponent
                    title="No items found"
                    message="Try adjusting your search or filters."
                  />
                )
              }
            />
          </Animated.ScrollView>
        )}
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

      {totalPrice > 0 && totalCardWidth > 0 && (
        <Animated.View
          style={[styles.totalCardContainer, totalCardAnimatedStyle]}
        >
          <TotalCard
            totalPrice={totalPrice}
            cardWidth={totalCardWidth}
            cardHeight={totalCardHeight}
            buttonText="VIEW CART"
            onPress={() =>
              router.push({
                pathname: "/private/home/food/cart",
                params: { source: "stalls" },
              })
            }
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: r_w(16),
    paddingTop: r_h(12),
    zIndex: 1,
    alignItems: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: r_h(80),
  },
  listHeader: {
    width: "100%",
    alignItems: "center",
    gap: r_h(18),
  },
  heroContainer: {
    width: r_w(BASE_HERO_WIDTH),
    height: r_h(BASE_HERO_HEIGHT),
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  heroImageWrapper: {
    position: "absolute",
    top: r_h(2),
    width: r_w(BASE_HERO_WIDTH - 21),
    height: r_h(BASE_HERO_IMAGE_HEIGHT + 25),
    overflow: "hidden",

    // backgroundColor is applied inline with imageBackgroundColor
  },
  heroImage: {
    width: "100%",
    height: "100%",
    zIndex: 2,
  },

  heroTitle: {
    fontFamily: "Proza Libre",
    width: r_w(220),
    height: r_h(30),
    fontSize: r_t(18),
    fontWeight: "400",
    color: "#FFF",
    letterSpacing: 1,
    // textTransform: "uppercase",
    paddingHorizontal: r_w(24),
    position: "absolute",
    left: 0,
    top: r_h(130),
    textAlignVertical: "top",
  },
  heroLocationRow: {
    position: "absolute",
    bottom: r_h(22),
    right: r_w(35),
    flexDirection: "row",
    alignItems: "center",
    gap: r_w(6),
  },
  heroLocation: {
    fontFamily: "Quattrocento Sans",
    fontSize: r_t(16),
    letterSpacing: 0.6,
    color: "#FFF",
    maxWidth: r_w(140),
    textAlign: "right",
    fontWeight: 700,
  },
  searchSection: {
    width: "85%",
    alignItems: "center",
    gap: r_h(8),
    marginBottom: r_h(12),
    zIndex: 10,
  },
  itemSpacer: {
    height: r_h(BASE_CARD_LIST_GAP),
  },
  totalCardContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  //jugaad, 'not recommended'
  listfooter: {
    height: r_h(20),
    width: "100%",
    // borderWidth: 4,
    // borderColor: 'white',
    marginTop: r_h(15),
  },
  emptyStateWrapper: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: r_h(24),
  },
  errorStateContainer: {
    paddingVertical: 0,
  },
});

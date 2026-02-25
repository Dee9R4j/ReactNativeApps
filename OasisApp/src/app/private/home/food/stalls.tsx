import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Stack, router } from "expo-router";
import StallCard from "@/components/food/StallCard";
import FoodSearchBox from "@/components/food/FoodSearchBox";
import FilterModal from "@/components/food/FilterModal";
import { useBaseStore } from "@/state/base/base";
import { useFastStore } from "@/state/fast/fast";
import { selectGlobalTotal } from "@/state/fast/slices/food";
import EmptyListComponent from "@/components/food/EmptyListComponent";
import LoadingIndicator from "@/components/LoadingIndicator";
import { CartStall, Stall } from "@/utils/food-types";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
import FoodHeader from "@/components/food/FoodHeader";
import TotalCard from "@/components/food/TotalCard";
import GradientBlur from "@/components/food/GradientBlur";
import { useCrossFadeTransition } from "@/components/food/foodAnimations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { r_w, r_h, r_t } from "@/utils/responsive";
import FoodErrorState from "@/components/error_screens/FoodErrorState";

const BASE_CARD_WIDTH = 164;
const BASE_CARD_HORIZONTAL_GAP = 18;
const BASE_CARD_VERTICAL_GAP = 20;
const MAX_COLUMNS = 2;
const TOTAL_CARD_ASPECT_RATIO = 376 / 75;

const formatPrice = (value: number) =>
  Math.round(value).toLocaleString("en-IN");

type AnimatedStallListItemProps = {
  stall: Stall;
  index: number;
  cardWidth: number;
  horizontalGap: number;
  verticalGap: number;
};

const AnimatedStallListItem = React.memo(
  ({
    stall,
    index,
    cardWidth,
    horizontalGap,
    verticalGap,
  }: AnimatedStallListItemProps) => {
    return (
      <Animated.View
        entering={FadeInDown.delay(Math.min(index * 40, 300)).duration(220)}
        style={[
          styles.cardWrapper,
          {
            width: cardWidth,
            marginBottom: verticalGap,
            marginRight: index % MAX_COLUMNS === 0 ? horizontalGap : 0,
          },
        ]}
      >
        <StallCard stall={stall} />
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.stall.id === nextProps.stall.id &&
      prevProps.cardWidth === nextProps.cardWidth &&
      prevProps.horizontalGap === nextProps.horizontalGap &&
      prevProps.verticalGap === nextProps.verticalGap
    );
  }
);

export default function StallsScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const stalls = useBaseStore((state) => state.stalls);
  const filteredStalls = useBaseStore((state) => state.filteredStalls);
  const isLoading = useBaseStore((state) => state.isLoadingStalls);
  const isRefreshing = useBaseStore((state) => state.isRefreshing);
  const error = useBaseStore((state) => state.stallsError);
  const searchQuery = useBaseStore((state) => state.searchQuery);
  const selectedLocations = useBaseStore(
    (state) => state.selectedLocations
  );
  const fetchStalls = useBaseStore((state) => state.fetchStalls);
  const initializeMenusForSearch = useBaseStore(
    (state) => state.initializeMenusForSearch
  );
  const setSearchQuery = useBaseStore((state) => state.setSearchQuery);
  const setSelectedLocations = useBaseStore(
    (state) => state.setSelectedLocations
  );

  const { showSnackbar } = useSnackbar();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [showSearchGradient, setShowSearchGradient] = useState(false);

  // Cross-fade when filter/search changes
  const crossFadeStyle = useCrossFadeTransition(
    `${searchQuery}-${selectedLocations.join(",")}`
  );

  useEffect(() => {
    if (stalls.length === 0) {
      fetchStalls();
    } else {
      initializeMenusForSearch();
    }
  }, [fetchStalls, initializeMenusForSearch, stalls.length]);

  // snackbar when there's a network error
  useEffect(() => {
    if (error) {
      showSnackbar({
        message: "Network error, please try again",
        type: "error",
      });
    }
  }, [error, showSnackbar]);

  const horizontalPadding = r_w(25);
  const gridPaddingHorizontal = horizontalPadding;
  const horizontalGap = Math.max(r_w(12), r_w(BASE_CARD_HORIZONTAL_GAP));
  const verticalGap = Math.max(r_h(16), r_h(BASE_CARD_VERTICAL_GAP));

  const cardWidth = useMemo(() => {
    const availableWidth = screenWidth - gridPaddingHorizontal * 2;
    const scaledBase = r_w(BASE_CARD_WIDTH);
    const perCard = (availableWidth - horizontalGap) / MAX_COLUMNS;
    return Math.max(r_w(140), Math.min(scaledBase, perCard));
  }, [gridPaddingHorizontal, screenWidth, horizontalGap]);

  const renderStallCard = useCallback(
    ({ item, index }: { item: Stall; index: number }) => (
      <AnimatedStallListItem
        stall={item}
        index={index}
        cardWidth={cardWidth}
        horizontalGap={horizontalGap}
        verticalGap={verticalGap}
      />
    ),
    [cardWidth, horizontalGap, verticalGap]
  );

  const keyExtractor = useCallback((item: Stall) => item.id.toString(), []);

  const memoizedData = useMemo(() => filteredStalls, [filteredStalls]);

  const isStallsClosed = useMemo(() => {
    if (!error) {
      return false;
    }

    const normalized = error.toLowerCase();
    return (
      normalized.includes("status code 423") ||
      normalized.includes("status code 503") ||
      (normalized.includes("stall") && normalized.includes("closed"))
    );
  }, [error]);

  // Fixed item layout for FlatList to prevent position jumps
  const getItemLayout = useCallback(
    (_data: any, index: number) => {
      const CARD_HEIGHT = cardWidth * 1.2 + verticalGap; // Approximate card aspect ratio
      return {
        length: CARD_HEIGHT,
        offset: CARD_HEIGHT * Math.floor(index / MAX_COLUMNS),
        index,
      };
    },
    [cardWidth, verticalGap]
  );

  const totalPrice = useFastStore(
    (state) => selectGlobalTotal(state).totalPrice
  );

  const handleRefresh = useCallback(() => {
    fetchStalls();
  }, [fetchStalls]);

  const listHorizontalPadding = useMemo(() => {
    const totalWidth = cardWidth * MAX_COLUMNS + horizontalGap;
    const calculatedPadding = (screenWidth - totalWidth) / 2;
    return Math.max(gridPaddingHorizontal, calculatedPadding);
  }, [cardWidth, gridPaddingHorizontal, horizontalGap, screenWidth]);

  const backgroundHeight = useMemo(() => {
    return screenHeight + insets.top + insets.bottom;
  }, [insets.bottom, insets.top, screenHeight]);

  const totalCardWidth = useMemo(() => {
    const cardPaddingHorizontal = r_w(16);
    const availableWidth = screenWidth - cardPaddingHorizontal * 2;
    return Math.min(availableWidth, screenWidth * 0.95);
  }, [screenWidth]);

  const totalCardHeight = useMemo(() => {
    if (totalCardWidth === 0) {
      return 0;
    }

    return totalCardWidth / TOTAL_CARD_ASPECT_RATIO;
  }, [totalCardWidth]);

  const totalCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      bottom: 10,
    };
  }, []);

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

      {/* Header */}
      <View>
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
          onBackPress={() => router.replace("/private/home")}
        />
      </View>

      {/* Gradient Blur below search bar - darker above, lighter below */}
      {/* {showSearchGradient && (
        <GradientBlur
          width={screenWidth}
          height={r_h(40)}
          top={insets.top + r_h(130)}
          left={0}
          colors={["rgba(0,0,0,1)", "rgba(0,0,0,0)"]}
          intensity={0}
          blurTint="dark"
          direction="vertical"
          zIndex={5}
        />
      )} */}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.innerContainer}>
          {/* Search Controls */}
          <View
            style={[
              styles.controlsContainer,
              { paddingHorizontal: horizontalPadding },
            ]}
          >
            <FoodSearchBox
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Stalls"
              showFilter={true}
              onFilterPress={() => setFilterModalVisible((v) => !v)}
              filterOpen={filterModalVisible}
            />
          </View>

          {/* Render filter dropdown inline so it appears below the search box */}
          <FilterModal
            visible={filterModalVisible}
            onClose={() => {
              setFilterModalVisible(false);
              setSelectedLocations([]);
            }}
            selectedValues={selectedLocations}
            onValueChange={setSelectedLocations}
          />

          {isLoading && stalls.length === 0 ? (
            <View style={styles.loadingContainer}>
              <LoadingIndicator title="FOOD" subtitle="Fetching Stalls..." />
            </View>
          ) : (
            <Animated.View style={[{ flex: 1 }, crossFadeStyle]}>
              <FlatList
                style={styles.list}
                data={memoizedData}
                renderItem={renderStallCard}
                keyExtractor={keyExtractor}
                numColumns={2}
                contentContainerStyle={[
                  styles.listContainer,
                  {
                    paddingHorizontal: listHorizontalPadding,
                    paddingBottom: totalCardHeight + verticalGap + 60,
                  },
                ]}
                columnWrapperStyle={styles.columnWrapper}
                keyboardShouldPersistTaps="handled"
                onScroll={(event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  setShowSearchGradient(offsetY > 5);
                }}
                scrollEventThrottle={16}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                removeClippedSubviews={false}
                getItemLayout={getItemLayout}
                windowSize={5}
                maxToRenderPerBatch={6}
                initialNumToRender={10}
                updateCellsBatchingPeriod={50}
                ListEmptyComponent={() => {
                  if (isStallsClosed && filteredStalls.length === 0) {
                    return (
                      <View style={styles.emptyStateWrapper}>
                        <FoodErrorState
                          title="STALLS ARE CLOSED"
                          subtitle="Please check again later."
                          illustration={require("@assets/images/errors/stalls_are_closed_bg.png")}
                          onRetry={handleRefresh}
                          containerStyle={styles.errorStateContainer}
                        />
                      </View>
                    );
                  }

                  if (error && filteredStalls.length === 0) {
                    return (
                      <View style={styles.emptyStateWrapper}>
                        <FoodErrorState
                          title="SOMETHING WENT WRONG!"
                          subtitle="Pull down to try again."
                          illustration={require("@assets/images/errors/something_when_wrong_bg.png")}
                          onRetry={handleRefresh}
                          containerStyle={styles.errorStateContainer}
                        />
                      </View>
                    );
                  }

                  return (
                    <EmptyListComponent
                      title={
                        searchQuery || selectedLocations.length > 0
                          ? "No stalls found"
                          : "No stalls available"
                      }
                      message={
                        searchQuery || selectedLocations.length > 0
                          ? "Try adjusting your search or filter settings."
                          : ""
                      }
                    />
                  );
                }}
              />
            </Animated.View>
          )}

          {/* Dropdown moved to controlsContainer */}
        </View>
      </TouchableWithoutFeedback>

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
    backgroundColor: "transparent",
  },
  controlsContainer: {
    paddingHorizontal: r_w(25),
    alignItems: "stretch",
    justifyContent: "center",
    marginBottom: r_h(8),
    marginTop: r_h(15),
    width: "100%",
    zIndex: 10,
  },
  filterButton: {
    padding: r_w(12),
    backgroundColor: "#2c2c2e",
    borderRadius: r_w(10),
    borderColor: "#444",
    borderWidth: 1,
  },
  filterButtonActive: {
    borderColor: "#4CAF50",
    backgroundColor: "#2d3a2e",
  },
  listContainer: {
    paddingBottom: r_h(24),
    paddingTop: r_h(12),
  },
  list: {
    flex: 1,
    backgroundColor: "transparent",
  },
  cardWrapper: {
    backgroundColor: "transparent",
  },
  columnWrapper: {
    justifyContent: "flex-start",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: r_h(15),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFC107",
    padding: r_w(16),
  },
  footerText: {
    color: "black",
    fontSize: r_t(18),
    fontWeight: "bold",
  },
  footerButton: {
    color: "black",
    fontSize: r_t(18),
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

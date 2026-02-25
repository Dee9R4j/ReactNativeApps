import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { getStatusBarHeight } from "@/utils/safeArea";
import BarcodeIcon from "@assets/images/homescreen/barcode-icon.svg";
import { useQuery } from "@tanstack/react-query";
import { useBaseStore } from "@/state/base/base";
import {
  BuyMerchAPI,
  FetchMerchData,
  FetchMerchSizes,
  RefreshBoughtCollectedCache,
  UserMerchAPICache,
} from "@api/merch_api";
import {
  AddMerchToCartMMKV,
  ClearMerchCache,
  RemoveMerchFromCartMMKV,
} from "@/models/db/methods/merch";
import { useFastStore } from "@/state/fast/fast";
import { AxiosInstance } from "axios";
import { BackIcon } from "@assets/images/events";
import { MinusBuy, PlusBuy } from "@assets/images/merch";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
import { BuyButton } from "@/components/merch/BuyButton";
import { MerchCarouselNew } from "@components/merch/CarouselNew";
import { r_h, r_t, r_w } from "@utils/responsive";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { ImpactFeedbackStyle } from "expo-haptics";
// IMAGES
import collectedImg from "@assets/images/merch/collected-bg.png";
import boughtImg from "@assets/images/merch/bought-bg.png";
import { IMerchBought } from "@/models/merch";
import { useAuth } from "@/hooks/useAuthentication";
import { useQRNavigation } from "@/hooks/useQRNavigation";
import { Background } from "@components/PaperPNGBackground";
import AnimatedBackIcon from "@/components/AnimatedBackIcon";

export default function Merch() {
  // PREREQS
  const { showSnackbar } = useSnackbar();
  const axiosInstance = useBaseStore((state) => state.axios);

  const [merchSizes, setMerchSizes] = useState<
    | {
        id: number;
        size: string;
      }[]
    | 0
  >(0);

  // MERCH DATA + DATA FORMATTING
  const { data, isLoading, isError, error, isRefetching, refetch } = useQuery({
    queryKey: ["merchItems"],
    enabled: !!axiosInstance,
    queryFn: async () => {
      if (!axiosInstance) {
        throw new Error("No axios instance");
      }
      console.log("Fetching merch data");
      return FetchMerchData(axiosInstance);
    },
  });

  const [merchUserStats, setMerchUserStats] = useState<IMerchBought[] | null>(
    null,
  );
  const [refreshingMerchStats, setRefreshingMerchStats] = useState<number>(0);

  useEffect(() => {
    if (axiosInstance) {
      setMerchSizes(0);
      setLoading((p) => ({ ...p, sizes: true }));
      FetchMerchSizes(axiosInstance)
        .then((res) => {
          setMerchSizes(res as any);
        })
        .catch((err) => {
          showSnackbar({
            message: "Failed to get updated merch sizes",
            type: "error",
          });
          setMerchSizes([]);
        });

      setLoading((p) => ({ ...p, user_stats: true }));
      UserMerchAPICache(axiosInstance)
        .then((res: any) => {
          console.log("Fetched merch stats: ", res);
          // Normalize the data into an array if it's an object with bought/collected arrays
          let normalizedStats: IMerchBought[] = [];
          if (Array.isArray(res)) {
            normalizedStats = res;
          } else if (res && typeof res === 'object') {
            const bought = Array.isArray(res.bought) ? res.bought : [];
            const collected = Array.isArray(res.collected) ? res.collected : [];
            normalizedStats = [...bought, ...collected];
          }
          setMerchUserStats(normalizedStats);
          setLoading((p) => ({ ...p, user_stats: false }));
        })
        .catch((err) => {
          setLoading((p) => ({ ...p, user_stats: false }));
          showSnackbar({
            message:
              "Failed to fetch merch stats: " +
              (err?.message || "Unknown error"),
            type: "error",
          });
        });
    }
  }, []);

  useEffect(() => {
    if (axiosInstance) {
      RefreshBoughtCollectedCache(axiosInstance)
        .then((res: any) => {
          setLoading((p) => ({ ...p, user_stats: false }));
          console.log(res);
          // Normalize the data into an array if it's an object with bought/collected arrays
          let normalizedStats: IMerchBought[] = [];
          if (Array.isArray(res)) {
            normalizedStats = res;
          } else if (res && typeof res === 'object') {
            const bought = Array.isArray(res.bought) ? res.bought : [];
            const collected = Array.isArray(res.collected) ? res.collected : [];
            normalizedStats = [...bought, ...collected];
          }
          setMerchUserStats(normalizedStats);
        })
        .catch(() => {
          console.log("Failed to refresh merch stats");
        });
    }
  }, [refreshingMerchStats]);

  const image_data = data?.map((item) => {
    return {
      image_front: item.image_url,
      image_back: item.back_image_url,
    };
  });

  const merch_data = data?.map((item) => {
    return {
      name: item.name,
      price: item.price,
    };
  });

  // CUSTOM HOOKS
  const { isAuthenticating, authenticateUser } = useAuth();

  // STATE
  const [merchIndex, setMerchIndex] = useState(0);
  const [loading, setLoading] = useState({
    buy_req: false,
    user_stats: false,
    sizes: false,
  });

  // dirty hack
  const [currentPress, setCurrentPress] = useState(0);

  const currentMerchItem = useMemo(() => {
    return data?.at(merchIndex);
  }, [merchIndex, data, currentPress]);

  const cartTotalPrice = useFastStore((state) => {
    const cartState = state.MerchCart;
    const prices = cartState.map((item) => {
      return item.price * item.quantity;
    });
    return prices.reduce((acc, curr) => acc + curr, 0);
  });

  const merchCartFromMMKV = useFastStore((state) => state.MerchCart);

  const currentQuantity = useMemo(() => {
    const cartItem = merchCartFromMMKV.find(
      (item) => item.id === currentMerchItem?.id,
    );
    if (cartItem) {
      return cartItem.quantity;
    } else {
      console.log("SOMETHING BROKE");
      return 0;
    }
  }, [merchCartFromMMKV, currentMerchItem?.id, currentPress]);

  const currentBought = useMemo(() => {
    if (merchUserStats && !loading.user_stats) {
      const d = merchUserStats.filter((i) => i.id === currentMerchItem?.id);
      if (d.length > 0) {
        console.log(d);
        return d[0].bought;
      } else {
        return 0;
      }
    } else if (loading.user_stats) {
      return -2;
    } else {
      return -1;
    }
  }, [merchUserStats, loading.user_stats, currentMerchItem?.id]);

  const currentCollected = useMemo(() => {
    if (merchUserStats && !loading.user_stats) {
      const d = merchUserStats.filter((i) => i.id === currentMerchItem?.id);
      if (d.length > 0) {
        return d[0].collected;
      } else {
        return 0;
      }
    } else if (loading.user_stats) {
      return -2;
    } else {
      return -1;
    }
  }, [merchUserStats, loading.user_stats, currentMerchItem?.id]);

  // STATE UPDATES
  // if loading fails, show the snackbar
  useEffect(() => {
    if (isError) {
      showSnackbar({
        message: "Failed to load merch: " + (error?.message || "Unknown error"),
        type: "error",
      });
    }
  }, [isError, error, showSnackbar]);

  // ACTIONS
  const onBuy = (axios: AxiosInstance) => {
    Haptics.impactAsync(ImpactFeedbackStyle.Rigid);
    setLoading((p) => ({
      ...p,
      buy_req: true,
    }));

    console.log(merchUserStats);

    authenticateUser().then((res) => {
      if (res) {
        BuyMerchAPI(axios)
          .then(() => {
            setRefreshingMerchStats((p) => p + 1);
            setLoading((p) => ({
              ...p,
              buy_req: false,
            }));

            showSnackbar({
              message: "Merch purchased successfully",
              type: "success",
            });
          })
          .catch((e) => {
            showSnackbar({
              message:
                "Failed to buy merch: " + (e?.message || "Unknown error"),
              type: "error",
            });
            setLoading((p) => ({
              ...p,
              buy_req: false,
            }));
          });
      } else {
        showSnackbar({
          message: "Merch purchase requires user authentication",
          type: "error",
        });
        setLoading((p) => ({
          ...p,
          buy_req: false,
        }));
      }
    });
  };
  const handleRefresh = async () => {
    if (!axiosInstance) {
      console.warn("Skipping refresh: missing axios instance");
      return;
    }
    setRefreshingMerchStats((p) => p + 1);
    try {
      await ClearMerchCache();
      const result = await refetch();
      // if (result.data) {
      //     useFastStore.getState().ReconcileCartWithData(result.data)
      // }
    } catch (error: any) {
      showSnackbar({
        message: "Failed to buy merch: " + (error || "Unknown error"),
        type: "error",
      });
    }
  };
  const removeFromCart = () => {
    Haptics.impactAsync(ImpactFeedbackStyle.Medium);

    setCurrentPress((p) => p + 1);
    if (!currentMerchItem) {
      console.log(
        `[REMOVING MERCH FAIL] No current merch item at index ${merchIndex}`,
      );
      showSnackbar({
        message: "Failed to remove merch from cart: No current item",
        type: "error",
      });
    } else {
      RemoveMerchFromCartMMKV(currentMerchItem.id).catch(() => {
        showSnackbar({
          message: "Failed to remove merch from cart: ",
          type: "error",
        });
      });
    }
  };
  const addToCart = () => {
    Haptics.impactAsync(ImpactFeedbackStyle.Medium);

    setCurrentPress((p) => p + 1);
    if (!currentMerchItem) {
      console.log(
        `[ADDING MERCH FAIL] No current merch item at index ${merchIndex}`,
      );
      showSnackbar({
        message: "Failed to add merch to cart: No current item",
        type: "error",
      });
    } else {
      console.log();
      AddMerchToCartMMKV(currentMerchItem.id).catch((e) => {
        showSnackbar({
          message:
            "Failed to add merch to cart: " + (e?.message || "Unknown error"),
          type: "error",
        });
      });
    }
  };

  if (isLoading) {
    return (
      <MerchBasePageView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Swap out for a nicer full page loading */}
          <Text
            style={{
              fontFamily: "The Last Shuriken",
              color: "#fff",
              fontSize: r_t(32),
            }}
          >
            Loading merch...
          </Text>
        </View>
      </MerchBasePageView>
    );
  } else if (
    !isLoading &&
    !isError &&
    merch_data &&
    image_data &&
    data
  ) {
    return (
      <MerchBasePageView>
        <ScrollView
          style={styles.scrollview}
          scrollEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
            />
          }
        >
          <View style={styles.carouselContainer}>
            <MerchCarouselNew
              merch_data={merch_data}
              image_data={image_data}
              imageIndex={merchIndex}
              setImageIndex={setMerchIndex}
            />
          </View>
          <View style={styles.availableSizesContainer}>
            {merchSizes === 0 ? (
              <ActivityIndicator size={"small"} color={"white"} />
            ) : (
              <Text style={styles.availableSizesText}>
                Available sizes: {merchSizes.at(merchIndex)?.size ?? "N/A"}
              </Text>
            )}
          </View>
          <View style={styles.statsRow}>
            <ImageBackground
              source={collectedImg}
              resizeMode="contain"
              style={styles.bcBox}
            >
              {loading.user_stats && (
                <ActivityIndicator size={"small"} color={"white"} />
              )}
              <Text style={styles.bcText}>
                COLLECTED: {currentCollected >= 0 ? currentCollected : 0}
              </Text>
            </ImageBackground>

            <ImageBackground
              source={boughtImg}
              resizeMode="cover"
              style={styles.bcBox}
            >
              {loading.user_stats && (
                <ActivityIndicator size={"small"} color={"white"} />
              )}
              <Text style={styles.bcText}>
                BOUGHT: {currentBought >= 0 ? currentBought : 0}
              </Text>
            </ImageBackground>
          </View>

          <View style={styles.separator} />
          <View style={styles.buyBox}>
            <View style={styles.priceControlContainer}>
              <View style={styles.totalPriceContainer}>
                <Text style={styles.totalPriceText}>TOTAL</Text>
                <Text style={styles.totalPriceSubtext}>
                  {"\u20B9"}
                  {cartTotalPrice ? cartTotalPrice.toFixed(0) : 0}
                </Text>
              </View>
              <View style={styles.controlContainer}>
                <TouchableOpacity
                  onPress={removeFromCart}
                  disabled={!currentMerchItem}
                >
                  <MinusBuy height={r_h(35)} width={r_w(35)} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{currentQuantity}</Text>
                <TouchableOpacity
                  onPress={addToCart}
                  disabled={!currentMerchItem}
                >
                  <PlusBuy height={r_h(35)} width={r_w(35)} />
                </TouchableOpacity>
              </View>
            </View>
            <BuyButton
              disabled={
                loading.buy_req || isAuthenticating || cartTotalPrice === 0
              }
              loading={loading.buy_req || isAuthenticating}
              onPress={() => {
                onBuy(axiosInstance);
              }}
            />
          </View>
        </ScrollView>
      </MerchBasePageView>
    );
  } else {
    return (
      <MerchBasePageView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Swap out for a nicer full page loading */}
          <Text
            style={{
              fontFamily: "The Last Shuriken",
              color: "#fff",
              fontSize: r_t(32),
            }}
          >
            Coming soon
          </Text>
        </View>
      </MerchBasePageView>
    );
  }
}

interface proptypes {
  children: React.ReactNode;
}

const MerchBasePageView = (props: proptypes) => {
  // performance degradation
  const insets = useSafeAreaInsets();
  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
      <Background>
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
          }}
        >
          <View style={styles.topHeader}>
            {
              <AnimatedBackIcon
                onPress={handleBackPress}
                style={styles.backButton}
              />
            }

            <Text style={styles.title}>MERCH</Text>

            <TouchableOpacity
              onPress={() => router.push("/private/home/qr" as any)}
            >
              <BarcodeIcon width={30} height={30} />
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />

          <View style={styles.content}>{props.children}</View>
        </View>
      </Background>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  paperBackground: {
    position: "absolute",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
    paddingTop: getStatusBarHeight(),
  },
  topHeader: {
    paddingBottom: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    width: "90%",
  },
  title: {
    fontSize: r_t(22),
    fontFamily: "The Last Shuriken",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  separator: {
    marginVertical: 4,
    height: 2,
    width: "88%",
    backgroundColor: "white",
    alignSelf: "center",
  },

  header: {
    paddingVertical: r_h(12),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: r_w(16),
  },
  backButton: {
    width: r_w(40),
    height: r_h(40),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "The Last Shuriken",
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  // title: {
  //     fontSize: 24,
  //     fontWeight: "bold",
  //     marginBottom: 40,
  //     color: "#ffffff",
  // },
  shiftMerchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  buyBox: {
    padding: 16,
    width: "100%",
    height: r_h(232),
    justifyContent: "flex-start",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  bcBox: {
    borderWidth: r_w(2),
    borderColor: "#ffffffff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    width: r_w(145),
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // position: 'absolute',
  },
  bcText: {
    color: "#fff",
    fontSize: r_t(16),
    fontFamily: "Quattrocento Sans",
  },
  totalPriceText: {
    color: "#fff",
    fontSize: r_t(16),
    fontFamily: "The Last Shuriken",
    letterSpacing: r_t(0.32),
  },
  totalPriceSubtext: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "Quattrocento Sans",
  },
  priceControlContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  totalPriceContainer: {
    flexDirection: "column",
    // gap: 4,
    paddingLeft: 12,
  },
  controlContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: r_w(12),
    width: r_w(130),
    justifyContent: "space-between",
  },
  carouselContainer: {
    // marginBottom: 20,
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  quantityText: {
    color: "#fff",
    fontSize: r_t(36),
    fontFamily: "Bricolage Grotesque",
    fontWeight: 500,
  },
  checkoutButton: {
    backgroundColor: "#8C0600",
    // paddingVertical: 14,
    alignItems: "center",
    // marginTop: 16,
    width: "100%",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "The Last Shuriken",
  },
  scrollview: {
    flex: 1,
  },
  emptyStateContainer: {
    height: r_h(360),
    width: r_w(360),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  emptyStateText: {
    color: "#9f9f9f",
    fontSize: 16,
  },

  availableSizesText: {
    color: "#ffffff",
    fontSize: r_t(14),
    alignSelf: "center",
    fontFamily: "Quattrocento Sans",
  },
  availableSizesContainer: {
    paddingTop: r_h(18),
    paddingBottom: r_h(18),
  },
  errorText: {
    color: "#ff6b6b",
    marginTop: 12,
    textAlign: "center",
  },
});

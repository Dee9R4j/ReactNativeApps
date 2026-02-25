import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ImageBackground,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "../../../../../utils/safeArea";
import { getKindStore } from "@/api/wallet.api";
import BackArrow from "@assets/images/wallet/back-arrow.svg";
import BarcodeIcon from "@assets/images/wallet/barcode-icon.svg";
import DarkBgPNG from "@assets/images/wallet/darkbgpng.png";
import KindMainRedUp from "@assets/images/wallet/kindmainredup.png";
import BlackKind from "@assets/images/wallet/blackkind.png";
import KindRedDown from "@assets/images/wallet/kindreddown.png";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";

// Reuse scaling helpers like other wallet screens
const { width, height } = Dimensions.get("window");
const BASE_WIDTH = 360;
const BASE_HEIGHT = 792;
export const horizontalScale = (size: number) =>
  Math.round((width / BASE_WIDTH) * size);
export const verticalScale = (size: number) =>
  Math.round((height / BASE_HEIGHT) * size);
export const moderateScale = (size: number) =>
  Math.round(size * Math.min(width / BASE_WIDTH, height / BASE_HEIGHT));
export const hScale = horizontalScale;
export const vScale = verticalScale;

type KindStoreItem = {
  id: number;
  name: string;
  price: number; // treat as Kind Points
  is_available: boolean;
  image: string; // URL
};

import { useQRNavigation } from "@/hooks/useQRNavigation";

export default function KindStore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const contentPadding = Math.round(width * 0.07);
  const cardWidth = width - contentPadding * 2;
  const { showSnackbar } = useSnackbar();
  const navigateToQR = useQRNavigation();

  const [items, setItems] = useState<KindStoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      if (!refreshing) setLoading(true);
      const result = await getKindStore();
      const arr = Array.isArray(result.data) ? result.data : [];
      setItems(arr.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.kind_points || item.price || 0,
        is_available: item.available ?? item.is_available ?? true,
        image: item.image_url || item.image || "",
      })));
    } catch (err: any) {
      showSnackbar({ message: err?.message || "Failed to load Kind Store", type: "error" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const gap = hScale(10);
  const tileWidth = Math.floor((cardWidth - gap) / 2);

  const renderItem = ({ item }: { item: KindStoreItem }) => (
    <View style={[styles.tile, { width: tileWidth, marginBottom: vScale(12) }]}>
      {/* Upper black card with centered image/icon */}
      <ImageBackground
        source={BlackKind}
        style={styles.tileTop}
        imageStyle={{ resizeMode: "stretch" }}
      >
        {/* Small white angled corners (top-left and top-right) */}
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTLV]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerTRV]} />
        {/* Center the product image inside the black tile */}
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={{
              width: Math.min(tileWidth * 0.7),
              height: tileWidth * 0.7,
              resizeMode: "contain",
            }}
          />
        ) : (
          <Ionicons
            name="image-outline"
            size={moderateScale(34)}
            color="#fff"
          />
        )}
      </ImageBackground>

      {/* Red footer with name and points */}
      <ImageBackground
        source={KindRedDown}
        style={styles.tileBottom}
        imageStyle={{ resizeMode: "stretch" }}
      >
        <Text numberOfLines={1} style={styles.itemName}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={styles.itemPoints}>
          {item.price} Kind Points
        </Text>
      </ImageBackground>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: getStatusBarHeight() }]}
    >
      <ImageBackground
        source={DarkBgPNG}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Header - same style as other wallet screens */}
        <View style={[styles.header, { paddingHorizontal: moderateScale(12) }]}>
          <Pressable
            style={styles.headerIconButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <BackArrow width={moderateScale(28)} height={moderateScale(28)} />
          </Pressable>
          <Text style={styles.headerTitle}>KIND STORE</Text>
          <Pressable
            style={styles.headerIconButton}
            onPress={navigateToQR}
            hitSlop={8}
          >
            <BarcodeIcon width={moderateScale(24)} height={moderateScale(24)} />
          </Pressable>
          <View pointerEvents="none" style={styles.headerUnderline} />
        </View>

        {/* Main red informational card */}
        <View
          style={{ paddingHorizontal: contentPadding, marginTop: vScale(6) }}
        >
          <ImageBackground
            source={KindMainRedUp}
            style={{
              width: cardWidth,
              height: vScale(130),
              marginTop: vScale(10),
              justifyContent: "center",
            }}
            imageStyle={{ resizeMode: "stretch" }}
          >
            <Text style={styles.mainCardText}>
              Earn kind points by participating in events and redeem for rewards
              at M Lawns
            </Text>
          </ImageBackground>
        </View>

        {/* Grid list within a bounded container + bottom fade like transactions */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: contentPadding,
            // Lift the end of the list a bit above the screen bottom
            paddingBottom: Math.max(
              vScale(24),
              Math.round(insets.bottom * 0.6)
            ),
          }}
        >
          <View style={{ flex: 1 }}>
            <FlatList
              data={items}
              keyExtractor={(it) => String(it.id)}
              numColumns={2}
              renderItem={renderItem}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginTop: vScale(18),
              }}
              contentContainerStyle={{
                // Add extra bottom space so last row isn't hidden behind the fade
                paddingBottom:
                  Math.max(vScale(24), Math.round(insets.bottom * 0.6)) +
                  vScale(60),
              }}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchItems();
              }}
              ListEmptyComponent={() => (
                <View style={{ alignItems: "center", marginTop: vScale(40) }}>
                  {loading ? (
                    <Text style={styles.emptyText}>Loading…</Text>
                  ) : (
                    <Text style={styles.emptyText}>No items available</Text>
                  )}
                </View>
              )}
            />
            {/* Bottom fade overlay to soften FlatList end */}
            <LinearGradient
              pointerEvents="none"
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: vScale(220),
              }}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: vScale(12),
    backgroundColor: "transparent",
  },
  headerIconButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(25),
    color: "#fff",
    flex: 1,
    textAlign: "center",
    letterSpacing: 1,
    fontFamily: "Quattrocento Sans Bold",
  },
  headerUnderline: {
    position: "absolute",
    left: "7%",
    right: "7%",
    bottom: vScale(3),
    height: 2,
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
  },
  mainCardText: {
    width: "60%",
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "Quattrocento Sans Bold",
    lineHeight: moderateScale(20),
    marginLeft: hScale(12),
  },
  tile: {
    overflow: "hidden",
  },
  tileTop: {
    width: "100%",
    height: vScale(120),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vScale(4),
    position: "relative",
  },
  tileBottom: {
    width: "100%",
    height: vScale(42),
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: hScale(6),
    paddingTop: vScale(1),
  },
  itemName: {
    color: "#fff",
    fontSize: moderateScale(15),
    fontFamily: "Proza Libre",
    fontWeight: "700",
  },
  itemPoints: {
    color: "#fff",
    opacity: 0.9,
    fontSize: moderateScale(10),
    fontFamily: "Quattrocento Sans Bold",
    marginTop: vScale(1),
  },
  // Corner accents
  corner: {
    position: "absolute",
    backgroundColor: "#fff",
    zIndex: 5,
  },
  // Horizontal corners (length x thickness)
  cornerTL: { top: -4, left: -4, width: moderateScale(14), height: 1 },
  cornerTR: { top: -4, right: -4, width: moderateScale(14), height: 1 },
  // Vertical corners (thickness x length)
  cornerTLV: { top: -4, left: -5, width: 1, height: moderateScale(14) },
  cornerTRV: { top: -4, right: -4, width: 1, height: moderateScale(14) },
  emptyText: {
    color: "#CCCCCC",
    fontSize: moderateScale(14),
    fontFamily: "Quattrocento Sans Bold",
    opacity: 0.9,
  },
});

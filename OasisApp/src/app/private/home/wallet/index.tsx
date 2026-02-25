import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getWalletBalance, getWalletTransactions } from "@/api/wallet.api";
import { useSecureStore } from "@/state/secure/secure";

// Wallet SVG assets
import BackArrow from "@assets/images/wallet/back-arrow.svg";
import BarcodeIcon from "@assets/images/wallet/barcode-icon.svg";
// Switch from SVGs to PNGs as requested
import WalletCardPNG from "@assets/images/wallet/walletmainredcardfinalpng.png";
import KindFPNG from "@assets/images/wallet/kindfpng.png";
import AddMFPNG from "@assets/images/wallet/addmonipngf.png";
import SendFPNG from "@assets/images/wallet/sendfpng.png";
import TransacCardPNG from "@assets/images/wallet/transaccardpng.png";
import DarkBgPNG from "@assets/images/wallet/darkbgpng.png";
import OasisLogoWalletPNG from "@assets/images/wallet/oasislogowalletpng.png";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
// Note: we'll rely on safe area insets directly instead of getStatusBarHeight

/**
 * Scaling strategy:
 * - Base device: OnePlus 12R -> width: 360, height: 792 (as you provided)
 * - horizontalScale = screenWidth / baseWidth
 * - verticalScale = screenHeight / baseHeight
 * - moderateScale = size * min(horizontalScale, verticalScale) (used for fonts, paddings, most sizes)
 * - If you specifically want purely horizontal/vertical scaling you can use horizontalScale / verticalScale helpers below.
 *
 * Use moderateScale(...) across the styles to keep proportions stable across devices.
 */

import { useQRNavigation } from "@/hooks/useQRNavigation";

const BASE_WIDTH = 360;
const BASE_HEIGHT = 792;

const Wallet: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigateToQR = useQRNavigation();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const name = useSecureStore((s) => s.name);
  const userId = useSecureStore((s) => s.user_id);

  // device dimensions
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  // Safe-area aware dimensions
  const usableWidth = screenWidth - insets.left - insets.right;
  const usableHeight = screenHeight - insets.top - insets.bottom;
  // Content padding to align with header underline (left/right 7%)
  const contentPadding = Math.round(screenWidth * 0.07);

  // scale helpers
  const horizontalScale = screenWidth / BASE_WIDTH;
  const verticalScale = screenHeight / BASE_HEIGHT;
  const moderateScale = (size: number) =>
    Math.round(size * Math.min(horizontalScale, verticalScale));
  const hScale = (size: number) => Math.round(size * horizontalScale);
  const vScale = (size: number) => Math.round(size * verticalScale);
  console.log(Dimensions.get("window"));

  // Fetch balance from mock API
  const fetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWalletBalance();
      const total = result.data?.total ?? null;
      setBalance(typeof total === "number" ? total : Number(total) || 0);
    } catch (error: any) {
      console.error("Error fetching balance:", error);
      showSnackbar({
        message: "Failed to fetch balance",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // paddings & card sizes derived from base values but scaled
  const horizontalPadding = moderateScale(16);
  // Ensure the card width aligns with header underline width
  const cardWidth = screenWidth - contentPadding * 2;
  const cardHeight = moderateScale(210); // scaled from 210
  // Keep transactions panel within safe area height
  const transPanelHeight = Math.min(Math.max(usableHeight * 0.4));
  // Ensure FlatList never clips into bottom safe area
  const listMaxHeight = Math.max(
    transPanelHeight - Math.max(moderateScale(15), insets.bottom * 0.4),
    Math.floor(usableHeight * 0.4),
  );

  async function getTransactions() {
    try {
      const result = await getWalletTransactions();
      return { success: true, data: result.data };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error?.message || "Failed to fetch transactions",
      };
    }
  }

  const fetchTransactions = useCallback(async () => {
    setTxLoading(true);
    const result = await getTransactions();
    if (result.success) {
      const raw = Array.isArray(result.data)
        ? result.data
        : result.data?.txns || [];
      setTransactions(raw);
    } else {
      showSnackbar({
        message:
          typeof result.errorMessage === "string"
            ? result.errorMessage
            : "Failed to fetch transactions",
        type: "error",
      });
    }
    setTxLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBalance();
      fetchTransactions();
    }, [fetchBalance]),
  );

  // dynamic styles that use scaling helpers
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    bgImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    header: {
      paddingVertical: vScale(12),
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: horizontalPadding,
    },
    headerIconButton: {
      width: moderateScale(40),
      height: moderateScale(40),
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: moderateScale(25),
      color: "#ffffff",
      // keep same font family; scaled font size used
      fontFamily: "The Last Shuriken",
      letterSpacing: 1,
    },
    headerUnderline: {
      position: "absolute",
      left: "7%",
      right: "7%",
      bottom: -vScale(-3),
      height: 2,
      backgroundColor: "#FFFFFF",
      opacity: 0.9,
    },
    cardOverlay: {
      position: "absolute",
      left: moderateScale(20),
      right: moderateScale(20),
      top: moderateScale(18),
      paddingHorizontal: moderateScale(16),
    },
    userInfoBlock: {
      marginTop: vScale(6),
      position: "relative", // allow absolute-positioned logo without affecting layout
    },
    inlineRow: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: moderateScale(-9), // align exactly under nameText
    },
    userIdLeftRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    balanceLabel: {
      fontSize: moderateScale(16),
      color: "#ffffff",
      opacity: 0.9,
      fontFamily: "The Last Shuriken",
      letterSpacing: 0.5,
      marginTop: moderateScale(10),
    },
    userIdLabel: {
      fontSize: moderateScale(19),
      color: "#FFF9E9",
      marginRight: moderateScale(6),
      fontFamily: "Quattrocento Sans",
      fontWeight: "700",
    },
    userIdValue: {
      fontSize: moderateScale(19),
      color: "#FFF9E9",
      fontFamily: "Quattrocento Sans",
      fontWeight: "700",
      marginTop: vScale(0),
    },
    userIdLogo: {
      position: "absolute",
      // top: vScale(-2),
      right: moderateScale(-20),
      width: moderateScale(65),
      height: moderateScale(65),
      opacity: 0.95,
      // Keep it from pushing other elements by removing it from flex flow
    },
    currentBalanceLabel: {
      fontSize: moderateScale(19),
      color: "#FFF9E9",
      marginTop: vScale(9),
      marginLeft: moderateScale(-9),
      fontFamily: "Quattrocento Sans",
      fontWeight: "700",
      // align exactly under nameText
    },
    balanceRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "nowrap",
      marginTop: moderateScale(1),
      marginLeft: moderateScale(-9), // align exactly under nameText
    },
    currencySymbol: {
      fontSize: moderateScale(34),
      color: "#FFF9E9",
      fontFamily: "Proza Libre",
      marginRight: moderateScale(6),
    },
    balanceValue: {
      fontSize: moderateScale(34),
      color: "#FFF9E9",
      fontFamily: "Proza Libre",
    },
    balanceText: {
      marginTop: moderateScale(26),
      marginLeft: moderateScale(18),
      fontSize: moderateScale(41),
      color: "#FFF9E9",
      fontFamily: "Quattrocento Sans",
      fontWeight: "400",
    },
    nameText: {
      fontSize: moderateScale(20),
      marginTop: vScale(4),
      marginLeft: moderateScale(-9),
      color: "#FFF9E9",
      fontFamily: "Quattrocento Sans",
      fontWeight: "700",
    },
    userIdText: {
      fontSize: moderateScale(19),
      color: "#FFF9E9",
      marginTop: moderateScale(3),
      marginLeft: moderateScale(67),
      fontFamily: "Quattrocento Sans",
      fontWeight: "700",
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: moderateScale(22),
      marginLeft: moderateScale(10),
    },
    actionsRow: {
      paddingHorizontal: horizontalPadding,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: vScale(-18),
      height: vScale(70),
    },
    actionBtn: {
      height: vScale(56),
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    actionContent: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
    },
    // Individual content containers per button for independent alignment
    actionContentKind: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: "100%",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingLeft: hScale(10),
      marginBottom: vScale(13),
    },
    actionContentAdd: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    actionContentSend: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      width: "100%",
      justifyContent: "center",
      alignItems: "flex-end",
      paddingRight: hScale(10),
      marginBottom: vScale(13),
    },
    // Base text style; use specific variants below for each button if needed
    actionBtnText: {
      color: "#FFF9E9",
      fontFamily: "Proza Libre",
      fontSize: moderateScale(19),
      lineHeight: moderateScale(20),
      textAlign: "center",
    },
    actionBtnTextKind: {
      color: "#FFF9E9",
      fontFamily: "Proza Libre",
      fontSize: moderateScale(19),
      lineHeight: moderateScale(20),
      textAlign: "left",
      fontWeight: "700",
      // weight: "700",
    },
    actionBtnTextAdd: {
      color: "#FFF9E9",
      fontFamily: "Proza Libre",
      fontSize: moderateScale(19),
      lineHeight: moderateScale(20),
      textAlign: "center",
      fontWeight: "700",
    },
    actionBtnTextSend: {
      color: "#FFF9E9",
      fontFamily: "Proza Libre",
      fontSize: moderateScale(19),
      lineHeight: moderateScale(20),
      textAlign: "right",
      fontWeight: "700",
    },
    actionSvgKindWrap: {
      width: "100%",
      alignItems: "center",
      marginBottom: vScale(15),
      // paddingLeft: vScale(-20),
      paddingRight: hScale(3),
    },
    actionSvgAddWrap: {
      width: "100%",
      alignItems: "center",
      marginBottom: vScale(6),
    },
    actionSvgSendWrap: {
      width: "55%",
      alignItems: "center",
      marginBottom: vScale(17),
      paddingLeft: hScale(3),
    },
    actionBtnKind: {},
    actionBtnAdd: {},
    actionBtnSend: {},
    actionLabel: {
      color: "#ffffff",
      fontSize: moderateScale(14),
      fontFamily: "The Last Shuriken",
      textAlign: "center",
    },
    actionLabelKind: {
      color: "#ffffff",
      fontSize: moderateScale(14),
      fontFamily: "The Last Shuriken",
      textAlign: "center",
      lineHeight: moderateScale(16),
    },
    emptyWrap: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: moderateScale(16),
      paddingHorizontal: moderateScale(12),
    },
    emptyText: {
      color: "#CCCCCC",
      fontSize: moderateScale(14),
      fontFamily: "CantoraOne-Regular",
      alignItems: "center",
      marginTop: moderateScale(120),
    },
    transHeaderWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    viewAll: {
      color: "#56A8E8",
      fontSize: moderateScale(14),
      fontFamily: "The Last Shuriken",
    },
    transactionsTitle: {
      textAlign: "center",
      color: "#FFFFFF",
      fontSize: moderateScale(24),
      letterSpacing: 1,
      fontFamily: "The Last Shuriken",
      marginBottom: moderateScale(15),
      marginTop: vScale(-2),
    },
    transBgWrap: {
      width: "100%",
      alignItems: "center",
      marginTop: 0,
    },
    transBgOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: vScale(23),
      paddingTop: vScale(0),
    },
    bottomFade: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: vScale(200),
      paddingTop: vScale(-20),
      marginTop: vScale(20),
      paddingBottom: vScale(-80),
    },
    transItemRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: vScale(12),
    },
    transTitle: {
      color: "#FFFFFF",
      fontSize: moderateScale(16),
      fontFamily: "CantoraOne-Regular",
    },
    transSubtitle: {
      marginTop: vScale(4),
      color: "#CCCCCC",
      fontSize: moderateScale(12),
      fontFamily: "CantoraOne-Regular",
    },
    transAmount: {
      fontSize: moderateScale(18),
      fontFamily: "CantoraOne-Regular",
      color: "#FFFFFF",
    },
    amountCredit: {
      color: "#FFFFFF",
    },
    amountDebit: {
      color: "#FFFFFF",
    },
    transSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: "#FFFFFF55",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={DarkBgPNG}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <BackArrow width={moderateScale(28)} height={moderateScale(28)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>WALLET</Text>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={navigateToQR}
            hitSlop={8}
          >
            <BarcodeIcon width={moderateScale(24)} height={moderateScale(24)} />
          </TouchableOpacity>
          <View pointerEvents="none" style={styles.headerUnderline} />
        </View>

        {/* Wallet Card with dynamic overlays */}
        <View
          style={{ paddingHorizontal: contentPadding, marginTop: vScale(8) }}
        >
          <View style={{ width: cardWidth, height: cardHeight }}>
            <Image
              source={WalletCardPNG}
              style={{
                width: cardWidth,
                height: cardHeight,
                resizeMode: "contain",
              }}
            />
            <View pointerEvents="none" style={styles.cardOverlay}>
              {/**
               * Truncate name to 10 characters with ellipsis and ensure no wrapping
               */}
              <Text
                style={styles.nameText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name
                  ? name.length > 16
                    ? `${name.slice(0, 16)}…`
                    : name
                  : "--"}
              </Text>
              <View style={styles.userInfoBlock}>
                <View style={styles.inlineRow}>
                  <View style={styles.userIdLeftRow}>
                    <Text style={styles.userIdLabel}>User ID:</Text>
                    <Text style={styles.userIdValue}>{userId ?? "--"}</Text>
                  </View>
                </View>
                <Image
                  source={OasisLogoWalletPNG}
                  style={styles.userIdLogo}
                  resizeMode="contain"
                />
                <Text style={styles.currentBalanceLabel}>Current Balance:</Text>
                <View style={styles.balanceRow}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <Text style={styles.balanceValue}>
                    {loading ? "..." : balance !== null ? `${balance}` : "--"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Actions row */}
        <View
          style={[styles.actionsRow, { paddingHorizontal: contentPadding }]}
        >
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnKind]}
            onPress={() => router.push("/private/home/wallet/kind" as any)}
          >
            <View style={styles.actionSvgKindWrap}>
              <Image
                source={KindFPNG}
                style={{
                  width: moderateScale(110),
                  height: moderateScale(53),
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={styles.actionContentKind} pointerEvents="none">
              <Text style={styles.actionBtnTextKind}>KIND</Text>
              <Text style={styles.actionBtnTextKind}>STORE</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnAdd]}
            onPress={() => router.push("/private/home/wallet/addCash" as any)}
          >
            <View style={styles.actionSvgAddWrap}>
              <Image
                source={AddMFPNG}
                style={{
                  width: moderateScale(160),
                  height: moderateScale(100),
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={styles.actionContentAdd} pointerEvents="none">
              <Text style={styles.actionBtnTextAdd}>ADD</Text>
              <Text style={styles.actionBtnTextAdd}>MONEY</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnSend]}
            onPress={() => router.push("/private/home/wallet/transfer" as any)}
          >
            <View style={styles.actionSvgSendWrap}>
              <Image
                source={SendFPNG}
                style={{
                  width: moderateScale(110),
                  height: moderateScale(53),
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={styles.actionContentSend} pointerEvents="none">
              <Text style={styles.actionBtnTextSend}>SEND</Text>
              <Text style={styles.actionBtnTextSend}>MONEY</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Transactions section */}
        <View
          style={{
            paddingHorizontal: contentPadding,
            marginTop: vScale(20),
            // paddingBottom: vScale(24),
          }}
        >
          <Text style={styles.transactionsTitle}>TRANSACTIONS</Text>

          <View style={styles.transBgWrap}>
            <View style={{ width: cardWidth, height: transPanelHeight }}>
              <Image
                source={TransacCardPNG}
                style={{ width: "100%", height: "105%", resizeMode: "stretch" }}
              />
              <View style={styles.transBgOverlay} pointerEvents="box-none">
                {txLoading ? (
                  <View
                    style={[styles.emptyWrap, { maxHeight: listMaxHeight }]}
                  >
                    <ActivityIndicator color="#FFFFFF" />
                  </View>
                ) : transactions.length === 0 ? (
                  <FlatList
                    data={[]}
                    keyExtractor={(_, index) => `empty-${index}`}
                    refreshing={txLoading}
                    onRefresh={fetchTransactions}
                    ListEmptyComponent={() => (
                      <View
                        style={[styles.emptyWrap, { maxHeight: listMaxHeight }]}
                      >
                        <Text style={styles.emptyText}>
                          No transactions yet
                        </Text>
                      </View>
                    )}
                    contentContainerStyle={{
                      paddingVertical: moderateScale(10),
                      paddingHorizontal: moderateScale(12),
                    }}
                    style={{ maxHeight: listMaxHeight }}
                    renderItem={undefined}
                  />
                ) : (
                  <FlatList
                    data={transactions}
                    keyExtractor={(item, index) =>
                      `${item.id ?? index}-${index}`
                    }
                    refreshing={txLoading}
                    onRefresh={fetchTransactions}
                    renderItem={({ item }) => {
                      const title =
                        item.name ||
                        item.title ||
                        item.description ||
                        item.note ||
                        "Transaction";
                      const timestamp =
                        item.timestamp ||
                        item.created_at ||
                        item.date ||
                        item.time ||
                        null;
                      const amount =
                        item.amount ??
                        item.current_amount ??
                        item.price ??
                        item.value ??
                        0;

                      // Use backend txn_type to determine sign: 0 or 7 => plus, else minus
                      const txnType = item?.txn_type;
                      const isCredit = txnType === 0 || txnType === 7;
                      const displayTitle =
                        txnType === 7 ? "Received Money" : title;

                      return (
                        <View style={styles.transItemRow}>
                          <View
                            style={{ flex: 1, paddingRight: moderateScale(12) }}
                          >
                            <Text style={styles.transTitle}>
                              {displayTitle}
                            </Text>
                            <Text style={styles.transSubtitle}>
                              {timestamp
                                ? new Date(timestamp).toLocaleString()
                                : ""}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.transAmount,
                              isCredit
                                ? styles.amountCredit
                                : styles.amountDebit,
                            ]}
                          >
                            {isCredit ? "+₹" : "-₹"}
                            {amount}
                          </Text>
                        </View>
                      );
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={styles.transSeparator} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingVertical: moderateScale(10),
                      paddingHorizontal: moderateScale(12),
                      // Add extra bottom space so last item isn't hidden behind the fade
                      // Reduced bottom padding to remove excessive empty scroll space
                      // Keep minimal safe-area aware padding so last item isn't clipped
                      paddingBottom: Math.max(
                        moderateScale(12),
                        insets.bottom + vScale(8),
                      ),
                    }}
                    style={{ maxHeight: listMaxHeight }}
                  />
                )}
                {/* Bottom fade overlay to soften FlatList end */}
                {/* <LinearGradient
                  pointerEvents="none"
                  colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
                  style={styles.bottomFade}
                /> */}
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Wallet;

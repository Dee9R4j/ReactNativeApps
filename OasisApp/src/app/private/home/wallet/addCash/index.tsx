import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getWalletBalance } from "@/api/wallet.api";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "@utils/safeArea";
import { useAuth } from "@/hooks/useAuthentication";
import { useSecureStore } from "@/state/secure/secure";

// Switch to PNG assets
import AddSendPNG from "@assets/images/wallet/addsendfpng.png";
import Btn500PNG from "@assets/images/wallet/50012final.png";
import Btn1kPNG from "@assets/images/wallet/50012final.png";
import Btn2kPNG from "@assets/images/wallet/50012final.png";
import ClickAddPNG from "@assets/images/wallet/buyaddbuttonplainpng.png";
import BackArrow from "@assets/images/wallet/back-arrow.svg";
import BarcodeIcon from "@assets/images/wallet/barcode-icon.svg";

// PNG Background
import DarkBgPNG from "@assets/images/wallet/darkbgpng.png";

import { Dimensions } from "react-native";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
const { width, height } = Dimensions.get("window");
// Scaling helpers (match wallet index page)
const BASE_WIDTH = 360;
const BASE_HEIGHT = 792;
const horizontalScale = (size: number) =>
  Math.round((width / BASE_WIDTH) * size);
const verticalScale = (size: number) =>
  Math.round((height / BASE_HEIGHT) * size);
const moderateScale = (size: number) =>
  Math.round(size * Math.min(width / BASE_WIDTH, height / BASE_HEIGHT));
const hScale = horizontalScale;
const vScale = verticalScale;
// Align below-header content with header underline (7% left/right)
const contentPadding = Math.round(width * 0.07);
const cardWidth = width - contentPadding * 2;

export const screenOptions = {
  headerShown: false,
};

import { useQRNavigation } from "@/hooks/useQRNavigation";

const mockAddCash = async (amount: number) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true, amount } as const;
};

const AddCashPage = () => {
  const { showSnackbar } = useSnackbar();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const router = useRouter();
  const navigateToQR = useQRNavigation();
  const { isAuthenticating, authenticateUser } = useAuth();

  // Select primitives separately to avoid getSnapshot infinite loop issues
  const name = useSecureStore((s: any) => s.name);
  const user_id = useSecureStore((s: any) => s.user_id);
  // Fetch balance from mock API
  async function getBalance() {
    try {
      const result = await getWalletBalance();
      return { success: true, data: result.data } as const;
    } catch (error: any) {
      return {
        success: false,
        errorMessage: error?.message || "Failed to fetch balance",
      } as const;
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      setAmount("");
      let active = true;
      (async () => {
        const result = await getBalance();
        if (!active) return;
        if (result.success) {
          const total = (result.data as any)?.total ?? null;
          setBalance(typeof total === "number" ? total : Number(total) || 0);
        } else {
          showSnackbar({
            message:
              typeof result.errorMessage === "string"
                ? result.errorMessage
                : "Failed to fetch balance",
            type: "error",
          });
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  // New handler for the +500, +1k, +2k buttons
  const handleQuickAdd = (addValue: number) => {
    if (loading) return;
    const currentAmount = parseFloat(amount) || 0;
    const newAmount = currentAmount + addValue;
    setAmount(String(newAmount));
  };

  const handleAddCash = async () => {
    const amountNum = Number(amount);
    if (!amount) {
      showSnackbar({ message: "Please enter an amount.", type: "error" });
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      showSnackbar({
        message: "Amount must be greater than 0.",
        type: "error",
      });
      return;
    }
    const isAuth = await authenticateUser();
    if (!isAuth) {
      showSnackbar({
        message: "Authentication required to add cash.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const result = await mockAddCash(amountNum);
    setLoading(false);
    if (result.success) {
      setBalance((prev) => (prev ?? 0) + amountNum);
      setAmount("");
      showSnackbar({
        message: `Demo top-up successful: ₹${amountNum}`,
        type: "success",
      });
    } else {
      showSnackbar({ message: "Failed to add cash.", type: "error" });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={DarkBgPNG}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <BackArrow width={moderateScale(28)} height={moderateScale(28)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ADD MONEY</Text>{" "}
          {/* Title Changed */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={navigateToQR}
            hitSlop={8}
          >
            <BarcodeIcon width={moderateScale(24)} height={moderateScale(24)} />
          </TouchableOpacity>
          <View pointerEvents="none" style={styles.headerUnderline} />
        </View>

        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Main Card */}
          <View style={[styles.svgPanelWrap, { width: cardWidth }]}>
            <Image
              source={AddSendPNG}
              style={{
                width: cardWidth,
                height: height * 0.35,
                position: "absolute",
                resizeMode: "contain",
              }}
            />
            <View style={styles.panelContent} pointerEvents="box-none">
              <Text style={styles.recipientName} numberOfLines={1}>
                {name ?? "-"}
              </Text>
              <Text style={styles.recipientUserId} numberOfLines={1}>
                User ID: {user_id ?? "-"}
              </Text>

              <View style={styles.amountInputContainer}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor="#fff8"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  editable={!loading}
                  maxLength={7}
                />
              </View>

              <View style={styles.quickAddContainer}>
                <TouchableOpacity
                  style={styles.quickAddButton}
                  onPress={() => handleQuickAdd(500)}
                  disabled={loading}
                >
                  <View style={styles.quickAddBtnInner}>
                    <Image
                      source={Btn500PNG}
                      style={{
                        width: width * 0.22,
                        height: moderateScale(35),
                        resizeMode: "contain",
                      }}
                    />
                    <Text style={styles.quickAddText}>+ ₹ 500</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickAddButton}
                  onPress={() => handleQuickAdd(1000)}
                  disabled={loading}
                >
                  <View style={styles.quickAddBtnInner}>
                    <Image
                      source={Btn1kPNG}
                      style={{
                        width: width * 0.22,
                        height: moderateScale(35),
                        resizeMode: "contain",
                      }}
                    />
                    <Text style={styles.quickAddText}>+ ₹ 1000</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickAddButton}
                  onPress={() => handleQuickAdd(2000)}
                  disabled={loading}
                >
                  <View style={styles.quickAddBtnInner}>
                    <Image
                      source={Btn2kPNG}
                      style={{
                        width: width * 0.22,
                        height: moderateScale(35),
                        resizeMode: "contain",
                      }}
                    />
                    <Text style={styles.quickAddText}>+ ₹ 2000</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Current Balance */}
          <View style={[styles.balanceContainer, { width: cardWidth }]}>
            <Text style={styles.balanceText}>Current Balance:</Text>
            <Text style={styles.balanceAmount}>
              {balance !== null ? `₹ ${balance}` : "--"}
            </Text>
          </View>

          {loading && !isAuthenticating && (
            <ActivityIndicator
              size="large"
              color="#43a047"
              style={{ marginVertical: vScale(20) }}
            />
          )}

          {isAuthenticating && (
            <Text style={styles.authText}>Authenticating...</Text>
          )}

          {/* Bottom Send Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleAddCash}
            disabled={loading || isAuthenticating}
            activeOpacity={0.7}
          >
            <Image
              source={ClickAddPNG}
              style={{
                width: cardWidth,
                height: moderateScale(55),
                resizeMode: "contain",
              }}
            />
            {/* Centered text overlay */}
            <View pointerEvents="none" style={styles.sendButtonTextWrap}>
              <Text style={styles.sendButtonText}>CLICK TO ADD</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AddCashPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: getStatusBarHeight(),
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
    paddingHorizontal: moderateScale(12),
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: moderateScale(25),
    color: "#fff",
    flex: 1,
    textAlign: "center",
    letterSpacing: 1,
    fontFamily: "The Last Shuriken",
  },
  headerIconButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
    alignItems: "center",
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
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  svgPanelWrap: {
    width: width * 0.9,
    height: height * 0.35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    paddingBottom: vScale(30),
    position: "relative",
  },
  svgCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  panelContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: vScale(3),
    paddingHorizontal: moderateScale(15),
  },
  recipientName: {
    color: "#fff",
    fontSize: moderateScale(24),
    fontFamily: "Quattrocento Sans",
    fontWeight: "700",
    textAlign: "center",
    paddingTop: vScale(24),
  },
  recipientUserId: {
    color: "#fff",
    fontSize: moderateScale(18),
    // marginTop: -20,
    // marginLeft: -20,
    marginRight: moderateScale(10),
    paddingTop: vScale(2),
    fontFamily: "Quattrocento Sans",
    fontWeight: "700",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2, // slightly thicker underline
    borderBottomColor: "#fff",
    paddingBottom: vScale(6),
    marginVertical: vScale(8),
    marginBottom: vScale(8),
    marginTop: vScale(2),
    alignSelf: "center", // center the row (and underline) within the panel
  },

  rupeeSymbol: {
    color: "#fff",
    fontSize: moderateScale(34), // match amount input
    fontFamily: "Quattrocento Sans",
    fontWeight: "700",
    marginRight: moderateScale(6),
    padding: 0,
    marginTop: vScale(8),
    marginLeft: -hScale(6), // nudge rupee slightly to the left
  },

  amountInput: {
    color: "#fff",
    fontSize: moderateScale(34),
    minWidth: moderateScale(120),
    maxWidth: moderateScale(200),
    textAlign: "left",
    padding: 0,
    marginTop: vScale(9),
    fontFamily: "Quattrocento Sans",
    fontWeight: "700",
  },
  quickAddContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: moderateScale(10),
    paddingBottom: vScale(4),
    paddingTop: 0,
    marginTop: 0,
  },
  quickAddButton: {
    // Wrapper for touchable
  },
  quickAddBtnInner: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  quickAddText: {
    position: "absolute",
    color: "#FFFFFF",
    fontSize: moderateScale(14),
    fontFamily: "Quattrocento Sans",
    fontWeight: "700",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.85, // Match card width
    marginTop: -vScale(6), // shift slightly up
    paddingHorizontal: moderateScale(2),
    paddingVertical: 0,
    marginBottom: vScale(20),
    paddingBottom: vScale(10),
    opacity: 0.9,
  },
  balanceText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontFamily: "Quattrocento Sans",
  },
  balanceAmount: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontFamily: "Quattrocento Sans",
  },
  authText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "Quattrocento Sans",
    marginVertical: vScale(20),
  },
  sendButton: {
    marginTop: "auto", // Pushes to bottom of KeyboardAvoidingView
    marginBottom: vScale(40),
    alignItems: "center",
    position: "relative",
  },
  sendButtonTextWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontFamily: "The Last Shuriken",
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

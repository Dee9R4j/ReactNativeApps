import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Dimensions } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getStatusBarHeight } from "../../../../../utils/safeArea";


import { getWalletBalance, transferMoney, getUserByQR } from "@/api/wallet.api";
import { simulateNetworkDelay } from "@/api/dummyData";
import { useAuth } from "@/hooks/useAuthentication";
import BackArrow from "@assets/images/wallet/back-arrow.svg";
import BarcodeIcon from "@assets/images/wallet/barcode-icon.svg";
import AddSendPNG from "@assets/images/wallet/addsendfpng.png";
import { useQRNavigation } from "@/hooks/useQRNavigation";
import Btn500PNG from "@assets/images/wallet/50012final.png";
import Btn1kPNG from "@assets/images/wallet/50012final.png";
import Btn2kPNG from "@assets/images/wallet/50012final.png";
import ClickSendPNG from "@assets/images/wallet/buyaddbuttonplainpng.png";
import DarkBgPNG from "@assets/images/wallet/darkbgpng.png";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
// Scaling helpers (match addCash/wallet)
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

async function transferAmount({
  amount,
  qr_code,
}: {
  amount: number;
  qr_code: string;
}) {
  try {
    const result = await transferMoney({ to_user_id: 0, amount });
    if (!result.success) {
      return { success: false, errorMessage: result.errorMessage || "Transfer failed" };
    }
    console.log("[Mock] Transfer:", amount, "via QR:", qr_code);
    return { success: true, data: result.data };
  } catch (error: any) {
    return {
      success: false,
      errorMessage: error?.message || "Transfer failed",
    };
  }
}

export default function TransferPage() {
  const { showSnackbar } = useSnackbar();
  const [transferModal, setTransferModal] = useState(false);
  const [transferAmountValue, setTransferAmountValue] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const [scannedQR, setScannedQR] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [balance, setBalance] = useState<number | null>(null);
  // Match addCash selectors
  // Recipient info resolved from scanned QR via backend
  const [recipientName, setRecipientName] = useState<string>("-");
  const [recipientId, setRecipientId] = useState<string | number>("-");
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const scanAreaSize = Math.min(windowWidth * 0.7, 300);
  // Slightly move the scan area and helper text upward
  const scanOffsetUp = 24;
  const scanAreaTop = windowHeight / 2 - scanAreaSize / 2 - scanOffsetUp;
  const router = useRouter();
  const { isAuthenticating, authenticateUser } = useAuth();
  const navigateToQR = useQRNavigation();
  console.log(showQR);
  useFocusEffect(
    React.useCallback(() => {
      setShowQR(true);
      setScannedQR(null);
      setTransferAmountValue("");
      setTransferModal(false);
      // No navigation event listener, only router navigation
    }, [])
  );

  useEffect(() => {
    if (showQR && permission?.granted === false) {
      requestPermission();
    }
  }, [showQR, permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowQR(false);
    setScannedQR(data);
    setTransferModal(false);
  };

  // Fetch balance similar to addCash when in post-scan screen
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

  useEffect(() => {
    let active = true;
    if (!showQR) {
      (async () => {
        const result = await getBalance();
        if (!active) return;
        if (result.success) {
          const total = (result.data as any)?.total ?? null;
          setBalance(typeof total === "number" ? total : Number(total) || 0);
        }
      })();
    }
    return () => {
      active = false;
    };
  }, [showQR]);

  // After scan, fetch recipient info using mock API
  useEffect(() => {
    let cancelled = false;
    const fetchRecipient = async () => {
      if (showQR || !scannedQR) return;
      console.log("req made", scannedQR);
      try {
        const result = await getUserByQR(scannedQR);
        const data = result?.data;
        console.log("Recipient data:", data);
        if (!cancelled && data?.user_id && data?.name) {
          setRecipientId(data.user_id);
          setRecipientName(String(data.name));
        } else if (!cancelled) {
          setRecipientId("-");
          setRecipientName("-");
          showSnackbar({ message: "ID not found", type: "error" });
        }
      } catch (error: any) {
        if (!cancelled) {
          setRecipientId("-");
          setRecipientName("-");
          showSnackbar({ message: "ID not found", type: "error" });
        }
      }
    };
    fetchRecipient();
    return () => {
      cancelled = true;
    };
  }, [showQR]);

  const handleQuickAdd = (addValue: number) => {
    const currentAmount = parseFloat(transferAmountValue) || 0;
    const newAmount = currentAmount + addValue;
    setTransferAmountValue(String(newAmount));
  };

  const handleTransfer = async () => {
    const amountNum = Number(transferAmountValue);
    if (!scannedQR || !transferAmountValue) {
      showSnackbar({ message: "Please scan a QR code and enter an amount.", type: "error" })
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      showSnackbar({ message: "Amount must be greater than 0.", type: "error" })

      return;
    }
    // Authenticate user before making the transfer request
    const isAuth = await authenticateUser();
    if (!isAuth) {
      showSnackbar({ message: "Authentication required to make transfer.", type: "error" })
      setTransferModal(false);
      setShowQR(true); // Show QR scanner again if auth fails/cancelled
      return;
    }
    setTransferring(true);
    const result = await transferAmount({
      amount: amountNum,
      qr_code: scannedQR,
    });
    setTransferring(false);
    if (result.success) {
      showSnackbar({ message: "Transfer successful!", type: "error" })
      setTransferModal(false);
      setScannedQR(null);
      setTransferAmountValue("");
      setShowQR(false);
      router.back();
    } else {
      showSnackbar({ message: result.errorMessage || "Transfer failed.", type: "error" })
    }
  };

  // Render QR scanner directly as the main page
  if (showQR) {
    return (
      <SafeAreaView
        style={[styles.qrSafeArea, { paddingTop: getStatusBarHeight() }]}
      >
        {/* Unified header to match wallet screens */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerIconButton}
            onPress={() => {
              setShowQR(false);
              router.back();
            }}
            hitSlop={8}
          >
            <BackArrow width={28} height={28} />
          </Pressable>
          <Text style={styles.headerTitle}>SEND MONEY</Text>
          {/* Placeholder to center title */}
          <View style={styles.headerIconButton} />
        </View>
        {permission?.granted ? (
          <View style={styles.qrCameraContainer}>
            <CameraView
              style={{ flex: 1 }}
              onBarcodeScanned={handleBarCodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />
            {/* Fullscreen overlay except QR box */}
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              {/* Top mask */}
              <View
                style={{
                  width: windowWidth,
                  height: Math.max(scanAreaTop - 100, 0),
                  backgroundColor: "rgba(0,0,0,0.8)",
                }}
              />
              {/* Center row: left mask, box, right mask */}
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: (windowWidth - scanAreaSize) / 2,
                    height: scanAreaSize,
                    backgroundColor: "rgba(0,0,0,0.8)",
                  }}
                />
                {/* Scan area with corner guides */}
                <View
                  style={[
                    styles.qrBox,
                    { width: scanAreaSize, height: scanAreaSize },
                  ]}
                >
                  {/* Top-left corner */}
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTLV]} />
                  {/* Top-right corner */}
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerTRV]} />
                  {/* Bottom-left corner */}
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBLV]} />
                  {/* Bottom-right corner */}
                  <View style={[styles.corner, styles.cornerBR]} />
                  <View style={[styles.corner, styles.cornerBRV]} />
                </View>
                <View
                  style={{
                    width: (windowWidth - scanAreaSize) / 2,
                    height: scanAreaSize,
                    backgroundColor: "rgba(0,0,0,0.8)",
                  }}
                />
              </View>
              {/* Helper text below the scan box */}
              <Text
                style={{
                  position: "absolute",
                  // Slightly closer to the box
                  top: scanAreaTop + scanAreaSize - 8,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: "Quattrocento Sans Bold",
                  // Make sure it's rendered above the dark overlay masks
                  zIndex: 30,
                  elevation: 30,
                }}
              >
                Scan someone's QR to transfer the money
              </Text>
              {/* Bottom mask */}
              <View
                style={{
                  width: windowWidth,
                  height: windowHeight - scanAreaTop - scanAreaSize,
                  backgroundColor: "rgba(0,0,0,0.8)",
                }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.qrPermissionContainer}>
            <Text style={styles.qrPermissionText}>
              Camera permission required.
            </Text>
            <Button title="Grant Permission" onPress={requestPermission} />
          </View>
        )}
      </SafeAreaView>
    );
  }

  // After QR scan, show send-money screen with same layout as addCash
  const contentPadding = Math.round(windowWidth * 0.07);
  const cardWidth = windowWidth - contentPadding * 2;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={DarkBgPNG}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerIconButton}
            onPress={() => {
              setShowQR(false);
              router.back();
            }}
            hitSlop={8}
          >
            <BackArrow width={moderateScale(28)} height={moderateScale(28)} />
          </Pressable>
          <Text style={styles.headerTitle}>SEND MONEY</Text>
          <Pressable
            style={styles.headerIconButton}
            onPress={navigateToQR}
            hitSlop={8}
          >
            <BarcodeIcon width={moderateScale(24)} height={moderateScale(24)} />
          </Pressable>
          <View pointerEvents="none" style={styles.headerUnderline} />
        </View>

        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Main Card */}
          <View
            style={[
              styles.svgPanelWrap,
              { width: cardWidth, height: windowHeight * 0.35 },
            ]}
          >
            <Image
              source={AddSendPNG}
              style={{
                width: cardWidth,
                height: windowHeight * 0.35,
                position: "absolute",
                resizeMode: "contain",
              }}
            />
            <View style={styles.panelContent} pointerEvents="box-none">
              <Text style={styles.recipientName} numberOfLines={1}>
                {recipientName}
              </Text>
              <Text style={styles.recipientUserId} numberOfLines={1}>
                User ID: {recipientId}
              </Text>

              <View style={styles.amountInputContainer}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor="#fff8"
                  keyboardType="numeric"
                  value={transferAmountValue}
                  onChangeText={setTransferAmountValue}
                  editable={!transferring}
                  maxLength={7}
                />
              </View>

              <View style={styles.quickAddContainer}>
                <Pressable
                  style={styles.quickAddButton}
                  onPress={() => handleQuickAdd(500)}
                  disabled={transferring}
                >
                  <View style={styles.quickAddBtnInner}>
                    <Image
                      source={Btn500PNG}
                      style={{
                        width: windowWidth * 0.22,
                        height: moderateScale(35),
                        resizeMode: "contain",
                      }}
                    />
                    <Text style={styles.quickAddText}>+ ₹ 500</Text>
                  </View>
                </Pressable>
                <Pressable
                  style={styles.quickAddButton}
                  onPress={() => handleQuickAdd(1000)}
                  disabled={transferring}
                >
                  <View style={styles.quickAddBtnInner}>
                    <Image
                      source={Btn1kPNG}
                      style={{
                        width: windowWidth * 0.22,
                        height: moderateScale(35),
                        resizeMode: "contain",
                      }}
                    />
                    <Text style={styles.quickAddText}>+ ₹ 1000</Text>
                  </View>
                </Pressable>
                <Pressable
                  style={styles.quickAddButton}
                  onPress={() => handleQuickAdd(2000)}
                  disabled={transferring}
                >
                  <View style={styles.quickAddBtnInner}>
                    <Image
                      source={Btn2kPNG}
                      style={{
                        width: windowWidth * 0.22,
                        height: moderateScale(35),
                        resizeMode: "contain",
                      }}
                    />
                    <Text style={styles.quickAddText}>+ ₹ 2000</Text>
                  </View>
                </Pressable>
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

          {transferring && (
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
          <Pressable
            style={styles.sendButton}
            onPress={handleTransfer}
            disabled={transferring}
          >
            <Image
              source={ClickSendPNG}
              style={{
                width: cardWidth,
                height: moderateScale(55),
                resizeMode: "contain",
              }}
            />
            {/* Centered text overlay to match Add Money button styling */}
            <View pointerEvents="none" style={styles.sendButtonTextWrap}>
              <Text style={styles.sendButtonText}>CLICK TO SEND</Text>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

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
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: vScale(12),
    paddingHorizontal: moderateScale(12),
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
    fontFamily: "The Last Shuriken",
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
  qrSafeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  qrModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  qrBackButton: {
    padding: 4,
  },
  qrTitle: {
    color: "#fff",
    textAlign: "center",
    marginRight: 19,
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  qrCameraContainer: {
    flex: 1,
  },
  qrPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrPermissionText: {
    color: "#fff",
  },
  // Reused from addCash
  svgPanelWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    paddingBottom: vScale(30),
    position: "relative",
  },
  panelContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: vScale(2),
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
    marginTop: "auto",
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

  amountFullScreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: "rgba(17,17,17,0.98)",
    justifyContent: "center",
    alignItems: "center",
  },
  amountModalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: 300,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 16,
    fontSize: 18,
    color: "#222",
    backgroundColor: "#f9f9f9",
  },
  qrBox: {
    position: "relative",
    borderWidth: 0,
    backgroundColor: "transparent",
    zIndex: 20,
  },
  corner: {
    position: "absolute",
    backgroundColor: "#fff",
  },
  // Horizontal corners (length x thickness)
  cornerTL: { top: 0, left: 0, width: 28, height: 3 },
  cornerTR: { top: 0, right: 0, width: 28, height: 3 },
  cornerBL: { bottom: 0, left: 0, width: 28, height: 3 },
  cornerBR: { bottom: 0, right: 0, width: 28, height: 3 },
  // Vertical corners (thickness x length)
  cornerTLV: { top: 0, left: 0, width: 3, height: 28 },
  cornerTRV: { top: 0, right: 0, width: 3, height: 28 },
  cornerBLV: { bottom: 0, left: 0, width: 3, height: 28 },
  cornerBRV: { bottom: 0, right: 0, width: 3, height: 28 },
});

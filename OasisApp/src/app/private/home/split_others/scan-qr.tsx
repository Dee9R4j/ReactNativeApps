import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Button,
  Share,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { generateFriendRequestUrl as genFriendUrl, qrAddFriend } from "@/api/split.api";
import Clipboard from "@react-native-clipboard/clipboard";
import { useSnackbar } from "@/utils/contextprovider/SnackbarProvider";
// Icons for copy/share will be from Ionicons

export default function ScanAddFriendQR() {
  const [showQR, setShowQR] = useState(true);
  const {showSnackbar} = useSnackbar();
  const [scannedQR, setScannedQR] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const scanAreaSize = Math.min(windowWidth * 0.7, 300);
  // Nudge the scan box and content slightly upward so the screen doesn't feel bottom-heavy
  const scanOffsetUp = 24;
  const scanAreaTop = windowHeight / 2 - scanAreaSize / 2 - scanOffsetUp;
  const router = useRouter();

  useEffect(() => {
    setShowQR(true);
    setScannedQR(null);
    // Generate the share link at screen start
    void (async () => {
      try {
        const result = await genFriendUrl();
        const link: string | undefined = result?.data?.url;
        if (link) {
          setShareLink(link);
        } else {
          setShareLink(null);
        }
      } catch (err: any) {
        setShareLink(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (showQR && permission?.granted === false) {
      requestPermission();
    }
  }, [showQR, permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowQR(false);
    setScannedQR(data);
    console.log("Scanned QR Code:", data);
    void sendQrToServer(data);
  };

  const sendQrToServer = async (qrcode: string) => {
    try {
      const result = await qrAddFriend(qrcode);
      showSnackbar({ message: result?.data?.message ?? "Friend request processed", type: "success" });
    } catch (err: any) {
      console.error("QR add friend failed", err);
      showSnackbar({ message: err?.message ?? "Failed to add friend via QR", type: "error" });
    } finally {
      router.back();
    }
  };

  const generateAndShareLink = async () => {
    // Do not re-request; just share the link generated at screen start
    if (!shareLink) {
      showSnackbar({ message: "Link not ready. Try again in a moment", type: "error" });
      return;
      return;
    }
    try {
      await Share.share({ message: shareLink, url: shareLink });
    } catch (e: any) {
      showSnackbar({ message: "Failed to open share dialog", type: "error" });
    }
  };

  if (showQR) {
    return (
      <SafeAreaView style={styles.qrSafeArea}>
        <View style={styles.qrModalHeader}>
          <Pressable
            style={styles.qrBackButton}
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.qrTitle}>Scan Friend's QR Code</Text>
          <View style={styles.qrBackButton} />
        </View>
        {permission?.granted ? (
          <>
            <View style={styles.qrCameraContainer}>
              <CameraView
                style={{ flex: 1 }}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              />
              <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <View
                  style={{
                    width: windowWidth,
                    height: scanAreaTop - 100,
                    backgroundColor: "rgba(0,0,0,0.8)",
                  }}
                />
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: (windowWidth - scanAreaSize) / 2,
                      height: scanAreaSize,
                      backgroundColor: "rgba(0,0,0,0.8)",
                    }}
                  />
                  <View
                    style={[
                      styles.qrBox,
                      { width: scanAreaSize, height: scanAreaSize },
                    ]}
                  />
                  <View
                    style={{
                      width: (windowWidth - scanAreaSize) / 2,
                      height: scanAreaSize,
                      backgroundColor: "rgba(0,0,0,0.8)",
                    }}
                  />
                </View>
                <View
                  style={{
                    width: windowWidth,
                    height: windowHeight - scanAreaTop - scanAreaSize,
                    backgroundColor: "rgba(0,0,0,0.8)",
                  }}
                />
              </View>
            </View>
            {/* Footer: instructions + OR + link box with copy/share */}
            <FooterInvite
              link={shareLink}
              onCopy={async () => {
                if (!shareLink) return;
                Clipboard.setString(shareLink);
                showSnackbar({ message: "Link copied", type: "success" });
              }}
              onShare={generateAndShareLink}
            />
          </>
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

  return (
    <SafeAreaView style={styles.qrSafeArea}>
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" color="#56A8E8" />
      </View>
    </SafeAreaView>
  );
}

type FooterInviteProps = {
  link: string | null;
  onCopy: () => void;
  onShare: () => void;
};

const FooterInvite: React.FC<FooterInviteProps> = ({
  link,
  onCopy,
  onShare,
}) => {
  const display = useMemo(() => {
    if (!link) return "(loading...)";
    return link.length > 28 ? `${link.slice(0, 28)}...` : link;
  }, [link]);

  const disabled = !link;

  return (
    <View style={styles.inviteContainer}>
      <Text style={styles.inviteTitle}>
        Scan someone’s QR to invite them to this split.
      </Text>
      <View style={styles.inviteOrRow}>
        <View style={styles.inviteLine} />
        <Text style={styles.inviteOrText}>OR</Text>
        <View style={styles.inviteLine} />
      </View>
      <Text style={styles.inviteSub}>Share invite link instead:</Text>

      <View style={styles.linkBox}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.linkText}>
          {display}
        </Text>
        <View style={styles.linkActions}>
          <TouchableOpacity
            onPress={onCopy}
            disabled={disabled}
            style={styles.iconBtn}
          >
            <Ionicons name="copy-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onShare}
            disabled={disabled}
            style={[styles.iconBtn, { marginLeft: 8 }]}
          >
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  qrSafeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  qrModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
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
  inviteContainer: {
    paddingVertical: 50,
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.6)",
    marginTop: -20,
  },
  inviteTitle: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  inviteOrRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  inviteLine: {
    height: 1,
    backgroundColor: "#aaa",
    width: 80,
    opacity: 0.8,
  },
  inviteOrText: {
    color: "#fff",
    marginHorizontal: 12,
    fontSize: 14,
  },
  inviteSub: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  linkBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    justifyContent: "space-between",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  linkActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  qrPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  qrPermissionText: {
    color: "#fff",
  },
  qrBox: {
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "transparent",
    zIndex: 20,
  },
});

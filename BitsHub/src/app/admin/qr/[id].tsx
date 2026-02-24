import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const LOADING_ANIMATION = require("../../../../assets/rives/loading.json");
const SUCCESS_ANIMATION = require("../../../../assets/rives/Green_tick.json");
const FAILED_ANIMATION = require("../../../../assets/rives/Sad_Failed.json");

type ValidationState = "confirm" | "processing" | "success" | "failed";

export default function QRScanner() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [validationState, setValidationState] =
    useState<ValidationState | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: any) => {
    if (scanned) return;
    setScanned(true);
    setScannedData(String(data ?? ""));
    setValidationState("confirm");
  };

  const closeModalAndReset = () => {
    setValidationState(null);
    setScanned(false);
    setScannedData("");
  };

  const handleValidate = () => {
    setValidationState("processing");

    setTimeout(() => {
      const expectedEventId = String(id ?? "");
      const isValid = scannedData.includes(expectedEventId);
      setValidationState(isValid ? "success" : "failed");
    }, 1200);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Ticket</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.scannerFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.instruction}>
            Align QR code within the frame to validate ticket.
          </Text>
        </View>
      </View>

      <Modal
        visible={validationState !== null}
        transparent
        animationType="fade"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {validationState === "confirm" && (
              <>
                <Text style={styles.modalTitle}>Ticket Scanned</Text>
                <Text style={styles.modalText}>Event ID: {String(id)}</Text>
                <Text style={styles.modalText} numberOfLines={3}>
                  Data: {scannedData}
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={closeModalAndReset}
                  >
                    <Text style={styles.cancelButtonText}>Discard</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={handleValidate}
                  >
                    <Text style={styles.confirmButtonText}>Admit User</Text>
                  </Pressable>
                </View>
              </>
            )}

            {validationState === "processing" && (
              <>
                <LottieView
                  source={LOADING_ANIMATION}
                  autoPlay
                  loop
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Validating...</Text>
              </>
            )}

            {validationState === "success" && (
              <>
                <LottieView
                  source={SUCCESS_ANIMATION}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>User Admitted</Text>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.confirmButton,
                    styles.singleAction,
                  ]}
                  onPress={closeModalAndReset}
                >
                  <Text style={styles.confirmButtonText}>Scan Next</Text>
                </Pressable>
              </>
            )}

            {validationState === "failed" && (
              <>
                <LottieView
                  source={FAILED_ANIMATION}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Validation Failed</Text>
                <Text style={styles.modalText}>
                  QR does not match this event.
                </Text>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.cancelButton,
                    styles.singleAction,
                  ]}
                  onPress={closeModalAndReset}
                >
                  <Text style={styles.cancelButtonText}>Try Again</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A001A",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingBottom: 20,
  },
  backBtn: { width: 48, height: 48, justifyContent: "center" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  scannerFrame: {
    width: 250,
    height: 250,
    alignSelf: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#00F0FF",
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  footer: {
    padding: 30,
    backgroundColor: "rgba(0,0,0,0.8)",
    alignItems: "center",
  },
  instruction: { color: "#fff", fontSize: 16, textAlign: "center" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#0E002B",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#1F005B",
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  modalText: {
    color: "#BCBCBC",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
  modalActions: {
    marginTop: 18,
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#F44336",
    backgroundColor: "rgba(244,67,54,0.12)",
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: "#5B5CE2",
    backgroundColor: "rgba(91,92,226,0.25)",
  },
  cancelButtonText: {
    color: "#F44336",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  singleAction: {
    width: "100%",
    marginTop: 16,
  },
  animation: {
    width: 170,
    height: 170,
  },
});

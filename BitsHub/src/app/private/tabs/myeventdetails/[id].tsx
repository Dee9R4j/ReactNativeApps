import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFastStore } from "@/state/fast/fast";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { GLOW } from "@/utils/common";
import LottieView from "lottie-react-native";

const DELETE_ANIMATION = require("../../../../../assets/rives/Delete_message.json");
const LOADING_ANIMATION = require("../../../../../assets/rives/loading.json");
const SUCCESS_ANIMATION = require("../../../../../assets/rives/Green_tick.json");
const FAILED_ANIMATION = require("../../../../../assets/rives/Sad_Failed.json");

type CancelState = "confirm" | "processing" | "success" | "failed";

export default function MyEventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const myBookings = useFastStore((state) => state.myBookings);
  const cancelTicket = useFastStore((state) => state.cancelTicket);

  const [cancelling, setCancelling] = useState(false);
  const [cancelState, setCancelState] = useState<CancelState | null>(null);

  const booking = useMemo(
    () => myBookings.find((b: any) => b.id === id),
    [id, myBookings],
  );

  useEffect(() => {
    if (!booking) {
      router.replace("/private/tabs/myevents");
    }
  }, [booking, router]);

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff", fontFamily: "Manrope-Regular" }}>
          Booking not found or cancelled.
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => router.replace("/private/tabs/myevents")}
        >
          <Text
            style={{ color: "#5B5CE2", fontFamily: "Manrope-SemiBold-600" }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCancel = () => {
    setCancelState("confirm");
  };

  const closeCancelModal = () => {
    const wasSuccess = cancelState === "success";
    setCancelState(null);
    if (wasSuccess) router.replace("/private/tabs/myevents");
  };

  const confirmCancelBooking = async () => {
    setCancelState("processing");
    setCancelling(true);
    try {
      await cancelTicket(booking.id);
      setCancelState("success");
    } catch (err) {
      setCancelState("failed");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>
        {/* Glow background */}
        <View style={styles.glowWrapper}>
          <Image source={GLOW} style={styles.glowImage} resizeMode="cover" />
        </View>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ticket Details</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.ticketCard}>
            <Text style={styles.eventIdText}>Event ID: {booking.event_id}</Text>
            <Text style={styles.slotText}>
              Slot ID: {booking.slot_id} | Type ID: {booking.ticket_type_id}
            </Text>
            <Text style={styles.qtyText}>Quantity: {booking.quantity}</Text>

            <View style={styles.qrContainer}>
              <QRCode
                value={booking.qrCode}
                size={200}
                backgroundColor="transparent"
                color="#fff"
              />
              <Text style={styles.qrLabel}>{booking.qrCode}</Text>
            </View>

            <Text
              style={[
                styles.statusText,
                booking.status === "CONFIRMED"
                  ? styles.confirmed
                  : styles.cancelled,
              ]}
            >
              STATUS: {booking.status}
            </Text>
          </View>

          {booking.status === "CONFIRMED" && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.cancelBtnText}>Cancel Booking</Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <Modal visible={cancelState !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {cancelState === "confirm" && (
              <>
                <LottieView
                  source={DELETE_ANIMATION}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Cancel Booking?</Text>
                <Text style={styles.modalText}>
                  This action cannot be undone.
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={closeCancelModal}
                  >
                    <Text style={styles.confirmButtonText}>No</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={confirmCancelBooking}
                  >
                    <Text style={styles.cancelButtonText}>Yes, Cancel</Text>
                  </Pressable>
                </View>
              </>
            )}

            {cancelState === "processing" && (
              <>
                <LottieView
                  source={LOADING_ANIMATION}
                  autoPlay
                  loop
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Cancelling Booking...</Text>
              </>
            )}

            {cancelState === "success" && (
              <>
                <LottieView
                  source={SUCCESS_ANIMATION}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Booking Cancelled</Text>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.confirmButton,
                    styles.singleAction,
                  ]}
                  onPress={closeCancelModal}
                >
                  <Text style={styles.confirmButtonText}>Done</Text>
                </Pressable>
              </>
            )}

            {cancelState === "failed" && (
              <>
                <LottieView
                  source={FAILED_ANIMATION}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Cancellation Failed</Text>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.cancelButton,
                    styles.singleAction,
                  ]}
                  onPress={closeCancelModal}
                >
                  <Text style={styles.cancelButtonText}>Try Again</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#3F4295",
  },
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  glowWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
  },
  glowImage: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Manrope-SemiBold-600",
  },
  content: { padding: 20, alignItems: "center", zIndex: 1 },
  ticketCard: {
    backgroundColor: "#0E002B",
    width: "100%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1F005B",
    shadowColor: "rgba(14, 0, 43, 0.75)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  eventIdText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "Manrope-Bold",
  },
  slotText: {
    color: "#BCBCBC",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "Manrope-Regular",
  },
  qtyText: {
    color: "#5B5CE2",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    fontFamily: "Manrope-SemiBold-600",
  },
  qrContainer: {
    padding: 20,
    backgroundColor: "rgba(31, 0, 91, 0.5)",
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#1F005B",
  },
  qrLabel: {
    color: "#BCBCBC",
    fontSize: 12,
    marginTop: 12,
    fontFamily: "Manrope-Regular",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Manrope-SemiBold-600",
  },
  confirmed: { color: "#4CAF50" },
  cancelled: { color: "#F44336" },
  cancelBtn: {
    marginTop: 40,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderWidth: 1,
    borderColor: "#F44336",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Manrope-SemiBold-600",
  },
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
    borderWidth: 1,
  },
  cancelButton: {
    borderColor: "#F44336",
    backgroundColor: "rgba(244,67,54,0.12)",
  },
  confirmButton: {
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

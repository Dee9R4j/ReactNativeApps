import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mockApi } from "@/api/mockAdapter";
import { useFastStore } from "@/state/fast/fast";
import { useSecureStore } from "@/state/secure/secure";
import { Ionicons } from "@expo/vector-icons";
import { GLOW } from "@/utils/common";
import { r_h, r_w } from "@/utils/responsive";
import LottieView from "lottie-react-native";

const LOADING_ANIMATION = require("../../../../../assets/rives/loading.json");
const SUCCESS_ANIMATION = require("../../../../../assets/rives/Green_tick.json");
const FAILED_ANIMATION = require("../../../../../assets/rives/Sad_Failed.json");

type BookingState = "processing" | "success" | "failed";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const userId = useSecureStore((state) => state.userID);
  const buyTicket = useFastStore((state) => state.buyTicket);

  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tickets, setTickets] = useState(1);

  useEffect(() => {
    mockApi
      .getEventDetails(Number(id))
      .then((res) => {
        setEventData(res.data);
        if (res.data.slots?.length > 0) setSelectedSlot(res.data.slots[0]);
        if (res.data.ticketTypes?.length > 0)
          setSelectedTicket(res.data.ticketTypes[0]);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Error", "Could not load event details.");
        router.back();
      });
  }, [id]);

  const handleBuy = async () => {
    if (!selectedSlot || !selectedTicket) return;

    setBookingState("processing");
    setBuying(true);
    try {
      await buyTicket(
        userId!,
        eventData.id,
        selectedSlot.id,
        selectedTicket.id,
        tickets,
      );
      setBookingState("success");
    } catch (err) {
      setBookingState("failed");
    } finally {
      setBuying(false);
    }
  };

  const closeBookingModal = () => {
    const wasSuccess = bookingState === "success";
    setBookingState(null);
    if (wasSuccess) router.back();
  };

  if (loading || !eventData) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

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

        {/* Back button */}
        <View style={styles.backHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{eventData.title}</Text>
          <Text style={styles.subtitle}>XYZ Club</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText} numberOfLines={3}>
              {eventData.description}
            </Text>
          </View>

          {/* Dates */}
          {eventData.slots?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Date</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateContainer}
              >
                {eventData.slots.map((slot: any) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.dateButton,
                      selectedSlot?.id === slot.id && styles.dateButtonSelected,
                    ]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        selectedSlot?.id === slot.id && styles.dateTextSelected,
                      ]}
                    >
                      {slot.dateString || `Slot ${slot.id}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Ticket Type */}
          {eventData.ticketTypes?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Ticket Type</Text>
              <View style={styles.optionsContainer}>
                {eventData.ticketTypes.map((ticket: any) => (
                  <TouchableOpacity
                    key={ticket.id}
                    style={[
                      styles.dropdown,
                      selectedTicket?.id === ticket.id && {
                        borderColor: "#5B5CE2",
                      },
                    ]}
                    onPress={() => setSelectedTicket(ticket)}
                  >
                    <View style={styles.dropdownLeft}>
                      <Ionicons name="ticket-outline" size={24} color="#fff" />
                      <Text style={styles.dropdownValue}>{ticket.name}</Text>
                    </View>
                    <Text style={styles.dropdownPrice}>
                      {ticket.price === 0 ? "Free" : `₹${ticket.price}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Ticket Counter */}
          <View style={styles.ticketCounterRow}>
            <Text style={[styles.sectionTitle, { marginVertical: 0 }]}>
              Number of tickets
            </Text>
            <View style={styles.ticketCounter}>
              <TouchableOpacity
                onPress={() => setTickets(Math.max(1, tickets - 1))}
              >
                <Text style={styles.counterButton}>−</Text>
              </TouchableOpacity>
              <Text style={styles.ticketText}>{tickets}</Text>
              <TouchableOpacity onPress={() => setTickets(tickets + 1)}>
                <Text style={styles.counterButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Book Now */}
          <TouchableOpacity
            style={[
              styles.bookNow,
              (!selectedTicket || !selectedSlot || buying) &&
                styles.bookNowDisabled,
            ]}
            onPress={handleBuy}
            disabled={!selectedTicket || !selectedSlot || buying}
          >
            {buying ? (
              <View style={styles.bookNowLoadingContainer}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <Text
                style={[
                  styles.bookNowText,
                  (!selectedTicket || !selectedSlot) &&
                    styles.bookNowTextDisabled,
                ]}
              >
                Book Now
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      <Modal visible={bookingState !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {bookingState === "processing" && (
              <>
                <LottieView
                  source={LOADING_ANIMATION}
                  autoPlay
                  loop
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Booking Ticket...</Text>
              </>
            )}

            {bookingState === "success" && (
              <>
                <LottieView
                  source={SUCCESS_ANIMATION}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Ticket Booked</Text>
                <Pressable
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={closeBookingModal}
                >
                  <Text style={styles.confirmButtonText}>Done</Text>
                </Pressable>
              </>
            )}

            {bookingState === "failed" && (
              <>
                <LottieView
                  source={FAILED_ANIMATION}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
                <Text style={styles.modalTitle}>Booking Failed</Text>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeBookingModal}
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
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  containerCenter: {
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
  backHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Manrope-SemiBold-600",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Manrope-Light-300",
    fontWeight: "400",
    lineHeight: 22,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 12,
    color: "#BCBCBC",
    lineHeight: 22,
    textAlign: "center",
    fontFamily: "Manrope-Light-300",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Manrope-SemiBold-600",
    marginVertical: 10,
  },
  dateContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5B5CE2",
    marginRight: 10,
  },
  dateButtonSelected: {
    backgroundColor: "#5B5CE2",
  },
  dateText: {
    color: "#fff",
  },
  dateTextSelected: {
    color: "#fff",
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0E002B",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#1F005B",
  },
  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownValue: {
    color: "white",
    marginLeft: 10,
  },
  dropdownPrice: {
    color: "white",
    fontSize: 16,
  },
  ticketCounterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  ticketCounter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0E002B",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#1F005B",
  },
  counterButton: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
    paddingHorizontal: 8,
  },
  ticketText: {
    fontSize: 22,
    color: "#fff",
    marginHorizontal: 12,
    fontWeight: "bold",
  },
  bookNow: {
    backgroundColor: "#5B5CE2",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginVertical: 20,
  },
  bookNowDisabled: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#5B5CE2",
  },
  bookNowText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  bookNowTextDisabled: {
    color: "#5B5CE2",
  },
  bookNowLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  animation: {
    width: 170,
    height: 170,
  },
  modalButton: {
    width: "100%",
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
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
});

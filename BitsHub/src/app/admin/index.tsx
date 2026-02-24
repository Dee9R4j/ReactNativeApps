import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSecureStore } from "@/state/secure/secure";
import { useFastStore } from "@/state/fast/fast";
import { Ionicons } from "@expo/vector-icons";
import { BACKGROUND_IMAGE } from "@/utils/common";
import CustomSwitch from "@/components/Switch";
import NextIcon from "@assets/icons/next_icon.svg";
import { r_h, r_w } from "@/utils/responsive";

export default function AdminDashboard() {
  const router = useRouter();
  const logOut = useSecureStore((state) => state.logOut);
  const events = useFastStore((state) => state.events);
  const fetchEvents = useFastStore((state) => state.fetchEvents);
  const toggleEventActive = useFastStore((state) => state.toggleEventActive);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={styles.container}
        imageStyle={{ opacity: 0.15 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin</Text>
          <TouchableOpacity
            onPress={() => {
              logOut();
              router.replace("/login/authentication");
            }}
          >
            <Ionicons name="log-out-outline" size={28} color="#FF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Scan Ticket Card */}
          <TouchableOpacity
            style={styles.scanCard}
            onPress={() => router.push("/admin/qr/selectevent")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="qr-code-outline" size={28} color="#fff" />
              <Text style={styles.scanCardText}>Scan Ticket</Text>
            </View>
            <NextIcon color="#fff" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Manage Events</Text>

          {events.map((event: any) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventRow}
              onPress={() => router.push(`/admin/manage/${event.id}`)}
            >
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventSubtitle}>{event.venue || "Event"}</Text>
              </View>
              <View style={styles.rowControls}>
                <CustomSwitch
                  active={event.isActive !== false}
                  activeColor="#5B5CE2"
                  inactiveColor="#333"
                  thumbColor="#fff"
                  onToggle={(val) => toggleEventActive(event.id, val)}
                />
                <NextIcon color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#090013",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Manrope-SemiBold-600",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0E002B",
    borderRadius: r_h(12),
    paddingVertical: r_h(20),
    paddingHorizontal: r_w(20),
    marginBottom: r_h(24),
    borderWidth: 1.5,
    borderColor: "#1F005B",
    shadowColor: "rgba(14, 0, 43, 0.75)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  scanCardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Manrope-Bold",
    marginLeft: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "Manrope-SemiBold-600",
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0E002B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#1F005B",
  },
  eventInfo: { flex: 1, marginRight: 10 },
  eventTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Manrope-Bold",
  },
  eventSubtitle: {
    color: "#BCBCBC",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Manrope-Regular",
  },
  rowControls: { flexDirection: "row", alignItems: "center", gap: 15 },
});

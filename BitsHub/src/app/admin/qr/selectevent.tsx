import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useFastStore } from "@/state/fast/fast";
import { Ionicons } from "@expo/vector-icons";

export default function SelectEventForQR() {
  const router = useRouter();
  const events = useFastStore((state) => state.events);
  const fetchEvents = useFastStore((state) => state.fetchEvents);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Event to Scan</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {events.map((event: any) => (
          <TouchableOpacity 
            key={event.id}
            style={styles.eventCard}
            onPress={() => router.push(`/admin/qr/${event.id}`)}
          >
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.row}>
              <Ionicons name="scan-outline" size={20} color="#00F0FF" />
              <Text style={styles.scanText}>Start Scanning</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A001A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "rgba(10, 0, 26, 0.9)",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  content: { padding: 20 },
  eventCard: {
    backgroundColor: "#1A0033",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", flex: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  scanText: { color: "#00F0FF", fontWeight: "600" }
});

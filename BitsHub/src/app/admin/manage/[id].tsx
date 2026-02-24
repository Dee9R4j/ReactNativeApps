import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFastStore } from "@/state/fast/fast";
import { Ionicons } from "@expo/vector-icons";

export default function ManageEvent() {
  const { id } = useLocalSearchParams();
  const isNew = id === "new";
  const router = useRouter();

  const events = useFastStore((state) => state.events);
  const createEvent = useFastStore((state) => state.createEvent);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [organiser, setOrganiser] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800");

  useEffect(() => {
    if (!isNew) {
      const existing = events.find((e: any) => e.id.toString() === id);
      if (existing) {
        setTitle(existing.title);
        setDescription(existing.description);
        setVenue(existing.venue);
        setOrganiser(existing.organiser);
        setImageUrl(existing.image_url);
      }
    }
  }, [id, isNew, events]);

  const handleSave = async () => {
    if (!title || !description || !venue) {
      Alert.alert("Error", "Please fill required fields (Title, Description, Venue).");
      return;
    }

    try {
      if (isNew) {
        await createEvent({
          title,
          description,
          venue,
          organiser: organiser || "Admin",
          image_url: imageUrl,
        });
        Alert.alert("Success", "Event created successfully");
      } else {
        Alert.alert("Notice", "Edit functionality mock triggered.");
      }
      router.back();
    } catch (err) {
      Alert.alert("Error", "Could not save event.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isNew ? "Create Event" : "Edit Event"}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Event Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" placeholderTextColor="#888" />

        <Text style={styles.label}>Description *</Text>
        <TextInput 
          style={[styles.input, { height: 100 }]} 
          value={description} 
          onChangeText={setDescription} 
          multiline 
          placeholder="Enter description" 
          placeholderTextColor="#888" 
        />

        <Text style={styles.label}>Venue *</Text>
        <TextInput style={styles.input} value={venue} onChangeText={setVenue} placeholder="Enter venue" placeholderTextColor="#888" />

        <Text style={styles.label}>Organiser</Text>
        <TextInput style={styles.input} value={organiser} onChangeText={setOrganiser} placeholder="e.g. Cultural Council" placeholderTextColor="#888" />

        <Text style={styles.label}>Image URL</Text>
        <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." placeholderTextColor="#888" />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Event</Text>
        </TouchableOpacity>
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
  label: { color: "#aaa", marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: 15,
    color: "#fff",
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: "#00F0FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnText: { color: "#0A001A", fontSize: 16, fontWeight: "bold" },
});

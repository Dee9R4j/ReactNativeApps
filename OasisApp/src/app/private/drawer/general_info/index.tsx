import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import { getStatusBarHeight } from "@/utils/safeArea";
import ScreenHeader from "@/components/ScreenHeader";

const { width, height } = Dimensions.get("window");

// --- Data Arrays (Updated with Actual Data) ---
const medicalContacts = [
  "Ishaan Sinha : 7903461322",
  "Shuchita Mishra : 9045005475",
  "Pranav Arya : 9620639296",
];

const medicalCenterHours = [
  "Weekdays (Morning): 8:00 AM - 12:00 PM",
  "Weekdays (Evening): 5:00 PM - 7:00 PM",
  "Sunday (Morning): 9:00 AM - 10:20 AM",
];

const specialistAvailability = [
  "ENT: Monday & Thursday, 5:30 PM - 7:00 PM",
  "Homeopathy: Tuesday, 5:30 PM - 6:30 PM",
  "Pediatrics: Wednesday, 5:00 PM - 6:30 PM",
  "Ayurveda: Sunday, 9:00 AM – 10:30 AM",
];

const foodOutlets = [
  "Looters: Open 5:00 PM - 2:00 AM",
  "All Night Canteen (ANC): Open 5:00 PM - 2:00 AM",
  "Food Ministry (FM): Open primarily in the afternoon (closed during mess hours)",
];

const messTimings = [
  "Breakfast: 7:30 AM – 9:00 AM",
  "Lunch: 11:00 AM - 1:45 PM",
  "Dinner: 7:00 PM - 8:45 PM",
];

const otherOutlets = [
  "Institute Canteen (IC): Open until 6:00 PM",
  "Redis (small shops): Open until evening",
  "C'Not: Shops open until 11:00 PM",
  "Akshay Supermarket: Open until 8:00 PM",
];
// --- End Data ---

export default function aboutUs() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@assets/images/common-bg-png.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScreenHeader title="General Info" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Medical Contacts Section */}
          <View style={styles.section}>
            <Text style={styles.title}>Medical Emergency Contacts</Text>
            <View style={styles.listContainer}>
              {medicalContacts.map((contact, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{contact}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Medical Center Hours Section */}
          <View style={styles.section}>
            <Text style={styles.title}>Medical Center Hours</Text>
            <View style={styles.listContainer}>
              {medicalCenterHours.map((hours, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{hours}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Specialist Availability Section */}
          <View style={styles.section}>
            <Text style={styles.title}>Specialist Availability</Text>
            <View style={styles.listContainer}>
              {specialistAvailability.map((specialist, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{specialist}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Mess Timings Section */}
          <View style={styles.section}>
            <Text style={styles.title}>Mess Timings</Text>
            <View style={styles.listContainer}>
              {messTimings.map((timing, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{timing}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Food Outlets Section */}
          <View style={styles.section}>
            <Text style={styles.title}>Food Outlets</Text>
            <View style={styles.listContainer}>
              {foodOutlets.map((outlet, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{outlet}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Other Campus Outlets Section */}
          <View style={styles.section}>
            <Text style={styles.title}>Other Campus Outlets</Text>
            <View style={styles.listContainer}>
              {otherOutlets.map((outlet, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.itemText}>{outlet}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight(),
  },
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // More padding at the bottom
  },
  section: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 15,
    fontFamily: "Proza Libra",
  },
  listContainer: {
    paddingLeft: 10,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  bullet: {
    fontSize: 18,
    color: "#fff",
    marginRight: 10,
    lineHeight: 25,
  },
  itemText: {
    fontSize: 18,
    color: "#fff",
    flex: 1,
    lineHeight: 25,
    fontFamily: "Proza Libra",
  },
});
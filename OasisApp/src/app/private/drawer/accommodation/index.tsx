import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { getStatusBarHeight } from "@/utils/safeArea";
import ScreenHeader from "@/components/ScreenHeader";
import AccomodationCard from "@/components/accomodationCard";
import { getAccommodationInfo } from "@/api/accomodation.api";

export interface AccommodationInfo {
  leader_name: string;
  leader_phone: number;
  bhawan: string;
  room: string;
}
const { width, height } = Dimensions.get("window");

export default function Accommodation() {
  const [accoInfo, setAccoInfo] = useState<AccommodationInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAccommodationInfo();
        setAccoInfo(data);
        console.log("Accommodation Info:", data);
      } catch (error: any) {
        console.error("Error fetching accommodation info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("@assets/images/common-bg-png.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScreenHeader title="Accommodation" showBackButton={true} />

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : accoInfo ? (
            <AccomodationCard
              name={accoInfo.leader_name}
              contact={accoInfo.leader_phone}
              hostel={`${accoInfo.bhawan} ${accoInfo.room}`}
              // location={accoInfo.room}
            />
          ) : (
            <Text style={styles.errorText}>Failed to load accommodation info.</Text>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: getStatusBarHeight(),
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
});

import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  StatusBar,
} from "react-native";
import { getStatusBarHeight } from "@/utils/safeArea";

import SosCard from "@/components/sosCard";
import ScreenHeader from "@/components/ScreenHeader";

export interface AccommodationInfo {
  leader_name: string;
  leader_phone: number;
  bhawan: string;
  room: string;
}
const { width, height } = Dimensions.get("window");

export default function Accommodation() {

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("@assets/images/common-bg-png.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScreenHeader title="Sos" showBackButton={true} />

        <View style={styles.content}>
          <SosCard
            name1={"Ishaan Sinha"}
            contact1={7903461322}
            name2={"Pranav Arya"}
            contact2={9620639296}
            name3={"Nikith Deepthimahanthi"}
            contact3={+916281175567}
          />
        </View>
        </SafeAreaView>
      </ImageBackground>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
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
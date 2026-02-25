import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  Pressable,
} from "react-native";
import { ContactCardProps } from "@/utils/contacts";
import PhoneIcon from "@assets/images/contact/phone.svg";
import MailIcon from "@assets/images/contact/mail.svg";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { GradientBox } from "./GradientBox";
import { r_h, r_w, r_t } from "@utils/responsive";
import { BottomLeft, BottomRight, Star, TopLeft, TopRight } from "@assets/images/contact";
import { ImageBackground } from "expo-image";

export default function DeveloperCard({
  name,
  role,
  phone,
  email,
  image,
}: ContactCardProps) {
  const bgImage = require("@assets/images/contact/bg.png");
  const { showSnackbar } = useSnackbar();

  const handlePress = async (url: string): Promise<void> => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      showSnackbar({
        message: `Can't handle URL: ${url}`,
        type: "error",
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Border corner decorations */}
      <View style={styles.cornerTopLeft}>
        <TopLeft />
      </View>
      <View style={styles.cornerBottomLeft}>
        <BottomLeft />
      </View>
      <View style={styles.cornerTopRight}>
        <TopRight />
      </View>
      <View style={styles.cornerBottomRight}>
        <BottomRight />
      </View>

      {/* Main card */}
      <GradientBox height={r_h(290)} width={r_w(160)} border={0} padding={0}>
        <ImageBackground
          source={require("@assets/images/qr-cloud.png")}
          style={styles.bg}
          contentFit="cover"
        >
          {/* Top image */}
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.image} resizeMode="cover" />
          </View>
          <View style={styles.separator} />
          <Star  style={{ position: "absolute", top: r_h(150), left: r_w(55), zIndex: 2 }} />

          {/* Text and icons */}
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.roleText}>{role}</Text>

            <View style={styles.footer}>
              {/* <Pressable
                style={styles.button}
                onPress={() => handlePress(`tel:${phone}`)}
              >
                <PhoneIcon width={20} height={20} />
              </Pressable> */}
              <Pressable
                style={styles.button}
                onPress={() => handlePress(`mailto:${email}`)}
              >
                <MailIcon width={22} height={22} />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </GradientBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 10,
    
  },
  bg: {
    flex: 1,
    // borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    overflow: "hidden",
    // borderTopLeftRadius: 10,
    // borderTopRightRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  nameText: {
    fontSize: r_t(17),
    fontFamily: "Quattrocento Sans",
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 2,
  },
  roleText: {
    fontSize: r_t(12),
    fontFamily: "Quattrocento Sans",
    color: "#fff",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  // Corner SVG positions
  cornerTopLeft: { position: "absolute", top: r_h(-5), left: r_w(-5), zIndex: 2 },
  cornerBottomLeft: {
    position: "absolute",
    bottom: r_h(-5),
    left: r_w(-5),
    zIndex: 2,
  },
  cornerTopRight: {
    position: "absolute",
    top: r_h(-5),
    right: r_w(-5),
    zIndex: 2,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: r_h(-5),
    right: r_w(-5),
    zIndex: 2,
  },
   separator: {
    // marginVertical: 4,
    height: 1,top:-1,
    backgroundColor: "#E9E9E9",
    width: "100%",
    // backgroundColor: "white",
    alignSelf: "center",
  },
});

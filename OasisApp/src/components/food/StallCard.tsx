import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import { Stall } from "@/utils/food-types";
import Animated from "react-native-reanimated";
import { usePressAnimation } from "@/components/food/foodAnimations";
import StallCardBgSvg from "@assets/images/food/stallcard-bg.svg";
import { r_w, r_h, r_t } from "@/utils/responsive";

interface StallCardProps {
  stall: Stall;
}

const StallCard: React.FC<StallCardProps> = ({ stall }) => {
  // Press animation hook for smooth feedback
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  // Responsive dimensions based on Figma design (393x852)
  const cardWidth = r_w(164);
  const cardHeight = r_h(138);
  const imageHeight = r_h(91);
  console.log(stall.image_url);

  return (
    <Link
      href={{
        pathname: "/private/home/food/stalls/[id]" as any,
        params: {
          id: stall.id,
          name: stall.name,
          location: stall.location,
          imageUrl: stall.image_url,
          imageBackgroundColor: stall.image_background_color || "",
        },
      }}
      asChild
    >
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View
          style={[
            styles.cardContainer,
            { width: cardWidth, height: cardHeight },
            animatedStyle,
          ]}
        >
          <View
            style={[
              styles.imageContainer,
              {
                height: imageHeight,
                backgroundColor: stall.image_background_color || "grey",
              },
            ]}
          >
            <Animated.Image
              source={{                
                uri:
                  stall.image_url && stall.image_url.toLowerCase() !== "none"
                    ? stall.image_url
                    : "https://via.placeholder.com/300x180",
              }}
              style={[
                styles.image,
                {
                  height: imageHeight + r_h(9),                  
                  backgroundColor: stall.image_background_color || "grey",
                  // borderWidth: 2,
                  // borderColor: stall.image_background_color || "grey",
                },
              ]}
              resizeMode="contain"
            />
          </View>

          <StallCardBgSvg
            width={cardWidth}
            height={cardHeight}
            style={styles.cardBackground}
          />

          <View style={styles.nameWrapper} pointerEvents="none">
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {stall.name}
            </Text>
          </View>

          <View style={styles.locationWrapper} pointerEvents="none">
            <Text
              style={styles.location}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {stall.location}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    // color: "green",
    borderWidth: 2,
    // borderColor: "green"
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: r_w(1.5),
    marginTop: r_h(2),
    overflow: "hidden",
    // backgroundColor is applied inline with stall.image_background_color
    // zIndex: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    // overflow: "hidden",
    // borderColor: "yellow",
    // borderWidth: 5,
    // borderWidth: 2,
    // borderColor: "red"
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  nameWrapper: {
    position: "absolute",
    left: r_w(12),
    right: r_w(12),
    bottom: r_h(22),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },
  name: {
    color: "#FFFFFF",
    fontFamily: "Proza Libre Bold",
    fontSize: r_t(13),
    fontWeight: "400",
    lineHeight: r_h(18),
    letterSpacing: 0.6,
    textAlign: "center",
    paddingHorizontal: r_w(8),
  },
  locationWrapper: {
    position: "absolute",
    left: r_w(43),
    right: 0,
    top: r_h(117),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
    width: r_w(80),
  },
  location: {
    color: "#E3E3E3",
    fontFamily: "Cantora One",
    fontSize: r_t(12),
    lineHeight: r_h(16),
    letterSpacing: 0.4,
    textAlign: "center",
    paddingHorizontal: r_w(10),
    paddingVertical: r_h(2),
  },
});

export default StallCard;

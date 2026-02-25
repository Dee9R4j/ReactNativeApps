import { Home } from "@assets/images/events";
import React, { useState, useEffect } from "react";
import { Animated , StyleSheet} from "react-native";
import { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";

export interface AnimatedHomeProps {
  selectedDateId: string;
  tabPositions: Record<string, { x: number; width: number }>;
}

export const AnimatedHome = ({
  selectedDateId,
  tabPositions,
}: AnimatedHomeProps) => {
  const translateX = useSharedValue(0);
  const [homeSvgWidth, setHomeSvgWidth] = useState(0);

  useEffect(() => {
    const position = tabPositions[selectedDateId];
    if (position && homeSvgWidth > 0) {
      const { x, width } = position;
      const tabCenter = x + width / 2;
      const newX = tabCenter - homeSvgWidth / 2;
      translateX.value = withSpring(
        newX,
        { damping: 100, stiffness: 120 }
      );
    }
  }, [selectedDateId, tabPositions, homeSvgWidth, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[styles.homeSvgAnimated, animatedStyle]}
      onLayout={(event) => {
        if (homeSvgWidth === 0) {
          setHomeSvgWidth(event.nativeEvent.layout.width);
        }
      }}
    >
      <Home height={125} />
    </Animated.View>
  );
};


  const styles = StyleSheet.create({
    homeSvgAnimated: {
    position: "absolute",
    left: 0,
    bottom: -10,
    zIndex: 0,
  },
  })
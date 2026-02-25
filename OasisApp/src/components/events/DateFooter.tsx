import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, ScrollView, ActivityIndicator, RefreshControl, Dimensions } from "react-native";
import { DateFooter, Home } from "@assets/images/events";
// import { AnimatedHome } from "./AnimatedHomeSvg";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get("window");

interface EventsDateFooterProps {
    onAnimationComplete: () => void;
    selectedDateId: string;
    setSelectedDateId: React.Dispatch<React.SetStateAction<string>>;
    setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DateItem {
  id: string;
  date: string;
  dateNum: string;
  day?: string;
}


interface AnimatedHomeProps {
  selectedDateId: string;
  tabPositions: Record<string, { x: number; width: number }>;
}

const AnimatedHome = ({
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


const DATE_TABS: DateItem[] = [
  { id: "1", date: "2025-11-07", dateNum: "7", day: "FRI" },
  { id: "2", date: "2025-11-08", dateNum: "8", day: "SAT" },
  { id: "3", date: "2025-11-09", dateNum: "9", day: "SUN" },
  { id: "4", date: "2025-11-10", dateNum: "10", day: "MON" },
  { id: "5", date: "2025-11-11", dateNum: "11", day: "TUE" },
];


const EventsDateFooter: React.FC<EventsDateFooterProps> = (props : EventsDateFooterProps) => {
    const [tabPositions, setTabPositions] = useState<Record<string, { x: number; width: number }>>({});
    return (
        <View style={styles.dateFooter}>
            <DateFooter style={styles.dateBackgroundSvg} width={width } />
            <View style={styles.dateFooterInside}>
                {/* 6. No onAnimationEnd prop passed */}
                <AnimatedHome
                    selectedDateId={props.selectedDateId}
                    tabPositions={tabPositions}
                />
                {DATE_TABS.map((item) => {
                    const isSelected = item.id === props.selectedDateId;
                    return (
                        <Pressable
                            key={item.id}
                            // 7. This is the core logic
                            onPress={() => {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                // Block filtering
                                props.setIsAnimating(true);

                                // Start animation
                                props.setSelectedDateId(item.id);

                                // Manually unblock filtering after 300ms
                                setTimeout(() => {
                                    props.onAnimationComplete(); // This just sets isAnimating(false)
                                }, 300); // Adjust this delay if needed
                            }}
                            style={[styles.dateItem, isSelected && styles.selectedItem]}
                            onLayout={(event) => {
                                const { x, width } = event.nativeEvent.layout;
                                setTabPositions((prev) => ({
                                    ...prev,
                                    [item.id]: { x, width },
                                }));
                            }}
                        >
                            <Text
                                style={[styles.dateText, isSelected && styles.selectedText]}
                            >
                                {item.day}
                            </Text>
                            <Text
                                style={[styles.dateText, isSelected && styles.selectedText]}
                            >
                                {item.dateNum}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dateFooter: {
        flexDirection: "row",
        backgroundColor: "transparent",
        bottom: 0,
        width: "100%",
        alignItems: "center",
        position: "absolute",
        // left: -10,
    },
    dateFooterInside: {
        marginHorizontal: 20,
        flexDirection: "row",
    },
    dateBackgroundSvg: {
        zIndex: 0,
        flex: 1,
        position: "absolute",
        width: "110%",
    },
    dateItem: {
        paddingVertical: 16,
        alignItems: "center",
        flex: 1,
    },
    homeSvgAnimated: {
        position: "absolute",
        left: 0,
        bottom: -10,
        zIndex: 0,
    },
    dateText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "The Last Shuriken",
    },
    selectedText: {
        color: "#230303",
    },
    selectedItem: {},
});

export default EventsDateFooter;

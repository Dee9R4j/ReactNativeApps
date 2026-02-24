import { EventsPage } from "@/utils/helpers";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInLeft,
  FadeOutRight,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import NextIcon from "@assets/icons/next_icon.svg";
import TicketIcon from "@assets/icons/ticket.svg";
import { r_h, r_w } from "@/utils/responsive";

interface proptypes {
  id: number;
  title: string;
  details: string;
  date: Date;
  numberOfTickets: number;
}

export const MyEventsCard = (props: proptypes) => {
  const eventsPage = new EventsPage();
  const scale = useSharedValue(1);

  const animatedstyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      exiting={FadeOutRight.duration(200)}
      entering={FadeInLeft.duration(200)}
    >
      <Animated.View
        style={[{ width: "100%", flex: 1 }, animatedstyles]}
        onTouchStart={() => {
          scale.value = withSpring(0.95);
        }}
        onTouchEnd={() => {
          scale.value = withSpring(1);
        }}
      >
        <Link href={`/private/tabs/myeventdetails/${props.id}` as any} asChild>
          <Pressable style={style.card}>
            <View style={[style.gencard, style.datecard]}>
              <Text style={style.dateText}>
                {String(props.date.getUTCDate()).padStart(2, "0")}/
                {String(props.date.getUTCMonth() + 1).padStart(2, "0")}
              </Text>
              <Text style={style.dateText}>
                {eventsPage
                  .ConvertDayToString(props.date.getUTCDay())
                  ?.slice(0, 3)}
              </Text>
            </View>
            <View style={[style.gencard, style.infocard]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={style.title}>{props.title}</Text>
                  <NextIcon style={{ marginLeft: 8 }} />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <TicketIcon />
                  <Text style={style.numberOfTickets}>
                    {props.numberOfTickets}x
                  </Text>
                </View>
              </View>

              <Text numberOfLines={2} style={style.details}>
                {props.details}
              </Text>
            </View>
          </Pressable>
        </Link>
      </Animated.View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  card: {
    width: "100%",
    height: r_h(97),
    flexDirection: "row",
    gap: r_w(8),
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: r_h(16),
  },
  gencard: {
    shadowColor: "rgba(14, 0, 43, 0.75)",
    shadowOffset: {
      width: r_w(4),
      height: r_h(4),
    },
    shadowRadius: r_h(8),
    elevation: 8,
    shadowOpacity: 1,
    borderRadius: r_h(8),
    backgroundColor: "#0e002b",
    borderStyle: "solid",
    borderColor: "#1F005B",
    borderWidth: r_w(1.5),
  },
  datecard: {
    height: "100%",
    width: r_w(65),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  infocard: {
    height: "100%",
    flex: 1,
    paddingVertical: r_h(15),
    paddingHorizontal: r_w(15),
  },
  dateText: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "Manrope-SemiBold",
    fontWeight: "600",
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Manrope-Bold",
  },
  numberOfTickets: {
    fontSize: 14,
    color: "#BCBCBC",
    fontFamily: "Manrope-Regular",
    fontWeight: "400",
    lineHeight: 16,
  },
  details: {
    fontSize: 12,
    color: "#BCBCBC",
    fontFamily: "Manrope-Regular",
    fontWeight: "400",
    lineHeight: 22,
    maxWidth: 250,
  },
});

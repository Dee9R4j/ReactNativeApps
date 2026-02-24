import { EventsPage } from "@/utils/helpers";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import React from "react";
import Animated, { FadeOutRight, FadeInLeft } from "react-native-reanimated";
import NextIcon from "@assets/icons/next_icon.svg";
import DateCardSVG from "../../../assets/images/DateBox.svg";
import { r_h, r_t, r_w } from "@/utils/responsive";

interface proptypes {
  title: string;
  id: number;
  details: string;
  date: Date;
}

const EventsCard = (props: proptypes) => {
  const eventsPage = new EventsPage();

  const DateCard = () => {
    return (
      <View style={styles.dateContainer}>
        <DateCardSVG
          width={r_w(48)}
          height={r_h(61)}
          style={StyleSheet.absoluteFill}
          opacity={0.75}
        />
        <Text style={[styles.dateText]}>
          {String(props.date.getUTCDate()).padStart(2, "0")}/
          {String(props.date.getUTCMonth() + 1).padStart(2, "0")}
        </Text>
        <Text style={styles.dateText}>
          {eventsPage.ConvertDayToString(props.date.getUTCDay())?.slice(0, 3)}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={{ width: "100%", flex: 1 }}
      exiting={FadeOutRight.duration(100)}
      entering={FadeInLeft.duration(100)}
    >
      <Link href={`/private/tabs/eventdetails/${props.id}` as any} asChild>
        <Pressable style={styles.card}>
          <DateCard />
          <View style={{ marginLeft: 15.95, flex: 1, marginRight: 20 }}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.title}>{props.title}</Text>
              <Pressable
                onPress={() => {}}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NextIcon color={"#ffffff"} />
              </Pressable>
            </View>
            <Text numberOfLines={2} style={styles.details}>
              {props.details.length > 50
                ? props.details.slice(0, 50) + "..."
                : props.details}
            </Text>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "rgba(14, 0, 43, 0.75)",
    shadowOffset: {
      width: r_w(4),
      height: r_h(4),
    },
    shadowRadius: 8,
    elevation: 8,
    shadowOpacity: 1,
    borderRadius: r_h(8),
    backgroundColor: "#0e002b",
    borderStyle: "solid",
    height: r_h(105),
    marginBottom: r_h(16),
    width: "100%",
    flexDirection: "row",
    paddingVertical: r_h(15),
    borderColor: "#1F005B",
    borderWidth: r_w(1.5),
    paddingLeft: r_w(17.95),
  },
  dateContainer: {
    height: r_h(61),
    width: r_w(47.864),
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: r_t(12),
    color: "#fff",
    fontFamily: "Manrope-SemiBold-600",
    fontWeight: "600",
    lineHeight: r_h(16),
  },
  title: {
    fontSize: r_t(17),
    lineHeight: r_h(22),
    fontWeight: "700",
    marginBottom: r_h(4),
    color: "#FFFFFF",
    fontFamily: "Manrope-Bold",
  },
  details: {
    fontSize: r_t(12),
    color: "#BCBCBC",
    fontFamily: "Manrope-Regular",
    fontWeight: "400",
    lineHeight: r_h(22),
    maxWidth: r_w(250),
  },
});

export default EventsCard;

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ImageBackground,
} from "react-native";
import { useFastStore } from "@/state/fast/fast";
import { useSecureStore } from "@/state/secure/secure";
import { MyEventsCard } from "@/components/myevents/MyEventsCard";
import SearchBox from "@/components/SearchBox";
import SortMenu from "@/components/SortMenu";
import AnimatedList from "@/components/events/AnimatedList";
import { IMAGE_BACKGROUND } from "@/utils/common";
import { r_w } from "@/utils/responsive";
import Animated, { FadeIn } from "react-native-reanimated";

interface MyEventItem {
  id: number;
  event: {
    id: number;
    title: string;
    details: string;
  };
  date: string;
  quantity: number;
}

export default function MyEventsScreen() {
  const userId = useSecureStore((state) => state.userID);
  const myBookings = useFastStore((state) => state.myBookings);
  const fetchMyBookings = useFastStore((state) => state.fetchMyBookings);
  const loading = useFastStore((state) => state.loadingBookings);

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("title");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchMyBookings(userId);
    }
  }, [userId]);

  // Map store bookings to display format
  const items: MyEventItem[] = useMemo(() => {
    return myBookings.map((b: any) => ({
      id: b.id,
      event: {
        id: typeof b.event_id === "string" ? parseInt(b.event_id) || 0 : b.event_id || 0,
        title: b.event_title || `Event ${b.event_id}`,
        details: b.event_details || "",
      },
      date: b.booked_at || new Date().toISOString(),
      quantity: b.quantity || 1,
    }));
  }, [myBookings]);

  function sortDisplayList(list: MyEventItem[], mode: string) {
    const sorted = [...list];
    if (mode === "date") {
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (mode === "title") {
      return sorted.sort((a, b) => a.event.title.localeCompare(b.event.title));
    } else if (mode === "reverse") {
      return sorted.sort((a, b) => a.event.title.localeCompare(b.event.title)).reverse();
    }
    return sorted;
  }

  const displayList = useMemo(() => {
    let filtered = items;
    if (search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      filtered = items.filter(
        (item) =>
          item.event.title.toLowerCase().includes(lowerSearch) ||
          item.event.details.toLowerCase().includes(lowerSearch)
      );
    }
    return sortDisplayList(filtered, sortMode);
  }, [search, items, sortMode]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (userId) {
      await fetchMyBookings(userId);
    }
    setRefreshing(false);
  }, [userId, fetchMyBookings]);

  return (
    <ImageBackground
      source={IMAGE_BACKGROUND}
      style={styles.container}
      imageStyle={{ opacity: 0.15 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          gap: r_w(6),
          marginTop: 8,
        }}
      >
        <View style={{ flex: 1, marginLeft: r_w(20) }}>
          <SearchBox
            search={search}
            onSearchChange={setSearch}
            placeholder="Search in your events"
          />
        </View>
        <SortMenu sortMode={sortMode} onSortChange={setSortMode} />
      </View>

      <View style={{ flex: 1, width: "100%" }}>
        <View style={styles.upcomingEvents}>
          <Text style={styles.title}>My Booked Events</Text>
        </View>
        {loading || refreshing ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={"large"} color={"#ffffff"} />
          </View>
        ) : (
          <View style={styles.list}>
            {displayList.length > 0 ? (
              <AnimatedList<MyEventItem>
                refreshing={refreshing}
                onRefresh={onRefresh}
                estimatedSize={97}
                data={displayList}
                renderItem={(item) => (
                  <MyEventsCard
                    id={item.id}
                    title={item.event.title}
                    details={item.event.details}
                    date={new Date(item.date)}
                    numberOfTickets={item.quantity}
                  />
                )}
              />
            ) : (
              <Animated.View
                style={styles.emptyContainer}
                entering={FadeIn.duration(500)}
              >
                <Text style={styles.emptyText}>
                  {search.length > 0
                    ? `No results for "${search}"`
                    : "You have no booked events."}
                </Text>
                <Text style={styles.emptySubText}>
                  {search.length === 0 && "Go to the Events tab to book your first ticket!"}
                </Text>
              </Animated.View>
            )}
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  list: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "flex-start",
    flex: 1,
    marginBottom: 92,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  upcomingEvents: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

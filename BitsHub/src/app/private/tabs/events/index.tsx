import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useFastStore } from "@/state/fast/fast";
import EventsCard from "@/components/events/EventsCard";
import SearchBox from "@/components/SearchBox";
import SortMenu from "@/components/SortMenu";
import AnimatedList from "@/components/events/AnimatedList";
import { IMAGE_BACKGROUND } from "@/utils/common";
import { r_w } from "@/utils/responsive";

interface EventData {
  id: number;
  title: string;
  details: string;
  dates: string[];
  isActive: boolean;
  [key: string]: any;
}

export default function EventsScreen() {
  const events = useFastStore((state) => state.events);
  const fetchEvents = useFastStore((state) => state.fetchEvents);
  const loading = useFastStore((state) => state.loadingEvents);

  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("title");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Map store events to EventData format
  const allEvents: EventData[] = useMemo(() => {
    return events.map((event: any) => ({
      id: event.id,
      title: event.title || event.name || "Untitled Event",
      details: event.details || event.description || "",
      dates: event.dates || (event.event_time ? [event.event_time] : []),
      isActive: event.isActive !== false,
    }));
  }, [events]);

  function SortDisplayList(dl: EventData[], mode: string) {
    const sorted = [...dl];
    if (mode === "date") {
      return sorted.sort((a, b) => {
        const dateA = a.dates && a.dates.length > 0 ? new Date(a.dates[0]) : new Date();
        const dateB = b.dates && b.dates.length > 0 ? new Date(b.dates[0]) : new Date();
        return dateA.getTime() - dateB.getTime();
      });
    } else if (mode === "title") {
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (mode === "reverse") {
      return sorted.sort((a, b) => a.title.localeCompare(b.title)).reverse();
    }
    return sorted;
  }

  const displayList = useMemo(() => {
    let filtered = allEvents;
    if (search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      filtered = allEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(lowerSearch) ||
          event.details.toLowerCase().includes(lowerSearch)
      );
    }
    return SortDisplayList(filtered, sortMode);
  }, [search, allEvents, sortMode]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
    setTimeout(() => setRefreshing(false), 1000);
  }, [fetchEvents]);

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
            placeholder="Search"
          />
        </View>
        <SortMenu sortMode={sortMode} onSortChange={setSortMode} />
      </View>
      <View style={styles.upcomingEvents}>
        <Text style={styles.title}>Upcoming Events</Text>
      </View>
      {loading && allEvents.length === 0 ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <ActivityIndicator size={"large"} color={"#ffffff"} />
        </View>
      ) : (
        <View style={styles.list}>
          <AnimatedList<EventData>
            estimatedSize={105}
            data={displayList}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={(item) => (
              <EventsCard
                id={item.id}
                date={
                  item.dates && item.dates.length > 0
                    ? new Date(item.dates[0])
                    : new Date()
                }
                title={item.title}
                details={item.details}
              />
            )}
          />
        </View>
      )}
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

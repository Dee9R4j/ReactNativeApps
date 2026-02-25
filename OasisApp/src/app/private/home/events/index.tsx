import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ImageBackground,
  Dimensions,

} from "react-native";
import { Event } from "@/utils/events/types";
import { getStatusBarHeight } from "../../../../utils/safeArea"
import EventCard from "@/components/events/EventCard";
import { useBaseStore } from "@/state/base/base";
import {
  PaperBackground,


} from "@assets/images/events";

import { SkiaBorderWrapper } from "@/components/events/CustomBorderView";

import Header from "@/components/events/Header";
import SearchFilterBar from "@/components/events/SearchFilterBar";
import EventsList from "@/components/events/EventsList";
import EventsDateFooter from "@/components/events/DateFooter";
import BlackToTransparentGradient from "@/components/events/Gradient";


export interface DateItem {
  id: string;
  date: string;
  dateNum: string;
  day?: string;
}

// const { width, height } = Dimensions.get("window");

const DATE_TABS: DateItem[] = [
  { id: "1", date: "2025-11-07", dateNum: "7", day: "THU" },
  { id: "2", date: "2025-11-08", dateNum: "8", day: "FRI" },
  { id: "3", date: "2025-11-09", dateNum: "9", day: "SAT" },
  { id: "4", date: "2025-11-10", dateNum: "10", day: "SUN" },
  { id: "5", date: "2025-11-11", dateNum: "11", day: "MON" },
];

export default function Events() {
  const {
    categories,
    events,
    bookmarkedEvents,
    getCategoriesFromAPI,
    getEventsFromAPI,
    getCategoriesFromDB,
    getEventsFromDB,
  } = useBaseStore();


  const getInitialDateId = (): string => {
    const today = new Date().toISOString().split("T")[0];
    const todayTab = DATE_TABS.find(d => d.date === today);
    
    if (todayTab) {
      return todayTab.id; 
    }
    return DATE_TABS[0].id; 
};

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [anyIssues, setAnyIssues] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDateId, setSelectedDateId] = useState<string>(getInitialDateId());
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const onAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    // initialize the data from the database or api
    const initData = async () => {
      if (!isMounted) return;
      setIsLoadingData(true);
      try {
        const dbCategories = await getCategoriesFromDB();
        if (dbCategories.length === 0) await getCategoriesFromAPI();

        const dbEvents = await getEventsFromDB();
        if (dbEvents.length === 0) await getEventsFromAPI();
      } catch (error: any) {
        setAnyIssues(true);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    initData();
    return () => {
      isMounted = false;
    };
  }, []);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([getEventsFromAPI(), getCategoriesFromAPI()]).finally(() => setRefreshing(false));
  }, [getEventsFromAPI, getCategoriesFromAPI]);


  // change this code actually
  const eventsByDate = useMemo(() => {
    const baseEvents = showBookmarks ? bookmarkedEvents ?? [] : events ?? [];

    return baseEvents.reduce((acc: { [key: string]: Event[] }, event) => {
    const date = event.date_time.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  
  }, [events, bookmarkedEvents, showBookmarks]);

// First, memoize the list of events for the selected date.
  // This simplifies the effect hook's dependencies.
  const eventsForSelectedDate = useMemo(() => {
    const selectedDate = DATE_TABS.find((d) => d.id === selectedDateId)?.date;
    return selectedDate ? eventsByDate[selectedDate] || [] : [];
  }, [eventsByDate, selectedDateId]);


  // --- OPTIMIZED useEffect ---
  useEffect(() => {
    if (isLoadingData || isAnimating) return;

    const searchTerm = search.trim().toLowerCase();
    const hasSearchTerm = searchTerm !== "";

    // 2. Prepare category Set for O(1) lookups
    const categorySet = new Set(selectedCategories);
    const hasCategories = categorySet.size > 0;
    // ---------------------

    const result = eventsForSelectedDate.filter((event) => {
      // 1. Category check (now much faster)
      if (hasCategories) {
        // Find if *any* of the event's categories are in our Set
        const hasMatch = event.categories.some((c) => categorySet.has(c));
        if (!hasMatch) return false;
      }

      // 2. Search check (uses pre-calculated term)
      if (hasSearchTerm) {
        if (
          !event.name.toLowerCase().includes(searchTerm) &&
          !event.organiser.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // 3. If it passed both checks, include it
      return true;
    });

    requestAnimationFrame(() => {
      setDisplayedEvents(result);
      // setIsFiltering(false);
    });

  }, [
    isAnimating,
    eventsForSelectedDate, // Now depends on the memoized list
    selectedCategories, 
    search, 
    isLoadingData
  ]);

  const renderEventItem = useCallback(
    ({ item }: { item: Event }) => (
      <SkiaBorderWrapper>
        <EventCard
          id={item.id}
          title={item.name}
          organizer={item.organiser}
          description={item.description}
          venue={item.venue_name}
          live={item.is_live}
          date={item.date_time}
          bookmark={item.bookmark}
        />
      </SkiaBorderWrapper>
    ),
    []
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={0}>
      <SafeAreaView style={styles.container}>
        <PaperBackground
                    width="100%"
                    height="100%"
                    style={styles.paperBackground}
                    preserveAspectRatio="none"
                />

        <Header setShowBookmarks={setShowBookmarks} showBookmarks={showBookmarks} bookmarkedEvents={bookmarkedEvents} />
        <SearchFilterBar
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          filterVisible={filterVisible}
          setFilterVisible={setFilterVisible}
          search={search}
          setSearch={setSearch}
          showBookmarks={showBookmarks}
          setShowBookmarks={setShowBookmarks}
        />
        <BlackToTransparentGradient />
        <EventsList
          isLoadingData={isLoadingData}
          displayedEvents={displayedEvents}
          isFiltering={isFiltering}
          renderEventItem={renderEventItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          anyIssues={anyIssues}
        />
        <EventsDateFooter
          onAnimationComplete={onAnimationComplete}
          selectedDateId={selectedDateId}
          setSelectedDateId={setSelectedDateId}
          setIsAnimating={setIsAnimating}
        />

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000",
    backgroundColor: "transparent",
    paddingTop: getStatusBarHeight(),
  },
  paperBackground: {
    position: "absolute",
    opacity: 0.8,
  },
  // backgroundImage: {
  //   width: width,
  //   height: height,
  // },


});
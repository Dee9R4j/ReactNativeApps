import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Event } from "@/utils/events/types";
import { EventsError } from "@assets/images/events";
import BlackToTransparentGradient from "./Gradient";

interface EventsListProps {
  isLoadingData: boolean;
  displayedEvents: Event[];
  isFiltering: boolean;
  renderEventItem: ({ item }: { item: Event }) => React.ReactElement;
  refreshing: boolean;
  onRefresh: () => void;
  anyIssues: boolean;
}

const EventsList: React.FC<EventsListProps> = ({
  onRefresh,
  isLoadingData,
  displayedEvents,
  isFiltering,
  renderEventItem,
  refreshing,
  anyIssues,
}) => {

  const [showTopGradient, setShowTopGradient] = useState(false);

  return (
    <View style={styles.contentBox}>
      {anyIssues ?
        (
          <View style={styles.loaderContainer}>
            <EventsError />
            <Text>Error loading events</Text>
          </View>
        ) :
        isLoadingData ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#524e4e" />
          </View>
        ) : (
          <>
            {showTopGradient && <BlackToTransparentGradient height={60} />}

            {/* <BlackToTransparentGradient /> */}
            <FlashList
              onScroll={(event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                setShowTopGradient(offsetY > 5); // Show gradient after small scroll
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
              estimatedItemSize={185}
              data={displayedEvents}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyExtractor={(item: Event) => item.id.toString()}
              renderItem={renderEventItem}
              ListEmptyComponent={
                !isFiltering ? (
                  <View style={styles.loaderContainer}>
                    <Text>No events found.</Text>
                  </View>
                ) : null
              }
            />

            {isFiltering && (
              <View style={styles.filteringOverlay}>
                <ActivityIndicator size="large" color="#E8E7E7" />
              </View>
            )}
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentBox: {
    flex: 1,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filteringOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});

export default EventsList;

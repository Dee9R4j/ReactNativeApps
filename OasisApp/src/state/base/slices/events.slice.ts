/**
 * Events slice — fetches events and categories from mock API
 */
import type { StateCreator } from "zustand";
import type { FestEvent } from "@/models/events.models";
import {
  MOCK_EVENTS,
  MOCK_EVENT_CATEGORIES,
  simulateNetworkDelay,
} from "@/api/dummyData";

export interface EventsSlice {
  events: FestEvent[];
  categories: string[];
  bookmarkedEvents: FestEvent[];
  isLoadingEvents: boolean;
  eventsError: string | null;

  getCategoriesFromAPI: () => Promise<string[]>;
  getEventsFromAPI: () => Promise<FestEvent[]>;
  getCategoriesFromDB: () => Promise<string[]>;
  getEventsFromDB: () => Promise<FestEvent[]>;
  toggleBookmark: (eventId: number) => void;
}

export const createEventsSlice: StateCreator<
  EventsSlice,
  [],
  [],
  EventsSlice
> = (set, get) => ({
  events: [],
  categories: [],
  bookmarkedEvents: [],
  isLoadingEvents: false,
  eventsError: null,

  getCategoriesFromAPI: async () => {
    await simulateNetworkDelay(100, 300);
    const cats = MOCK_EVENT_CATEGORIES;
    set({ categories: cats });
    return cats;
  },

  getEventsFromAPI: async () => {
    set({ isLoadingEvents: true });
    await simulateNetworkDelay();
    const evts = MOCK_EVENTS as FestEvent[];
    set({ events: evts, isLoadingEvents: false });
    return evts;
  },

  getCategoriesFromDB: async () => {
    const cats = get().categories.length > 0 ? get().categories : MOCK_EVENT_CATEGORIES;
    set({ categories: cats });
    return cats;
  },

  getEventsFromDB: async () => {
    const { events } = get();
    if (events.length > 0) return events;
    set({ events: MOCK_EVENTS as FestEvent[] });
    return MOCK_EVENTS as FestEvent[];
  },

  toggleBookmark: (eventId: number) => {
    const { events, bookmarkedEvents } = get();
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    const isBookmarked = bookmarkedEvents.some((e) => e.id === eventId);
    if (isBookmarked) {
      set({
        bookmarkedEvents: bookmarkedEvents.filter((e) => e.id !== eventId),
        events: events.map((e) =>
          e.id === eventId ? { ...e, bookmark: false } : e,
        ),
      });
    } else {
      set({
        bookmarkedEvents: [...bookmarkedEvents, { ...event, bookmark: true }],
        events: events.map((e) =>
          e.id === eventId ? { ...e, bookmark: true } : e,
        ),
      });
    }
  },
});

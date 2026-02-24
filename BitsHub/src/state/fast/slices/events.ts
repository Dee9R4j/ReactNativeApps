import { StateCreator } from "zustand";
import { mockApi } from "@/api/mockAdapter";

export interface IEventsData {
  events: any[];
  myBookings: any[];
  loadingEvents: boolean;
  loadingBookings: boolean;
}

export interface IEventsSlice extends IEventsData {
  fetchEvents: () => Promise<void>;
  fetchMyBookings: (userId: string) => Promise<void>;
  buyTicket: (userId: string, eventId: number, slotId: number, ticketTypeId: number, quantity: number) => Promise<any>;
  cancelTicket: (bookingId: string) => Promise<void>;
  createEvent: (eventData: any) => Promise<void>;
  toggleEventActive: (eventId: number, isActive: boolean) => Promise<void>;
}

export const EventsSlice: StateCreator<any, [], [], IEventsSlice> = (set, get) => ({
  events: [],
  myBookings: [],
  loadingEvents: false,
  loadingBookings: false,

  fetchEvents: async () => {
    set({ loadingEvents: true });
    try {
      const response = await mockApi.getEvents();
      if (response.success) {
        set({ events: response.data });
      }
    } finally {
      set({ loadingEvents: false });
    }
  },

  fetchMyBookings: async (userId: string) => {
    set({ loadingBookings: true });
    try {
      const response = await mockApi.getMyBookings(userId);
      if (response.success) {
        set({ myBookings: response.data });
      }
    } finally {
      set({ loadingBookings: false });
    }
  },

  buyTicket: async (userId, eventId, slotId, ticketTypeId, quantity) => {
    const response = await mockApi.buyTicket(userId, eventId, slotId, ticketTypeId, quantity);
    if (response.success) {
      await get().fetchMyBookings(userId);
      return response.data;
    }
    throw new Error("Failed to buy ticket");
  },

  cancelTicket: async (bookingId) => {
    const response = await mockApi.cancelTicket(bookingId);
    if (response.success) {
      const { myBookings } = get();
      // Update local state by removing the cancelled booking
      set({
        myBookings: myBookings.filter((b: any) => b.id !== bookingId),
      });
    }
  },

  createEvent: async (eventData) => {
    const response = await mockApi.createEvent(eventData);
    if (response.success) {
      await get().fetchEvents();
    }
  },

  toggleEventActive: async (eventId, isActive) => {
    const response = await mockApi.toggleEventActivity(eventId, isActive);
    if (response.success) {
      await get().fetchEvents();
    }
  }
});

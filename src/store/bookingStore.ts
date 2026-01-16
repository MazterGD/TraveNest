import { create } from "zustand";
import type { Booking, BookingStatus, PaymentStatus } from "@/types";

// Extended booking with additional display info
export interface BookingWithDetails extends Booking {
  vehicleName: string;
  vehicleImage?: string;
  ownerName: string;
  ownerPhone: string;
  driverName?: string;
  driverPhone?: string;
  // Additional display fields
  dropoffLocation?: {
    address: string;
    city?: string;
    district?: string;
  };
  hasReview?: boolean;
}

interface BookingState {
  bookings: BookingWithDetails[];
  activeBooking: BookingWithDetails | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Filters
  statusFilter: "all" | BookingStatus;
  dateFilter: "all" | "upcoming" | "past";

  // Actions
  setBookings: (bookings: BookingWithDetails[]) => void;
  addBooking: (booking: BookingWithDetails) => void;
  updateBooking: (id: string, updates: Partial<BookingWithDetails>) => void;
  setActiveBooking: (booking: BookingWithDetails | null) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStatusFilter: (filter: BookingState["statusFilter"]) => void;
  setDateFilter: (filter: BookingState["dateFilter"]) => void;

  // Computed helpers
  getUpcomingBookings: () => BookingWithDetails[];
  getPastBookings: () => BookingWithDetails[];

  reset: () => void;
}

const initialState = {
  bookings: [],
  activeBooking: null,
  isLoading: false,
  error: null,
  statusFilter: "all" as const,
  dateFilter: "all" as const,
};

export const useBookingStore = create<BookingState>()((set, get) => ({
  ...initialState,

  setBookings: (bookings) => set({ bookings }),

  addBooking: (booking) =>
    set((state) => ({ bookings: [booking, ...state.bookings] })),

  updateBooking: (id, updates) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),

  setActiveBooking: (activeBooking) => set({ activeBooking }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setStatusFilter: (statusFilter) => set({ statusFilter }),

  setDateFilter: (dateFilter) => set({ dateFilter }),

  getUpcomingBookings: () => {
    const { bookings } = get();
    const now = new Date();
    return bookings.filter((b) => new Date(b.startDate) > now);
  },

  getPastBookings: () => {
    const { bookings } = get();
    const now = new Date();
    return bookings.filter((b) => new Date(b.endDate) < now);
  },

  reset: () => set(initialState),
}));

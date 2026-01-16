"use client";

import { useCallback } from "react";
import { useBookingStore, type BookingWithDetails } from "@/store";
import { api } from "@/lib/api";
import type { BookingStatus, PaymentStatus } from "@/types";

export function useBookings() {
  const {
    bookings,
    activeBooking,
    isLoading,
    error,
    statusFilter,
    dateFilter,
    setBookings,
    addBooking,
    updateBooking,
    setActiveBooking,
    setLoading,
    setError,
    setStatusFilter,
    setDateFilter,
    getUpcomingBookings,
    getPastBookings,
  } = useBookingStore();

  // Fetch user's bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<BookingWithDetails[]>("/bookings");
      setBookings(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [setBookings, setLoading, setError]);

  // Get single booking details
  const fetchBookingDetails = useCallback(
    async (bookingId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<BookingWithDetails>(
          `/bookings/${bookingId}`
        );
        setActiveBooking(response);
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch booking"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setActiveBooking, setLoading, setError]
  );

  // Cancel a booking
  const cancelBooking = useCallback(
    async (bookingId: string, reason?: string) => {
      setLoading(true);
      try {
        await api.post(`/bookings/${bookingId}/cancel`, { reason });
        updateBooking(bookingId, { status: "cancelled" as BookingStatus });
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to cancel booking";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [updateBooking, setLoading, setError]
  );

  // Process payment for a booking
  const processPayment = useCallback(
    async (
      bookingId: string,
      paymentData: { method: string; amount: number }
    ) => {
      setLoading(true);
      try {
        const response = await api.post<{
          paymentId: string;
          status: PaymentStatus;
        }>(`/bookings/${bookingId}/pay`, paymentData);
        updateBooking(bookingId, {
          paymentStatus: response.status,
          status: "confirmed" as BookingStatus,
        });
        return { success: true, paymentId: response.paymentId };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [updateBooking, setLoading, setError]
  );

  // Request booking modification
  const requestModification = useCallback(
    async (
      bookingId: string,
      modifications: {
        newStartDate?: string;
        newEndDate?: string;
        additionalNotes?: string;
      }
    ) => {
      setLoading(true);
      try {
        await api.post(`/bookings/${bookingId}/modify`, modifications);
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Modification request failed";
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  // Filter bookings based on current filters
  const filteredBookings = bookings.filter((booking) => {
    // Status filter
    if (statusFilter !== "all" && booking.status !== statusFilter) {
      return false;
    }

    // Date filter
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    if (dateFilter === "upcoming" && startDate <= now) return false;
    if (dateFilter === "past" && endDate >= now) return false;

    return true;
  });

  return {
    // State
    bookings: filteredBookings,
    allBookings: bookings,
    activeBooking,
    upcomingBookings: getUpcomingBookings(),
    pastBookings: getPastBookings(),
    isLoading,
    error,
    statusFilter,
    dateFilter,

    // Actions
    fetchBookings,
    fetchBookingDetails,
    cancelBooking,
    processPayment,
    requestModification,
    setActiveBooking,
    setStatusFilter,
    setDateFilter,
  };
}

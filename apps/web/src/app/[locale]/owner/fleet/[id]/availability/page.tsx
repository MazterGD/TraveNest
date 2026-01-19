"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui";
import { useAuthStore } from "@/store";
import { useOwnerGuard } from "@/hooks";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaBan,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

interface BlockedDate {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  notes?: string;
}

export default function VehicleAvailabilityPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuthStore();
  const { isLoading: guardLoading, isAuthorized } = useOwnerGuard();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [blockNotes, setBlockNotes] = useState("");

  // Mock data - replace with API
  const vehicle = {
    id: params.id,
    registration: "WP KA-1234",
    type: "Luxury Coach",
  };

  const blockedDates: BlockedDate[] = [
    {
      id: "1",
      startDate: "2026-01-25",
      endDate: "2026-01-27",
      reason: "Maintenance",
      notes: "Annual service",
    },
  ];

  const bookings = [
    {
      id: "1",
      startDate: "2026-01-22",
      endDate: "2026-01-23",
      customer: "ABC Tours",
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return blockedDates.some((block) => {
      return dateStr >= block.startDate && dateStr <= block.endDate;
    });
  };

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return bookings.some((booking) => {
      return dateStr >= booking.startDate && dateStr <= booking.endDate;
    });
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(
      (d) => d.toISOString().split("T")[0] === date.toISOString().split("T")[0],
    );
  };

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date)) return; // Can't modify booked dates

    if (isDateSelected(date)) {
      setSelectedDates(
        selectedDates.filter((d) => d.getTime() !== date.getTime()),
      );
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleBlockDates = () => {
    if (selectedDates.length === 0) return;
    setShowBlockModal(true);
  };

  const confirmBlock = () => {
    // TODO: API call to block dates
    console.log({
      dates: selectedDates,
      reason: blockReason,
      notes: blockNotes,
    });
    setShowBlockModal(false);
    setSelectedDates([]);
    setBlockReason("");
    setBlockNotes("");
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(selectedMonth);

  if (guardLoading || !isAuthorized || !user) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
            <Link
              href={`/owner/fleet/${params.id}`}
              className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Vehicle
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Availability Calendar
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  {vehicle.registration} • {vehicle.type}
                </p>
              </div>
              {selectedDates.length > 0 && (
                <button
                  onClick={handleBlockDates}
                  className="flex items-center gap-2 rounded-lg bg-[#20B0E9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a8fc4]"
                >
                  <FaBan className="h-4 w-4" />
                  Block {selectedDates.length} Date
                  {selectedDates.length > 1 && "s"}
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                {/* Month Navigation */}
                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setSelectedMonth(
                        new Date(
                          selectedMonth.getFullYear(),
                          selectedMonth.getMonth() - 1,
                        ),
                      )
                    }
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    <FaArrowLeft className="h-4 w-4" />
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                  <button
                    onClick={() =>
                      setSelectedMonth(
                        new Date(
                          selectedMonth.getFullYear(),
                          selectedMonth.getMonth() + 1,
                        ),
                      )
                    }
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    <FaArrowLeft className="h-4 w-4 rotate-180" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="mb-6">
                  {/* Weekday headers */}
                  <div className="mb-2 grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      ),
                    )}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(year, month, day);
                      const isBooked = isDateBooked(date);
                      const isBlocked = isDateBlocked(date);
                      const isSelected = isDateSelected(date);
                      const isPast =
                        date < new Date(new Date().setHours(0, 0, 0, 0));

                      return (
                        <button
                          key={day}
                          onClick={() => !isPast && handleDateClick(date)}
                          disabled={isPast || isBooked}
                          className={`aspect-square rounded-lg border-2 text-sm font-medium transition-all ${
                            isPast
                              ? "cursor-not-allowed border-transparent bg-gray-50 text-gray-300"
                              : isBooked
                                ? "cursor-not-allowed border-red-200 bg-red-50 text-red-700"
                                : isBlocked
                                  ? "border-gray-300 bg-gray-100 text-gray-600"
                                  : isSelected
                                    ? "border-[#20B0E9] bg-[#20B0E9] text-white"
                                    : "border-transparent bg-white text-gray-900 hover:border-[#20B0E9]"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-[#20B0E9] bg-[#20B0E9]" />
                    <span className="text-gray-600">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-red-200 bg-red-50" />
                    <span className="text-gray-600">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-gray-300 bg-gray-100" />
                    <span className="text-gray-600">Blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded border-2 border-transparent bg-white" />
                    <span className="text-gray-600">Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructions */}
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="mb-3 font-semibold text-gray-900">How to Use</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Click dates to select multiple days</li>
                  <li>• Click "Block Dates" to make them unavailable</li>
                  <li>• Booked dates cannot be modified</li>
                  <li>• Past dates are automatically disabled</li>
                </ul>
              </div>

              {/* Blocked Periods */}
              {blockedDates.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <h3 className="mb-4 font-semibold text-gray-900">
                    Blocked Periods
                  </h3>
                  <div className="space-y-3">
                    {blockedDates.map((block) => (
                      <div
                        key={block.id}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            {block.reason}
                          </div>
                          <button className="text-gray-400 transition-colors hover:text-red-600">
                            <FaTimes className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(block.startDate).toLocaleDateString()} -{" "}
                          {new Date(block.endDate).toLocaleDateString()}
                        </div>
                        {block.notes && (
                          <div className="mt-2 text-xs text-gray-500">
                            {block.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Bookings */}
              {bookings.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <h3 className="mb-4 font-semibold text-gray-900">
                    Upcoming Bookings
                  </h3>
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <div className="mb-1 text-sm font-medium text-gray-900">
                          {booking.customer}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(booking.startDate).toLocaleDateString()} -{" "}
                          {new Date(booking.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Block Dates Modal */}
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Block Selected Dates
              </h3>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reason *
                </label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-[#20B0E9] focus:outline-none focus:ring-2 focus:ring-[#20B0E9]/20"
                >
                  <option value="">Select reason</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Personal Use">Personal Use</option>
                  <option value="Repairs">Repairs</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any additional notes..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-[#20B0E9] focus:outline-none focus:ring-2 focus:ring-[#20B0E9]/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBlock}
                  disabled={!blockReason}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#20B0E9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a8fc4] disabled:opacity-50"
                >
                  <FaCheck className="h-4 w-4" />
                  Confirm Block
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

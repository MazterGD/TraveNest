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
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaDollarSign,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaFileExport,
  FaBus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useParams } from "next/navigation";

type BookingStatus = "upcoming" | "in-progress" | "completed" | "cancelled";
type PaymentStatus = "pending" | "partial" | "paid" | "refunded";

interface Booking {
  id: string;
  bookingRef: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    organization?: string;
  };
  vehicle: {
    registration: string;
    type: string;
  };
  trip: {
    startDate: string;
    endDate: string;
    route: string;
    passengers: number;
  };
  payment: {
    total: number;
    status: PaymentStatus;
  };
  status: BookingStatus;
  createdAt: string;
}

export default function BookingsManagementPage() {
  const { user } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const [activeTab, setActiveTab] = useState<BookingStatus>("upcoming");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoading: guardLoading, isAuthorized } = useOwnerGuard();

  // Mock data - replace with API
  const bookings: Booking[] = [
    {
      id: "1",
      bookingRef: "BK-2026-001",
      customer: {
        name: "John Doe",
        phone: "+94 77 123 4567",
        email: "john@example.com",
        organization: "ABC Tours",
      },
      vehicle: {
        registration: "WP KA-1234",
        type: "Luxury Coach",
      },
      trip: {
        startDate: "2026-01-25",
        endDate: "2026-01-27",
        route: "Colombo → Kandy → Nuwara Eliya",
        passengers: 45,
      },
      payment: {
        total: 150000,
        status: "paid",
      },
      status: "upcoming",
      createdAt: "2026-01-15",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesTab = booking.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      booking.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle.registration
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "partial":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "refunded":
        return "bg-gray-100 text-gray-700";
    }
  };

  const tabCounts = {
    upcoming: bookings.filter((b) => b.status === "upcoming").length,
    "in-progress": bookings.filter((b) => b.status === "in-progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

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
            href={`/${locale}/owner/dashboard`}
              className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Bookings Management
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  {filteredBookings.length} booking
                  {filteredBookings.length !== 1 && "s"}
                </p>
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <FaFileExport className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Filters */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-2">
                {(
                  [
                    { id: "upcoming", label: "Upcoming" },
                    { id: "in-progress", label: "In Progress" },
                    { id: "completed", label: "Completed" },
                    { id: "cancelled", label: "Cancelled" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-[#20B0E9] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label} ({tabCounts[tab.id]})
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "calendar"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search by booking ref, customer, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-[#20B0E9] focus:outline-none focus:ring-2 focus:ring-[#20B0E9]/20"
            />
          </div>

          {/* Bookings List */}
          {viewMode === "list" && (
            <>
              {filteredBookings.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">
                              {booking.bookingRef}
                            </h3>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                                booking.status,
                              )}`}
                            >
                              {booking.status.replace("-", " ")}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getPaymentStatusColor(
                                booking.payment.status,
                              )}`}
                            >
                              {booking.payment.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Booked on{" "}
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="mb-1 text-sm text-gray-500">
                            Total Amount
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            LKR {booking.payment.total.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-5 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-start gap-2">
                          <FaUsers className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <div>
                            <div className="mb-1 font-medium text-gray-900">
                              {booking.customer.name}
                            </div>
                            {booking.customer.organization && (
                              <div className="text-xs text-gray-600">
                                {booking.customer.organization}
                              </div>
                            )}
                            <div className="mt-1 flex flex-col gap-0.5 text-xs text-gray-500">
                              <span>{booking.customer.phone}</span>
                              <span>{booking.customer.email}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <FaBus className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500">Vehicle</div>
                            <div className="font-medium text-gray-900">
                              {booking.vehicle.registration}
                            </div>
                            <div className="text-xs text-gray-600">
                              {booking.vehicle.type}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <FaCalendarAlt className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500">
                              Trip Dates
                            </div>
                            <div className="font-medium text-gray-900">
                              {new Date(
                                booking.trip.startDate,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-600">
                              to{" "}
                              {new Date(
                                booking.trip.endDate,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <FaMapMarkerAlt className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500">Route</div>
                            <div className="font-medium text-gray-900">
                              {booking.trip.route}
                            </div>
                            <div className="text-xs text-gray-600">
                              {booking.trip.passengers} passengers
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/${locale}/owner/bookings/${booking.id}`}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#20B0E9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a8fc4]"
                        >
                          <FaEye className="h-4 w-4" />
                          View Details
                        </Link>
                        <a
                          href={`tel:${booking.customer.phone}`}
                          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FaPhone className="h-4 w-4" />
                          Call
                        </a>
                        <a
                          href={`mailto:${booking.customer.email}`}
                          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <FaEnvelope className="h-4 w-4" />
                          Email
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <FaCalendarAlt className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      No {activeTab.replace("-", " ")} bookings
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activeTab === "upcoming"
                        ? "You don't have any upcoming bookings yet."
                        : `No ${activeTab.replace("-", " ")} bookings found.`}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto max-w-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <FaCalendarAlt className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Calendar View
                </h3>
                <p className="text-sm text-gray-600">
                  Calendar view will be implemented soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

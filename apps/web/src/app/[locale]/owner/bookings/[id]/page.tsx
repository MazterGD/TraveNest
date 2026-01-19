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
  FaBus,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUser,
  FaMapMarked,
  FaComments,
  FaFileAlt,
} from "react-icons/fa";

export default function BookingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuthStore();
  const { isLoading: guardLoading, isAuthorized } = useOwnerGuard();
  const [selectedDriver, setSelectedDriver] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Mock data - replace with API
  const booking = {
    id: params.id,
    bookingRef: "BK-2026-001",
    status: "upcoming" as const,
    customer: {
      name: "John Doe",
      organization: "ABC Tours",
      phone: "+94 77 123 4567",
      email: "john@example.com",
    },
    vehicle: {
      id: "1",
      registration: "WP KA-1234",
      type: "Luxury Coach",
      capacity: 45,
    },
    trip: {
      startDate: "2026-01-25",
      endDate: "2026-01-27",
      startTime: "06:00 AM",
      route: "Colombo → Kandy → Nuwara Eliya",
      passengers: 45,
      distance: 180,
      stops: [
        {
          name: "Colombo - Fort",
          time: "06:00 AM",
          type: "pickup",
          actualTime: null,
          notes: "",
        },
        {
          name: "Kandy - City Center",
          time: "09:30 AM",
          type: "stop",
          actualTime: null,
          notes: "Breakfast stop",
        },
        {
          name: "Nuwara Eliya - Grand Hotel",
          time: "12:00 PM",
          type: "dropoff",
          actualTime: null,
          notes: "",
        },
      ],
    },
    payment: {
      total: 150000,
      breakdown: {
        basePrice: 120000,
        driverAllowance: 15000,
        additionalCharges: 10000,
        discount: 0,
      },
      status: "paid" as const,
      method: "Card",
      platformCommission: 15000,
      netAmount: 135000,
    },
    driver: null as string | null,
    gpsTracking: true,
    createdAt: "2026-01-15",
  };

  const availableDrivers = [
    { id: "1", name: "Kamal Perera", phone: "+94 77 111 2222" },
    { id: "2", name: "Nimal Silva", phone: "+94 77 333 4444" },
  ];

  const timeline = [
    {
      date: "2026-01-15",
      time: "10:30 AM",
      event: "Booking Created",
      description: "Customer submitted booking request",
    },
    {
      date: "2026-01-15",
      time: "02:15 PM",
      event: "Payment Received",
      description: "Customer completed payment via Card",
    },
    {
      date: "2026-01-16",
      time: "09:00 AM",
      event: "Booking Confirmed",
      description: "Owner confirmed booking",
    },
  ];

  const messages = [
    {
      id: "1",
      from: "customer",
      sender: "John Doe",
      message: "Is WiFi available in the bus?",
      timestamp: "2026-01-16 10:30 AM",
    },
    {
      id: "2",
      from: "owner",
      sender: "You",
      message: "Yes, complimentary WiFi is available throughout the journey.",
      timestamp: "2026-01-16 11:45 AM",
    },
  ];

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
              href="/owner/bookings"
              className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Bookings
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Booking {booking.bookingRef}
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  Created {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                {booking.status === "upcoming" && (
                  <>
                    <button className="flex items-center gap-2 rounded-lg bg-[#20B0E9] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a8fc4]">
                      <FaCheckCircle className="h-4 w-4" />
                      Start Trip
                    </button>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <FaTimesCircle className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Customer Information */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Customer Information
                  </h2>
                  <button className="flex items-center gap-2 rounded-lg bg-[#20B0E9] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1a8fc4]">
                    <FaComments className="h-4 w-4" />
                    Message
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-sm text-gray-500">Name</div>
                    <div className="font-medium text-gray-900">
                      {booking.customer.name}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-gray-500">
                      Organization
                    </div>
                    <div className="font-medium text-gray-900">
                      {booking.customer.organization || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-gray-500">Phone</div>
                    <a
                      href={`tel:${booking.customer.phone}`}
                      className="font-medium text-[#20B0E9] hover:underline"
                    >
                      {booking.customer.phone}
                    </a>
                  </div>
                  <div>
                    <div className="mb-1 text-sm text-gray-500">Email</div>
                    <a
                      href={`mailto:${booking.customer.email}`}
                      className="font-medium text-[#20B0E9] hover:underline"
                    >
                      {booking.customer.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Trip Details
                </h2>
                <div className="mb-5 grid gap-4 text-sm md:grid-cols-3">
                  <div className="flex items-start gap-2">
                    <FaCalendarAlt className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <div className="mb-1 text-xs text-gray-500">
                        Trip Dates
                      </div>
                      <div className="font-medium text-gray-900">
                        {new Date(booking.trip.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        to {new Date(booking.trip.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaClock className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <div className="mb-1 text-xs text-gray-500">
                        Start Time
                      </div>
                      <div className="font-medium text-gray-900">
                        {booking.trip.startTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FaUsers className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <div className="mb-1 text-xs text-gray-500">
                        Passengers
                      </div>
                      <div className="font-medium text-gray-900">
                        {booking.trip.passengers}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Map Placeholder */}
                <div className="mb-5 rounded-lg bg-gray-100 p-8 text-center">
                  <FaMapMarked className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600">Route Map</p>
                  <p className="text-xs text-gray-500">{booking.trip.route}</p>
                </div>

                {/* Stops/Itinerary */}
                <div>
                  <h3 className="mb-3 font-medium text-gray-900">Itinerary</h3>
                  <div className="space-y-3">
                    {booking.trip.stops.map((stop, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg border border-gray-200 p-4"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#20B0E9] text-sm font-medium text-white">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="font-medium text-gray-900">
                              {stop.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stop.time}
                            </div>
                          </div>
                          {stop.notes && (
                            <div className="text-sm text-gray-600">
                              {stop.notes}
                            </div>
                          )}
                          {stop.actualTime && (
                            <div className="mt-2 text-xs text-green-600">
                              Actual: {stop.actualTime}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vehicle & Driver */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Vehicle & Driver
                </h2>
                <div className="mb-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                      <FaBus className="h-4 w-4" />
                      Assigned Vehicle
                    </div>
                    <div className="mb-1 font-medium text-gray-900">
                      {booking.vehicle.registration}
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.vehicle.type}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Capacity: {booking.vehicle.capacity} seats
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                      <FaUser className="h-4 w-4" />
                      Driver Assignment
                    </div>
                    {booking.driver ? (
                      <div>
                        <div className="mb-1 font-medium text-gray-900">
                          {
                            availableDrivers.find(
                              (d) => d.id === booking.driver,
                            )?.name
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          {
                            availableDrivers.find(
                              (d) => d.id === booking.driver,
                            )?.phone
                          }
                        </div>
                        <button className="mt-2 text-xs text-[#20B0E9] hover:underline">
                          Notify Driver
                        </button>
                      </div>
                    ) : (
                      <select
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-[#20B0E9] focus:outline-none focus:ring-2 focus:ring-[#20B0E9]/20"
                      >
                        <option value="">Select driver</option>
                        {availableDrivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {booking.gpsTracking && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 text-sm text-blue-900">
                      <FaMapMarked className="h-4 w-4" />
                      <span className="font-medium">GPS Tracking Enabled</span>
                    </div>
                    <p className="mt-1 text-xs text-blue-700">
                      Real-time location tracking is available for this trip
                    </p>
                    <button className="mt-2 text-xs font-medium text-[#20B0E9] hover:underline">
                      View Live Location →
                    </button>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Messages
                </h2>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg border p-4 ${
                        msg.from === "owner"
                          ? "border-[#20B0E9] bg-[#20B0E9]/5"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium text-gray-900">
                          {msg.sender}
                        </div>
                        <div className="text-xs text-gray-500">
                          {msg.timestamp}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Information */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Payment Information
                </h3>
                <div className="mb-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-medium text-gray-900">
                      LKR {booking.payment.breakdown.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Driver Allowance</span>
                    <span className="font-medium text-gray-900">
                      LKR{" "}
                      {booking.payment.breakdown.driverAllowance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Charges</span>
                    <span className="font-medium text-gray-900">
                      LKR{" "}
                      {booking.payment.breakdown.additionalCharges.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">
                        Total Amount
                      </span>
                      <span className="font-semibold text-gray-900">
                        LKR {booking.payment.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Platform Commission (10%)</span>
                    <span>
                      -LKR {booking.payment.platformCommission.toLocaleString()}
                    </span>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <div className="flex justify-between font-semibold text-green-700">
                      <span>Your Net Amount</span>
                      <span>
                        LKR {booking.payment.netAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1 text-center text-sm font-medium text-green-700">
                  Payment {booking.payment.status} • {booking.payment.method}
                </div>
              </div>

              {/* Booking Timeline */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Booking Timeline
                </h3>
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#20B0E9]">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="mb-1 font-medium text-gray-900">
                          {event.event}
                        </div>
                        <div className="mb-1 text-xs text-gray-500">
                          {event.date} • {event.time}
                        </div>
                        <div className="text-sm text-gray-600">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                    <FaFileAlt className="h-4 w-4" />
                    Generate Invoice
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                    <FaExclamationTriangle className="h-4 w-4" />
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Cancel Booking
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cancellation Reason *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="Please provide a reason for cancellation..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-[#20B0E9] focus:outline-none focus:ring-2 focus:ring-[#20B0E9]/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Keep Booking
                </button>
                <button
                  disabled={!cancelReason}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  <FaTimesCircle className="h-4 w-4" />
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

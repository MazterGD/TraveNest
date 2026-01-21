"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui";
import { useAuthStore } from "@/store";
import { useOwnerGuard } from "@/hooks";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileAlt,
  FaRedo,
  FaDownload,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

interface QuotationDetail {
  id: string;
  quotationId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  trip: {
    pickupLocation: string;
    dropoffLocation: string;
    startDate: string;
    endDate: string;
    startTime: string;
    estimatedDistance: string;
    estimatedDuration: string;
  };
  passengers: number;
  vehicle: {
    name: string;
    type: string;
    capacity: number;
  };
  pricing: {
    vehicleRentalCost: number;
    driverCost: number;
    fuelCost: number;
    tollCharges: number;
    permitFees: number;
    customItems: Array<{ description: string; amount: number }>;
    subtotal: number;
    tax: number;
    total: number;
  };
  status: "sent" | "viewed" | "accepted" | "rejected" | "expired";
  sentDate: string;
  viewedDate?: string;
  respondedDate?: string;
  validUntil: string;
  daysRemaining: number;
  additionalNotes?: string;
  rejectionReason?: string;
}

export default function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = use(params);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [quotation, setQuotation] = useState<QuotationDetail | null>(null);

  // Protect this route
  const { isLoading: guardLoading, isAuthorized } = useOwnerGuard();

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        // TODO: Replace with actual API call
        setQuotation({
          id: id,
          quotationId: "QUO-2026-001",
          customer: {
            name: "Nimal Perera",
            email: "nimal@example.com",
            phone: "+94 77 123 4567",
          },
          trip: {
            pickupLocation: "Colombo Fort Railway Station",
            dropoffLocation: "Kandy City Center",
            startDate: "2026-02-15",
            endDate: "2026-02-16",
            startTime: "08:00 AM",
            estimatedDistance: "115 km",
            estimatedDuration: "3.5 hours",
          },
          passengers: 35,
          vehicle: {
            name: "Luxury Coach 001",
            type: "Luxury Coach",
            capacity: 40,
          },
          pricing: {
            vehicleRentalCost: 25000,
            driverCost: 5000,
            fuelCost: 5750,
            tollCharges: 2000,
            permitFees: 1500,
            customItems: [
              { description: "Refreshments", amount: 3500 },
              { description: "Tour Guide", amount: 2000 },
            ],
            subtotal: 44750,
            tax: 4475,
            total: 49225,
          },
          status: "viewed",
          sentDate: "2026-01-20T10:30:00",
          viewedDate: "2026-01-20T14:15:00",
          validUntil: "2026-01-27",
          daysRemaining: 6,
          additionalNotes:
            "Vehicle includes air conditioning, comfortable seating, and entertainment system. Driver has 15+ years of experience with excellent customer reviews.",
        });
      } catch (error) {
        console.error("Failed to fetch quotation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchQuotation();
    }
  }, [id, isAuthorized]);

  const getStatusBadge = (status: string) => {
    const styles = {
      sent: "bg-blue-100 text-blue-800",
      viewed: "bg-purple-100 text-purple-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
    };

    const icons = {
      sent: <FaFileAlt className="h-4 w-4" />,
      viewed: <FaEye className="h-4 w-4" />,
      accepted: <FaCheckCircle className="h-4 w-4" />,
      rejected: <FaTimesCircle className="h-4 w-4" />,
      expired: <FaClock className="h-4 w-4" />,
    };

    const labels = {
      sent: "Sent",
      viewed: "Viewed by Customer",
      accepted: "Accepted",
      rejected: "Rejected",
      expired: "Expired",
    };

    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${styles[status as keyof typeof styles]}`}
      >
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    alert("PDF download will be implemented");
  };

  const handleResend = () => {
    // TODO: Implement resend functionality
    alert("Resend functionality will be implemented");
  };

  if (guardLoading || !isAuthorized || !user || loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!quotation) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Quotation not found
            </h3>
            <Link
              href={`/${locale}/owner/quotations/sent`}
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Back to Sent Quotations
            </Link>
          </div>
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
              href={`/${locale}/owner/quotations/sent`}
              className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Sent Quotations
            </Link>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {quotation.quotationId}
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  Quotation for {quotation.customer.name}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(quotation.status)}
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaDownload className="h-4 w-4" />
                  Download PDF
                </button>
                {quotation.status === "expired" && (
                  <button
                    onClick={handleResend}
                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    <FaRedo className="h-4 w-4" />
                    Resend
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Status Timeline */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <FaFileAlt className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="h-full w-0.5 bg-gray-200" />
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="mb-1 font-medium text-gray-900">
                        Quotation Sent
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(quotation.sentDate).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {quotation.viewedDate && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                          <FaEye className="h-4 w-4 text-purple-600" />
                        </div>
                        {quotation.respondedDate && (
                          <div className="h-full w-0.5 bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="mb-1 font-medium text-gray-900">
                          Viewed by Customer
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(quotation.viewedDate).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {quotation.respondedDate && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            quotation.status === "accepted"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {quotation.status === "accepted" ? (
                            <FaCheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <FaTimesCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="mb-1 font-medium text-gray-900">
                          {quotation.status === "accepted"
                            ? "Accepted by Customer"
                            : "Rejected by Customer"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(quotation.respondedDate).toLocaleString()}
                        </div>
                        {quotation.rejectionReason && (
                          <div className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-900">
                            <span className="font-medium">Reason:</span>{" "}
                            {quotation.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-medium text-gray-900">
                      {quotation.customer.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${quotation.customer.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {quotation.customer.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${quotation.customer.phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {quotation.customer.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Trip Details
                </h2>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Route</div>
                        <div className="font-medium text-gray-900">
                          {quotation.trip.pickupLocation}
                        </div>
                        <div className="text-sm text-gray-500">→</div>
                        <div className="font-medium text-gray-900">
                          {quotation.trip.dropoffLocation}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {quotation.trip.estimatedDistance} •{" "}
                          {quotation.trip.estimatedDuration}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaCalendarAlt className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Date & Time</div>
                        <div className="font-medium text-gray-900">
                          {new Date(
                            quotation.trip.startDate,
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {quotation.trip.startTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaUsers className="mt-0.5 h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Passengers</div>
                        <div className="font-medium text-gray-900">
                          {quotation.passengers} passengers
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Vehicle</div>
                      <div className="font-medium text-gray-900">
                        {quotation.vehicle.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {quotation.vehicle.type} • {quotation.vehicle.capacity}{" "}
                        seats
                      </div>
                    </div>
                  </div>

                  {quotation.additionalNotes && (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h3 className="mb-2 text-sm font-semibold text-blue-900">
                        Additional Notes
                      </h3>
                      <p className="text-sm text-blue-800">
                        {quotation.additionalNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Pricing Breakdown
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Rental Cost</span>
                    <span className="font-medium text-gray-900">
                      LKR {quotation.pricing.vehicleRentalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Driver Cost</span>
                    <span className="font-medium text-gray-900">
                      LKR {quotation.pricing.driverCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Fuel Cost</span>
                    <span className="font-medium text-gray-900">
                      LKR {quotation.pricing.fuelCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toll Charges</span>
                    <span className="font-medium text-gray-900">
                      LKR {quotation.pricing.tollCharges.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Permit Fees</span>
                    <span className="font-medium text-gray-900">
                      LKR {quotation.pricing.permitFees.toLocaleString()}
                    </span>
                  </div>

                  {quotation.pricing.customItems.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{item.description}</span>
                      <span className="font-medium text-gray-900">
                        LKR {item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        LKR {quotation.pricing.subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium text-gray-900">
                      LKR {quotation.pricing.tax.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t-2 border-gray-900 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Grand Total
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        LKR {quotation.pricing.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Validity Card */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Validity
                  </h2>
                  <div
                    className={`rounded-lg p-4 ${
                      quotation.daysRemaining < 0
                        ? "bg-red-50"
                        : quotation.daysRemaining <= 2
                          ? "bg-yellow-50"
                          : "bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FaClock
                        className={`mt-0.5 h-5 w-5 ${
                          quotation.daysRemaining < 0
                            ? "text-red-600"
                            : quotation.daysRemaining <= 2
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                      <div>
                        <div
                          className={`mb-1 font-semibold ${
                            quotation.daysRemaining < 0
                              ? "text-red-900"
                              : quotation.daysRemaining <= 2
                                ? "text-yellow-900"
                                : "text-blue-900"
                          }`}
                        >
                          {quotation.daysRemaining < 0
                            ? "Expired"
                            : `${quotation.daysRemaining} days remaining`}
                        </div>
                        <div
                          className={`text-sm ${
                            quotation.daysRemaining < 0
                              ? "text-red-700"
                              : quotation.daysRemaining <= 2
                                ? "text-yellow-700"
                                : "text-blue-700"
                          }`}
                        >
                          Valid until{" "}
                          {new Date(quotation.validUntil).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {quotation.status === "accepted" && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                    <h3 className="mb-3 font-semibold text-green-900">
                      Quotation Accepted!
                    </h3>
                    <p className="mb-4 text-sm text-green-700">
                      Customer has accepted this quotation. Create a booking to
                      proceed.
                    </p>
                    <Link
                      href={`/${locale}/owner/bookings/create?quotation=${quotation.id}`}
                      className="block w-full rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Create Booking
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

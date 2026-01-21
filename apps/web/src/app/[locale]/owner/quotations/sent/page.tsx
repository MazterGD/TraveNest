"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui";
import { useAuthStore } from "@/store";
import { useOwnerGuard } from "@/hooks";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaFileExport,
  FaRedo,
  FaFileAlt,
} from "react-icons/fa";
import { useParams } from "next/navigation";

type QuotationStatus =
  | "all"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired";

interface SentQuotation {
  id: string;
  quotationId: string;
  customer: {
    name: string;
    email: string;
  };
  trip: {
    pickupLocation: string;
    dropoffLocation: string;
    startDate: string;
  };
  vehicle: {
    name: string;
    type: string;
  };
  totalAmount: number;
  status: QuotationStatus;
  sentDate: string;
  viewedDate?: string;
  respondedDate?: string;
  validUntil: string;
  daysRemaining: number;
}

export default function SentQuotationsPage() {
  const { user } = useAuthStore();
  const params = useParams();
  const locale = params.locale as string;
  const [activeTab, setActiveTab] = useState<QuotationStatus>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Protect this route
  const { isLoading: guardLoading, isAuthorized } = useOwnerGuard();

  // Sample data - will be replaced with API data
  const [quotations, setQuotations] = useState<SentQuotation[]>([]);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        // TODO: Replace with actual API call
        setQuotations([
          {
            id: "1",
            quotationId: "QUO-2026-001",
            customer: {
              name: "Nimal Perera",
              email: "nimal@example.com",
            },
            trip: {
              pickupLocation: "Colombo",
              dropoffLocation: "Kandy",
              startDate: "2026-02-15",
            },
            vehicle: {
              name: "Luxury Coach 001",
              type: "Luxury",
            },
            totalAmount: 45000,
            status: "sent",
            sentDate: "2026-01-20T10:30:00",
            validUntil: "2026-01-27",
            daysRemaining: 6,
          },
          {
            id: "2",
            quotationId: "QUO-2026-002",
            customer: {
              name: "Kamal Silva",
              email: "kamal@example.com",
            },
            trip: {
              pickupLocation: "Galle",
              dropoffLocation: "Colombo",
              startDate: "2026-02-20",
            },
            vehicle: {
              name: "Semi-Luxury 002",
              type: "Semi-Luxury",
            },
            totalAmount: 32000,
            status: "viewed",
            sentDate: "2026-01-19T14:20:00",
            viewedDate: "2026-01-20T09:15:00",
            validUntil: "2026-01-26",
            daysRemaining: 5,
          },
          {
            id: "3",
            quotationId: "QUO-2026-003",
            customer: {
              name: "Saman Fernando",
              email: "saman@example.com",
            },
            trip: {
              pickupLocation: "Negombo",
              dropoffLocation: "Jaffna",
              startDate: "2026-03-01",
            },
            vehicle: {
              name: "Standard Bus 003",
              type: "Standard",
            },
            totalAmount: 55000,
            status: "accepted",
            sentDate: "2026-01-18T11:00:00",
            viewedDate: "2026-01-18T15:30:00",
            respondedDate: "2026-01-19T10:00:00",
            validUntil: "2026-01-25",
            daysRemaining: 4,
          },
          {
            id: "4",
            quotationId: "QUO-2026-004",
            customer: {
              name: "Priya Jayawardena",
              email: "priya@example.com",
            },
            trip: {
              pickupLocation: "Kandy",
              dropoffLocation: "Nuwara Eliya",
              startDate: "2026-02-25",
            },
            vehicle: {
              name: "Luxury Coach 001",
              type: "Luxury",
            },
            totalAmount: 38000,
            status: "rejected",
            sentDate: "2026-01-17T09:30:00",
            viewedDate: "2026-01-17T16:00:00",
            respondedDate: "2026-01-18T08:00:00",
            validUntil: "2026-01-24",
            daysRemaining: 3,
          },
          {
            id: "5",
            quotationId: "QUO-2026-005",
            customer: {
              name: "Rajesh Kumar",
              email: "rajesh@example.com",
            },
            trip: {
              pickupLocation: "Colombo",
              dropoffLocation: "Trincomalee",
              startDate: "2026-02-10",
            },
            vehicle: {
              name: "Semi-Luxury 002",
              type: "Semi-Luxury",
            },
            totalAmount: 48000,
            status: "expired",
            sentDate: "2026-01-10T10:00:00",
            viewedDate: "2026-01-11T12:00:00",
            validUntil: "2026-01-17",
            daysRemaining: -4,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch quotations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      fetchQuotations();
    }
  }, [isAuthorized]);

  const filteredQuotations = quotations.filter((quot) => {
    const matchesTab = activeTab === "all" || quot.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      quot.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quot.quotationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quot.trip.pickupLocation
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      quot.trip.dropoffLocation
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: quotations.length,
    sent: quotations.filter((q) => q.status === "sent").length,
    viewed: quotations.filter((q) => q.status === "viewed").length,
    accepted: quotations.filter((q) => q.status === "accepted").length,
    rejected: quotations.filter((q) => q.status === "rejected").length,
    expired: quotations.filter((q) => q.status === "expired").length,
  };

  const getStatusBadge = (status: QuotationStatus) => {
    const styles = {
      sent: "bg-blue-100 text-blue-800",
      viewed: "bg-purple-100 text-purple-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
      all: "bg-gray-100 text-gray-800",
    };

    const icons = {
      sent: <FaFileAlt className="h-3 w-3" />,
      viewed: <FaEye className="h-3 w-3" />,
      accepted: <FaCheckCircle className="h-3 w-3" />,
      rejected: <FaTimesCircle className="h-3 w-3" />,
      expired: <FaClock className="h-3 w-3" />,
      all: <FaFileAlt className="h-3 w-3" />,
    };

    const labels = {
      sent: "Sent",
      viewed: "Viewed",
      accepted: "Accepted",
      rejected: "Rejected",
      expired: "Expired",
      all: "All",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert("Export functionality will be implemented");
  };

  const handleResend = (quotationId: string) => {
    // TODO: Implement resend functionality
    alert(`Resend quotation ${quotationId}`);
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
                  Sent Quotations
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  {filteredQuotations.length} quotation
                  {filteredQuotations.length !== 1 && "s"}
                </p>
              </div>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaFileExport className="h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Filters & Tabs */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "sent", label: "Sent" },
                    { id: "viewed", label: "Viewed" },
                    { id: "accepted", label: "Accepted" },
                    { id: "rejected", label: "Rejected" },
                    { id: "expired", label: "Expired" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label} ({tabCounts[tab.id]})
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaFilter className="h-4 w-4" />
                Filters
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name, quotation ID, or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 grid gap-4 border-t border-gray-200 pt-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date Range
                  </label>
                  <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>All Time</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Vehicle Type
                  </label>
                  <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>All Types</option>
                    <option>Luxury</option>
                    <option>Semi-Luxury</option>
                    <option>Standard</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Amount (High to Low)</option>
                    <option>Amount (Low to High)</option>
                    <option>Expiring Soon</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Quotation Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredQuotations.length > 0 ? (
            <div className="space-y-4">
              {filteredQuotations.map((quotation) => (
                <div
                  key={quotation.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-gray-300"
                >
                  <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-gray-900">
                          {quotation.customer.name}
                        </h3>
                        {getStatusBadge(quotation.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {quotation.quotationId}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        LKR {quotation.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {quotation.vehicle.name}
                      </div>
                    </div>
                  </div>

                  {/* Trip Summary */}
                  <div className="mb-4 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Route</div>
                        <div className="font-medium text-gray-900">
                          {quotation.trip.pickupLocation} →{" "}
                          {quotation.trip.dropoffLocation}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <FaCalendarAlt className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Trip Date</div>
                        <div className="font-medium text-gray-900">
                          {new Date(
                            quotation.trip.startDate,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <FaClock className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Validity</div>
                        <div
                          className={`font-medium ${
                            quotation.daysRemaining < 0
                              ? "text-red-600"
                              : quotation.daysRemaining <= 2
                                ? "text-yellow-600"
                                : "text-gray-900"
                          }`}
                        >
                          {quotation.daysRemaining < 0
                            ? "Expired"
                            : `${quotation.daysRemaining} days left`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dates Timeline */}
                  <div className="mb-4 flex flex-wrap gap-4 border-t border-gray-200 pt-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Sent:</span>{" "}
                      {new Date(quotation.sentDate).toLocaleString()}
                    </div>
                    {quotation.viewedDate && (
                      <div>
                        <span className="font-medium">Viewed:</span>{" "}
                        {new Date(quotation.viewedDate).toLocaleString()}
                      </div>
                    )}
                    {quotation.respondedDate && (
                      <div>
                        <span className="font-medium">Responded:</span>{" "}
                        {new Date(quotation.respondedDate).toLocaleString()}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Expires:</span>{" "}
                      {new Date(quotation.validUntil).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/${locale}/owner/quotations/sent/${quotation.id}`}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      View Details
                    </Link>

                    {quotation.status === "expired" && (
                      <button
                        onClick={() => handleResend(quotation.quotationId)}
                        className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                      >
                        <FaRedo className="h-3 w-3" />
                        Resend
                      </button>
                    )}

                    {quotation.status === "accepted" && (
                      <Link
                        href={`/${locale}/owner/bookings/create?quotation=${quotation.id}`}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                      >
                        Create Booking
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto max-w-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <FaFileAlt className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  No {activeTab === "all" ? "" : activeTab} quotations
                </h3>
                <p className="mb-6 text-sm text-gray-600">
                  {activeTab === "all"
                    ? "You haven't sent any quotations yet. Start by responding to quotation requests."
                    : `No ${activeTab} quotations at the moment.`}
                </p>
                <Link
                  href={`/${locale}/owner/quotations`}
                  className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  View Quotation Requests
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

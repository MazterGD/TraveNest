"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  SkeletonDashboard,
  EmptyState,
  EmptyBoxIcon,
} from "@/components/ui";
import { BookingCard } from "@/components/features/customer";
import { BookingStatus, PaymentStatus } from "@/types";
import type { BookingWithDetails, QuotationRequest } from "@/store";

// Mock data for demonstration
const mockStats = {
  activeBookings: 2,
  pendingQuotations: 3,
  completedTrips: 12,
  totalSpent: 125000,
};

const mockUpcomingBookings: BookingWithDetails[] = [
  {
    id: "1",
    vehicleId: "v1",
    customerId: "c1",
    ownerId: "o1",
    quotationId: "q1",
    bookingReference: "BK-001",
    startDate: new Date(Date.now() + 86400000 * 3),
    endDate: new Date(Date.now() + 86400000 * 3 + 3600000 * 8),
    startTime: "08:00",
    passengerCount: 4,
    stops: [],
    paidAmount: 15000,
    totalAmount: 15000,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: new Date(),
    updatedAt: new Date(),
    vehicleName: "Toyota KDH Van",
    vehicleImage: "/images/vehicles/kdh-van.jpg",
    ownerName: "Kamal Perera",
    ownerPhone: "+94 77 123 4567",
    driverName: "Sunil Fernando",
    driverPhone: "+94 76 987 6543",
    pickupLocation: {
      address: "Colombo Fort Railway Station",
      city: "Colombo",
      district: "Colombo",
    },
    destination: {
      address: "Kandy City Centre",
      city: "Kandy",
      district: "Kandy",
    },
    dropoffLocation: {
      address: "Kandy City Centre",
      city: "Kandy",
      district: "Kandy",
    },
  },
];

const mockPendingRequests: QuotationRequest[] = [
  {
    id: "req1",
    customerId: "c1",
    pickupLocation: {
      address: "Bandaranaike Airport",
      city: "Katunayake",
      district: "Gampaha",
    },
    dropoffLocation: {
      address: "Galle Face Hotel",
      city: "Colombo",
      district: "Colombo",
    },
    pickupDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
    pickupTime: "14:00",
    isRoundTrip: false,
    passengerCount: 4,
    vehicleType: "sedan",
    luggageCount: 3,
    needsAC: true,
    status: "pending",
    quotationsCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface DashboardPageProps {
  locale: string;
}

export function DashboardContent({ locale }: DashboardPageProps) {
  const t = useTranslations("dashboard");
  const [isLoading] = useState(false);

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboardSubtitle")}</p>
        </div>
        <Link href={`/${locale}/dashboard/quotations/new`}>
          <Button>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("newQuotationRequest")}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockStats.activeBookings}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("activeBookings")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockStats.pendingQuotations}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("pendingQuotations")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockStats.completedTrips}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("completedTrips")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(mockStats.totalSpent)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("totalSpent")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{t("upcomingBookings")}</CardTitle>
            <Link href={`/${locale}/dashboard/bookings`}>
              <Button variant="ghost" size="sm">
                {t("viewAll")}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {mockUpcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {mockUpcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    variant="compact"
                    showActions={false}
                    onViewDetails={() => {}}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<EmptyBoxIcon />}
                title={t("noUpcomingBookings")}
                description={t("noUpcomingBookingsDesc")}
              />
            )}
          </CardContent>
        </Card>

        {/* Pending Quotation Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{t("pendingRequests")}</CardTitle>
            <Link href={`/${locale}/dashboard/quotations`}>
              <Button variant="ghost" size="sm">
                {t("viewAll")}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {mockPendingRequests.length > 0 ? (
              <div className="space-y-4">
                {mockPendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground">
                          {request.pickupLocation.city} →{" "}
                          {request.dropoffLocation.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                      {request.quotationsCount > 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {request.quotationsCount} {t("quotations")}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/${locale}/dashboard/quotations/${request.id}`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        {t("viewQuotations")}
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<EmptyBoxIcon />}
                title={t("noPendingRequests")}
                description={t("noPendingRequestsDesc")}
                action={
                  <Link href={`/${locale}/dashboard/quotations/new`}>
                    <Button size="sm">{t("createRequest")}</Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("quickActions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href={`/${locale}/dashboard/quotations/new`}>
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="font-medium text-foreground">{t("newRequest")}</p>
              </div>
            </Link>
            <Link href={`/${locale}/dashboard/bookings`}>
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="font-medium text-foreground">{t("myBookings")}</p>
              </div>
            </Link>
            <Link href={`/${locale}/dashboard/reviews`}>
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <p className="font-medium text-foreground">{t("myReviews")}</p>
              </div>
            </Link>
            <Link href={`/${locale}/dashboard/profile`}>
              <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-center cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <p className="font-medium text-foreground">{t("profile")}</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

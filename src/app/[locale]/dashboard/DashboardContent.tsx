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
  StatCard,
  QuickActionCard,
  QuickActionGrid,
  CalendarIcon,
  ClipboardIcon,
  CheckCircleIcon,
  CurrencyIcon,
  PlusIcon,
  ChevronRightIcon,
  StarIcon,
  UserIcon,
} from "@/components/ui";
import { BookingCard } from "@/components/features/customer";
import { BookingStatus, PaymentStatus } from "@/types";
import type { BookingWithDetails, QuotationRequest } from "@/store";
import { formatCurrency } from "@/lib/utils/formatters";

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
            <PlusIcon className="w-4 h-4 mr-2" />
            {t("newQuotationRequest")}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          value={mockStats.activeBookings}
          label={t("activeBookings")}
          icon={<CalendarIcon className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          value={mockStats.pendingQuotations}
          label={t("pendingQuotations")}
          icon={<ClipboardIcon className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          value={mockStats.completedTrips}
          label={t("completedTrips")}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          value={formatCurrency(mockStats.totalSpent)}
          label={t("totalSpent")}
          icon={<CurrencyIcon className="w-6 h-6" />}
          variant="info"
        />
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
                <ChevronRightIcon className="w-4 h-4 ml-1" />
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
                <ChevronRightIcon className="w-4 h-4 ml-1" />
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
          <QuickActionGrid columns={4}>
            <Link href={`/${locale}/dashboard/quotations/new`}>
              <QuickActionCard
                label={t("newRequest")}
                icon={<PlusIcon className="w-6 h-6" />}
                variant="primary"
              />
            </Link>
            <Link href={`/${locale}/dashboard/bookings`}>
              <QuickActionCard
                label={t("myBookings")}
                icon={<ClipboardIcon className="w-6 h-6" />}
                variant="success"
              />
            </Link>
            <Link href={`/${locale}/dashboard/reviews`}>
              <QuickActionCard
                label={t("myReviews")}
                icon={<StarIcon className="w-6 h-6" />}
                variant="warning"
              />
            </Link>
            <Link href={`/${locale}/dashboard/profile`}>
              <QuickActionCard
                label={t("profile")}
                icon={<UserIcon className="w-6 h-6" />}
                variant="info"
              />
            </Link>
          </QuickActionGrid>
        </CardContent>
      </Card>
    </div>
  );
}

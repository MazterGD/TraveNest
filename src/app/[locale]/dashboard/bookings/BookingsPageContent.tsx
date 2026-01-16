"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  PageHeader,
  Button,
  TabsList,
  EmptyState,
  EmptyCalendarIcon,
  SkeletonList,
} from "@/components/ui";
import { BookingCard } from "@/components/features/customer";
import { BookingStatus, PaymentStatus } from "@/types";
import type { BookingWithDetails } from "@/store";

// Mock data
const mockBookings: BookingWithDetails[] = [
  {
    id: "b1",
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
  {
    id: "b2",
    vehicleId: "v2",
    customerId: "c1",
    ownerId: "o2",
    quotationId: "q2",
    bookingReference: "BK-002",
    startDate: new Date(Date.now() - 86400000 * 7),
    endDate: new Date(Date.now() - 86400000 * 7 + 3600000 * 10),
    startTime: "09:00",
    passengerCount: 2,
    stops: [],
    paidAmount: 22000,
    totalAmount: 22000,
    status: BookingStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    createdAt: new Date(Date.now() - 86400000 * 10),
    updatedAt: new Date(Date.now() - 86400000 * 7),
    vehicleName: "Toyota Prius",
    ownerName: "Nimal Silva",
    ownerPhone: "+94 71 234 5678",
    pickupLocation: {
      address: "Galle Face Hotel",
      city: "Colombo",
      district: "Colombo",
    },
    destination: {
      address: "Bentota Beach",
      city: "Bentota",
      district: "Galle",
    },
    dropoffLocation: {
      address: "Bentota Beach",
      city: "Bentota",
      district: "Galle",
    },
    hasReview: false,
  },
];

interface BookingsPageContentProps {
  locale: string;
}

export function BookingsPageContent({ locale }: BookingsPageContentProps) {
  const t = useTranslations("booking");
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const now = new Date();
  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab === "upcoming") return new Date(booking.startDate) > now;
    if (activeTab === "past") return new Date(booking.endDate) < now;
    if (activeTab === "cancelled")
      return booking.status === BookingStatus.CANCELLED;
    return true;
  });

  const tabs = [
    { id: "all", label: t("all"), badge: mockBookings.length },
    {
      id: "upcoming",
      label: t("upcoming"),
      badge: mockBookings.filter((b) => new Date(b.startDate) > now).length,
    },
    {
      id: "past",
      label: t("past"),
      badge: mockBookings.filter((b) => new Date(b.endDate) < now).length,
    },
    {
      id: "cancelled",
      label: t("cancelled"),
      badge: mockBookings.filter((b) => b.status === "cancelled").length,
    },
  ];

  const handleCancelBooking = (bookingId: string) => {
    console.log("Cancel booking:", bookingId);
    // TODO: Implement cancel logic
  };

  const handleReview = (bookingId: string) => {
    console.log("Review booking:", bookingId);
    // TODO: Navigate to review page
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("myBookings")}
        description={t("bookingsDescription")}
      />

      <TabsList
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
        variant="pills"
      />

      {isLoading ? (
        <SkeletonList count={3} />
      ) : filteredBookings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={() => handleCancelBooking(booking.id)}
              onReview={() => handleReview(booking.id)}
              onViewDetails={() => {}}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<EmptyCalendarIcon />}
          title={t("noBookings")}
          description={t("noBookingsDescription")}
          action={
            <Link href={`/${locale}/dashboard/quotations/new`}>
              <Button>{t("startSearching")}</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}

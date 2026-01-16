"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  StatusBadge,
  Avatar,
  Button,
} from "@/components/ui";
import { BookingStatus } from "@/types";
import type { BookingWithDetails } from "@/store";
import { cn } from "@/lib/utils/cn";

interface BookingCardProps {
  booking: BookingWithDetails;
  onViewDetails?: () => void;
  onCancel?: () => void;
  onReview?: () => void;
  onContact?: () => void;
  showActions?: boolean;
  variant?: "default" | "compact" | "detailed";
}

export function BookingCard({
  booking,
  onViewDetails,
  onCancel,
  onReview,
  onContact,
  showActions = true,
  variant = "default",
}: BookingCardProps) {
  const t = useTranslations("booking");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-LK", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("en-LK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = new Date(booking.startDate) > new Date();
  const isPast = new Date(booking.endDate) < new Date();
  const canCancel = booking.status === BookingStatus.CONFIRMED && isUpcoming;
  const canReview =
    booking.status === BookingStatus.COMPLETED && !booking.hasReview;

  if (variant === "compact") {
    return (
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={onViewDetails}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {booking.vehicleImage && (
              <img
                src={booking.vehicleImage}
                alt={booking.vehicleName}
                className="w-16 h-12 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {booking.vehicleName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(booking.startDate)}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow",
        onViewDetails && "cursor-pointer"
      )}
      onClick={onViewDetails}
    >
      <CardContent className="p-0">
        {/* Header with Vehicle Image */}
        <div className="relative">
          {booking.vehicleImage && (
            <img
              src={booking.vehicleImage}
              alt={booking.vehicleName}
              className="w-full h-40 object-cover rounded-t-xl"
            />
          )}
          <div className="absolute top-3 right-3">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Vehicle & Owner Info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {booking.vehicleName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Avatar name={booking.ownerName} size="xs" />
                <span className="text-sm text-muted-foreground">
                  {booking.ownerName}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(booking.totalAmount)}
              </p>
              <StatusBadge status={booking.paymentStatus} />
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-3 mb-4">
            {/* Dates */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary"
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
                <p className="font-medium">{formatDate(booking.startDate)}</p>
                <p className="text-muted-foreground">
                  {formatTime(booking.startDate)} -{" "}
                  {formatTime(booking.endDate)}
                </p>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-muted-foreground">{t("pickup")}</p>
                <p className="font-medium">{booking.pickupLocation?.address}</p>
              </div>
            </div>

            {/* Dropoff Location */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-muted-foreground">{t("dropoff")}</p>
                <p className="font-medium">
                  {booking.dropoffLocation?.address}
                </p>
              </div>
            </div>

            {/* Driver Info (if assigned) */}
            {booking.driverName && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
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
                <div>
                  <p className="text-muted-foreground">{t("driver")}</p>
                  <p className="font-medium">{booking.driverName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-4 border-t border-border">
              {onContact && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContact();
                  }}
                  className="flex-1"
                >
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {t("contact")}
                </Button>
              )}
              {canCancel && onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                  }}
                  className="flex-1 text-destructive hover:bg-destructive/10"
                >
                  {t("cancel")}
                </Button>
              )}
              {canReview && onReview && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview();
                  }}
                  className="flex-1"
                >
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {t("leaveReview")}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

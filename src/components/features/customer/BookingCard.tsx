"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  StatusBadge,
  Avatar,
  Button,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  StarIcon,
} from "@/components/ui";
import { BookingStatus } from "@/types";
import type { BookingWithDetails } from "@/store";
import { cn } from "@/lib/utils/cn";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils/formatters";

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
                {formatDate(booking.startDate, "medium")}
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
                <CalendarIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {formatDate(booking.startDate, "medium")}
                </p>
                <p className="text-muted-foreground">
                  {formatTime(booking.startDate)} -{" "}
                  {formatTime(booking.endDate)}
                </p>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <MapPinIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-muted-foreground">{t("pickup")}</p>
                <p className="font-medium">{booking.pickupLocation?.address}</p>
              </div>
            </div>

            {/* Dropoff Location */}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <MapPinIcon className="w-4 h-4 text-red-600" />
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
                  <UserIcon className="w-4 h-4 text-blue-600" />
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
                  <PhoneIcon className="w-4 h-4 mr-2" />
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
                  <StarIcon className="w-4 h-4 mr-2" />
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

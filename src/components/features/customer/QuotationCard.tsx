"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  Badge,
  StatusBadge,
  Avatar,
  Button,
} from "@/components/ui";
import { QuotationStatus } from "@/types";
import type { ReceivedQuotation } from "@/store";
import { cn } from "@/lib/utils/cn";

interface QuotationCardProps {
  quotation: ReceivedQuotation;
  onAccept?: () => void;
  onDecline?: () => void;
  onViewDetails?: () => void;
  isSelected?: boolean;
  showActions?: boolean;
  isCompact?: boolean;
}

export function QuotationCard({
  quotation,
  onAccept,
  onDecline,
  onViewDetails,
  isSelected = false,
  showActions = true,
  isCompact = false,
}: QuotationCardProps) {
  const t = useTranslations("quotation");

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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Use price alias if available, otherwise use totalAmount from base type
  const displayPrice = quotation.price ?? quotation.totalAmount;
  const displayValidUntil = quotation.validUntil ?? quotation.expiryDate;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary border-primary",
        isCompact ? "p-3" : "p-0",
        onViewDetails && "cursor-pointer"
      )}
      onClick={onViewDetails}
    >
      <CardContent className={cn(isCompact ? "p-0" : "p-4")}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={quotation.ownerName} size="md" />
            <div>
              <h3 className="font-semibold text-foreground">
                {quotation.ownerName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{quotation.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>
                  {quotation.totalTrips} {t("trips")}
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={quotation.status} />
        </div>

        {/* Vehicle Info */}
        <div className="flex gap-4 mb-4">
          {quotation.vehicleImage && (
            <img
              src={quotation.vehicleImage}
              alt={quotation.vehicleName}
              className="w-24 h-16 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h4 className="font-medium text-foreground">
              {quotation.vehicleName}
            </h4>
            {quotation.message && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {quotation.message}
              </p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mb-4 p-3 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">{t("quotedPrice")}</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(displayPrice)}
            </p>
          </div>
          {displayValidUntil && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t("validUntil")}</p>
              <p className="text-sm font-medium">
                {formatDate(displayValidUntil)}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && quotation.status === QuotationStatus.PENDING && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDecline?.();
              }}
              className="flex-1"
            >
              {t("decline")}
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAccept?.();
              }}
              className="flex-1"
            >
              {t("accept")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Comparison view for multiple quotations
interface QuotationComparisonProps {
  quotations: ReceivedQuotation[];
  selectedId?: string;
  onSelect: (quotation: ReceivedQuotation) => void;
  onAccept: (quotation: ReceivedQuotation) => void;
}

export function QuotationComparison({
  quotations,
  selectedId,
  onSelect,
  onAccept,
}: QuotationComparisonProps) {
  const t = useTranslations("quotation");

  if (quotations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("noQuotationsReceived")}
      </div>
    );
  }

  const getPrice = (q: ReceivedQuotation) => q.price ?? q.totalAmount;
  const sortedQuotations = [...quotations].sort(
    (a, b) => getPrice(a) - getPrice(b)
  );
  const lowestPrice = getPrice(sortedQuotations[0]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          {t("receivedQuotations")} ({quotations.length})
        </h3>
        <div className="flex gap-2">
          <Badge variant="info">{t("sortedByPrice")}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedQuotations.map((quotation) => (
          <div key={quotation.id} className="relative">
            {getPrice(quotation) === lowestPrice && (
              <Badge
                variant="success"
                className="absolute -top-2 -right-2 z-10"
              >
                {t("lowestPrice")}
              </Badge>
            )}
            <QuotationCard
              quotation={quotation}
              isSelected={selectedId === quotation.id}
              onViewDetails={() => onSelect(quotation)}
              onAccept={() => onAccept(quotation)}
              showActions={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  TextArea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
} from "@/components/ui";
import { cn } from "@/lib/utils/cn";

interface ReviewInput {
  bookingId: string;
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  bookingId: string;
  vehicleName: string;
  ownerName: string;
  onSubmit: (
    data: ReviewInput
  ) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ReviewForm({
  bookingId,
  vehicleName,
  ownerName,
  onSubmit,
  onCancel,
  isLoading = false,
}: ReviewFormProps) {
  const t = useTranslations("review");
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError(t("ratingRequired"));
      return;
    }

    const result = await onSubmit({
      bookingId,
      rating,
      comment,
    });

    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const ratingLabels = [
    "",
    t("ratingTerrible"),
    t("ratingPoor"),
    t("ratingAverage"),
    t("ratingGood"),
    t("ratingExcellent"),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("leaveReview")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("reviewFor")} <span className="font-medium">{vehicleName}</span>{" "}
          {t("by")} <span className="font-medium">{ownerName}</span>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {t("yourRating")}
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setError("");
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                  <svg
                    className={cn(
                      "w-8 h-8 transition-colors",
                      (hoverRating || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted stroke-current fill-none"
                    )}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                </button>
              ))}
              {(hoverRating || rating) > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {ratingLabels[hoverRating || rating]}
                </span>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {t("yourComment")}
            </label>
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("commentPlaceholder")}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {t("commentHelper")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("cancel")}
              </Button>
            )}
            <Button type="submit" isLoading={isLoading}>
              {t("submitReview")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Review Display Component
interface ReviewDisplayProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    customerName: string;
    customerAvatar?: string;
    ownerResponse?: string;
    ownerResponseDate?: string;
  };
  showOwnerResponse?: boolean;
}

export function ReviewDisplay({
  review,
  showOwnerResponse = true,
}: ReviewDisplayProps) {
  const t = useTranslations("review");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Review Header */}
      <div className="flex items-start gap-4">
        <Avatar
          name={review.customerName}
          src={review.customerAvatar}
          size="md"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">
              {review.customerName}
            </h4>
            <span className="text-sm text-muted-foreground">
              {formatDate(review.createdAt)}
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={cn(
                  "w-4 h-4",
                  review.rating >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted fill-none"
                )}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Review Comment */}
      {review.comment && <p className="text-foreground">{review.comment}</p>}

      {/* Owner Response */}
      {showOwnerResponse && review.ownerResponse && (
        <div className="ml-8 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-foreground">
              {t("ownerResponse")}
            </span>
            {review.ownerResponseDate && (
              <span className="text-xs text-muted-foreground">
                • {formatDate(review.ownerResponseDate)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {review.ownerResponse}
          </p>
        </div>
      )}
    </div>
  );
}

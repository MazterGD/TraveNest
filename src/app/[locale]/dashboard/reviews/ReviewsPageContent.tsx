"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  PageHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  EmptyState,
  EmptyBoxIcon,
  SkeletonList,
} from "@/components/ui";
import { ReviewDisplay } from "@/components/features/customer";

// Mock data
const mockReviews = [
  {
    id: "r1",
    rating: 5,
    comment:
      "Excellent service! The vehicle was clean and the driver was very professional. Highly recommend for airport transfers.",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    customerName: "You",
    vehicleName: "Toyota KDH Van",
    ownerName: "Kamal Perera",
    ownerResponse:
      "Thank you so much for your kind words! It was a pleasure serving you. Looking forward to your next trip!",
    ownerResponseDate: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "r2",
    rating: 4,
    comment:
      "Good experience overall. Vehicle arrived on time and the trip was comfortable. Minor delay on return but driver communicated well.",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    customerName: "You",
    vehicleName: "Toyota Prius",
    ownerName: "Nimal Silva",
  },
];

const pendingReviews = [
  {
    bookingId: "b2",
    vehicleName: "Honda Vezel",
    ownerName: "Saman Kumara",
    tripDate: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

interface ReviewsPageContentProps {
  locale: string;
}

export function ReviewsPageContent({ locale }: ReviewsPageContentProps) {
  const t = useTranslations("review");
  const [isLoading] = useState(false);

  const tabContent = {
    myReviews: (
      <div className="space-y-4">
        {mockReviews.length > 0 ? (
          mockReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {review.vehicleName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t("by")} {review.ownerName}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ReviewDisplay review={review} showOwnerResponse />
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<EmptyBoxIcon />}
            title={t("noReviews")}
            description={t("noReviewsDescription")}
          />
        )}
      </div>
    ),
    pending: (
      <div className="space-y-4">
        {pendingReviews.length > 0 ? (
          pendingReviews.map((pending) => (
            <Card key={pending.bookingId}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">
                      {pending.vehicleName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("by")} {pending.ownerName} •{" "}
                      {new Date(pending.tripDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    {t("writeReview")}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<EmptyBoxIcon />}
            title={t("noPendingReviews")}
            description={t("noPendingReviewsDescription")}
          />
        )}
      </div>
    ),
  };

  const tabs = [
    {
      id: "myReviews",
      label: t("myReviews"),
      badge: mockReviews.length,
      content: tabContent.myReviews,
    },
    {
      id: "pending",
      label: t("pendingReviews"),
      badge: pendingReviews.length,
      content: tabContent.pending,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("reviewsTitle")}
        description={t("reviewsDescription")}
      />

      {isLoading ? (
        <SkeletonList count={3} />
      ) : (
        <Tabs tabs={tabs} defaultTab="myReviews" variant="default" />
      )}
    </div>
  );
}

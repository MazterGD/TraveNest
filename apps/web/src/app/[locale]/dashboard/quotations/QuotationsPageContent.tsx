"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  PageHeader,
  Button,
  Tabs,
  EmptyState,
  EmptyBoxIcon,
  SkeletonList,
} from "@/components/ui";
import { QuotationRequestCard } from "@/components/features/customer";
import type { QuotationRequest } from "@/store";

// Mock data
const mockRequests: QuotationRequest[] = [
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
  {
    id: "req2",
    customerId: "c1",
    pickupLocation: {
      address: "Colombo Fort",
      city: "Colombo",
      district: "Colombo",
    },
    dropoffLocation: {
      address: "Sigiriya Rock",
      city: "Sigiriya",
      district: "Matale",
    },
    pickupDate: new Date(Date.now() + 86400000 * 14)
      .toISOString()
      .split("T")[0],
    pickupTime: "06:00",
    returnDate: new Date(Date.now() + 86400000 * 15)
      .toISOString()
      .split("T")[0],
    returnTime: "18:00",
    isRoundTrip: true,
    passengerCount: 6,
    vehicleType: "van",
    luggageCount: 4,
    needsAC: true,
    status: "active",
    quotationsCount: 3,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface QuotationsPageContentProps {
  locale: string;
}

export function QuotationsPageContent({ locale }: QuotationsPageContentProps) {
  const t = useTranslations("quotation");
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredRequests = mockRequests.filter((req) => {
    if (activeTab === "all") return true;
    return req.status === activeTab;
  });

  const tabs = [
    { id: "all", label: t("all"), badge: mockRequests.length },
    {
      id: "pending",
      label: t("pending"),
      badge: mockRequests.filter((r) => r.status === "pending").length,
    },
    {
      id: "active",
      label: t("active"),
      badge: mockRequests.filter((r) => r.status === "active").length,
    },
    {
      id: "completed",
      label: t("completed"),
      badge: mockRequests.filter((r) => r.status === "completed").length,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("myQuotationRequests")}
        description={t("quotationRequestsDescription")}
        action={
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
              {t("newRequest")}
            </Button>
          </Link>
        }
      />

      <Tabs
        tabs={tabs.map((tab) => ({
          ...tab,
          content: null,
        }))}
        defaultTab="all"
        onChange={setActiveTab}
        variant="pills"
      />

      {isLoading ? (
        <SkeletonList count={3} />
      ) : filteredRequests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredRequests.map((request) => (
            <QuotationRequestCard
              key={request.id}
              request={request}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<EmptyBoxIcon />}
          title={t("noRequests")}
          description={t("noRequestsDescription")}
          action={
            <Link href={`/${locale}/dashboard/quotations/new`}>
              <Button>{t("createFirstRequest")}</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}

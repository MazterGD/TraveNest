"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui";
import {
  QuotationRequestForm,
  type QuotationRequestInput,
} from "@/components/features/customer";

interface NewQuotationPageContentProps {
  locale: string;
}

export function NewQuotationPageContent({
  locale,
}: NewQuotationPageContentProps) {
  const t = useTranslations("quotation");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    data: QuotationRequestInput
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to quotations list on success
      router.push(`/${locale}/dashboard/quotations`);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to submit request" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title={t("createNewRequest")}
        subtitle={t("createNewRequestDescription")}
      />

      <QuotationRequestForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
}

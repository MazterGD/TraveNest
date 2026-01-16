import { getTranslations } from "next-intl/server";
import { ReviewsPageContent } from "./ReviewsPageContent";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "review" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function ReviewsPage({ params }: PageProps) {
  const { locale } = await params;

  return <ReviewsPageContent locale={locale} />;
}

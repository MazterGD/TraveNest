import { getTranslations } from "next-intl/server";
import { QuotationsPageContent } from "./QuotationsPageContent";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quotation" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function QuotationsPage({ params }: PageProps) {
  const { locale } = await params;

  return <QuotationsPageContent locale={locale} />;
}

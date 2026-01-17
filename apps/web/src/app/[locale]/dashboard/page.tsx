import { getTranslations } from "next-intl/server";
import { DashboardContent } from "./DashboardContent";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;

  return <DashboardContent locale={locale} />;
}

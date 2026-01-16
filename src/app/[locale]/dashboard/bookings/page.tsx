import { getTranslations } from "next-intl/server";
import { BookingsPageContent } from "./BookingsPageContent";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function BookingsPage({ params }: PageProps) {
  const { locale } = await params;

  return <BookingsPageContent locale={locale} />;
}

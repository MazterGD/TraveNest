import { getTranslations } from "next-intl/server";
import { NewQuotationPageContent } from "./NewQuotationPageContent";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quotation" });

  return {
    title: t("newRequestPageTitle"),
    description: t("newRequestPageDescription"),
  };
}

export default async function NewQuotationPage({ params }: PageProps) {
  const { locale } = await params;

  return <NewQuotationPageContent locale={locale} />;
}

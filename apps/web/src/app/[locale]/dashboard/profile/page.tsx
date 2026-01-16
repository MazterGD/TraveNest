import { getTranslations } from "next-intl/server";
import { ProfilePageContent } from "./ProfilePageContent";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;

  return <ProfilePageContent locale={locale} />;
}

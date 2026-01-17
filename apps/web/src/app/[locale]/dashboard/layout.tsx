import { DashboardLayoutClient } from "./DashboardLayoutClient";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;

  return (
    <DashboardLayoutClient locale={locale}>{children}</DashboardLayoutClient>
  );
}

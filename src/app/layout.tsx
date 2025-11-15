import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | TravelNest",
    default: "TravelNest - Sri Lanka's Premier Bus Rental Marketplace",
  },
  description:
    "Find and book buses for your group travel needs in Sri Lanka. Connect with verified bus owners, compare prices, and enjoy transparent booking.",
  keywords: [
    "bus rental",
    "sri lanka",
    "bus hire",
    "group travel",
    "charter bus",
    "travel",
    "transportation",
  ],
  authors: [{ name: "TravelNest" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TravelNest",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#EF5B0C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

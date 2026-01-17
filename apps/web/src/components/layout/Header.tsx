"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSignOutAlt, FaUser } from "react-icons/fa";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuthStore } from "@/store";
import { getDashboardUrl } from "@/lib/utils/getDashboardUrl";

export function Header() {
  const t = useTranslations("navigation");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  // Wait for hydration to complete before showing auth-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push(`/${locale}`);
  };

  // Show guest UI during SSR and initial hydration
  const showAuthenticatedUI = mounted && !isLoading && isAuthenticated && user;

  const navigation = [
    { name: t("home"), href: `/${locale}` },
    { name: t("search"), href: `/${locale}/search` },
    { name: t("howItWorks"), href: `/${locale}/how-it-works` },
    { name: t("about"), href: `/${locale}/about` },
    { name: t("contact"), href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">TN</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                TravelNest
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <LanguageSwitcher />
            {showAuthenticatedUI ? (
              <>
                <Link
                  href={getDashboardUrl(user, locale)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <FaUser className="h-4 w-4" />
                  {user.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  {t("logout", { defaultValue: "Logout" })}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  {t("register")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border pt-4 pb-1">
              {showAuthenticatedUI ? (
                <>
                  <Link
                    href={getDashboardUrl(user, locale)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUser className="h-4 w-4" />
                    {user.firstName}&apos;s Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="h-4 w-4" />
                    {t("logout", { defaultValue: "Logout" })}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/${locale}/login`}
                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("navigation");
  const params = useParams();
  const locale = params.locale as string;

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: tNav("home"), href: `/${locale}` },
    { name: tNav("search"), href: `/${locale}/search` },
    { name: tNav("howItWorks"), href: `/${locale}/how-it-works` },
    { name: tNav("about"), href: `/${locale}/about` },
  ];

  const supportLinks = [
    { name: tNav("contact"), href: `/${locale}/contact` },
    { name: "FAQ", href: `/${locale}/faq` },
  ];

  const legalLinks = [
    { name: t("privacyPolicy"), href: `/${locale}/privacy` },
    { name: t("termsOfService"), href: `/${locale}/terms` },
    { name: t("refundPolicy"), href: `/${locale}/refund-policy` },
  ];

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, href: "#" },
    { name: "Twitter", icon: FaTwitter, href: "#" },
    { name: "Instagram", icon: FaInstagram, href: "#" },
    { name: "LinkedIn", icon: FaLinkedinIn, href: "#" },
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-primary font-bold text-xl">TN</span>
              </div>
              <span className="text-xl font-bold">TravelNest</span>
            </Link>
            <p className="mt-4 text-sm text-muted">{t("description")}</p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted hover:text-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {t("quickLinks")}
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {t("support")}
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {t("legal")}
            </h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-secondary pt-8">
          <p className="text-center text-sm text-muted">
            © {currentYear} TravelNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

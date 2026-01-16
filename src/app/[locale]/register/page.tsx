"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaBus, FaUser } from "react-icons/fa";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader, Input, Button, Card } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

type AccountType = "customer" | "owner";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const params = useParams();
  const locale = params.locale as string;

  const [accountType, setAccountType] = useState<AccountType>("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement registration logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <MainLayout>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            {/* Account Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-foreground mb-3">
                {t("accountType")}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType("customer")}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors",
                    accountType === "customer"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <FaUser className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{t("customer")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("owner")}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors",
                    accountType === "owner"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <FaBus className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{t("owner")}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label={t("name")}
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Input
                label={t("email")}
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <Input
                label={t("phone")}
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />

              <Input
                label={t("password")}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <Input
                label={t("confirmPassword")}
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />

              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="h-4 w-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeTerms: e.target.checked })
                  }
                  required
                />
                <span className="ml-2 text-sm text-muted-foreground">
                  {t("terms")}{" "}
                  <Link
                    href={`/${locale}/terms`}
                    className="text-primary hover:underline"
                  >
                    {t("termsLink")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link
                    href={`/${locale}/privacy`}
                    className="text-primary hover:underline"
                  >
                    {t("privacyLink")}
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                {t("submit")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t("hasAccount")}{" "}
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary hover:underline"
              >
                {t("login")}
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader, Input, Button, Card } from "@/components/ui";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement login logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <MainLayout>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                label={t("password")}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                  />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {t("rememberMe")}
                  </span>
                </label>
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-sm text-primary hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

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
              {t("noAccount")}{" "}
              <Link
                href={`/${locale}/register`}
                className="font-medium text-primary hover:underline"
              >
                {t("register")}
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  PageHeader,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Avatar,
  SkeletonProfile,
} from "@/components/ui";

interface ProfilePageContentProps {
  locale: string;
}

// Mock user data
const mockUser = {
  id: "1",
  email: "john.doe@example.com",
  name: "John Doe",
  phone: "+94 77 123 4567",
  role: "customer" as const,
  isVerified: true,
  createdAt: new Date().toISOString(),
  avatar: null as string | null,
};

export function ProfilePageContent({ locale }: ProfilePageContentProps) {
  const t = useTranslations("profile");
  const [isLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    phone: mockUser.phone,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t("nameRequired");
    if (!formData.phone.trim()) newErrors.phone = t("phoneRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Profile updated:", formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: mockUser.name,
      phone: mockUser.phone,
    });
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading) {
    return <SkeletonProfile />;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title={t("myProfile")} subtitle={t("profileDescription")} />

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar name={mockUser.name} size="xl" src={mockUser.avatar} />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">
                {mockUser.name}
              </h2>
              <p className="text-muted-foreground">{mockUser.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {mockUser.isVerified ? (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("verified")}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    {t("unverified")}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {t("memberSince")}{" "}
                  {new Date(mockUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {t("changePhoto")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("personalInfo")}</CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              {t("edit")}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                label={t("fullName")}
                disabled={!isEditing}
                error={errors.name}
              />
              <Input
                label={t("email")}
                value={mockUser.email}
                disabled
                helperText={t("emailCannotBeChanged")}
              />
              <Input
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                label={t("phone")}
                disabled={!isEditing}
                error={errors.phone}
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  {t("cancel")}
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  {t("saveChanges")}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t("security")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">{t("password")}</p>
              <p className="text-sm text-muted-foreground">
                {t("passwordDescription")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t("changePassword")}
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">{t("twoFactor")}</p>
              <p className="text-sm text-muted-foreground">
                {t("twoFactorDescription")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t("enable")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">{t("dangerZone")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">
                {t("deleteAccount")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("deleteAccountDescription")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              {t("delete")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

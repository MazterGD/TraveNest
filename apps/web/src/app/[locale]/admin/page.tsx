"use client";

import { useTranslations } from "next-intl";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, LoadingSpinner } from "@/components/ui";
import { useAuthStore } from "@/store";
import { useAdminGuard } from "@/hooks";

export default function AdminDashboardPage() {
  const t = useTranslations();
  const { user } = useAuthStore();

  // Protect this route - only admins can access
  const { isLoading: guardLoading, isAuthorized } = useAdminGuard();

  // Show loading while checking auth state
  if (guardLoading || !isAuthorized || !user) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("adminDashboard", { defaultValue: "Admin Dashboard" })}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t("systemOverview", {
                defaultValue: "System Overview and Management",
              })}
            </p>
          </div>

          {/* System Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("totalUsers", { defaultValue: "Total Users" })}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    0
                  </p>
                </div>
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/30">
                  <svg
                    className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("totalVehicles", { defaultValue: "Total Vehicles" })}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    0
                  </p>
                </div>
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                  <svg
                    className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("totalBookings", { defaultValue: "Total Bookings" })}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    0
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("totalRevenue", { defaultValue: "Total Revenue" })}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    LKR 0
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                  <svg
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </Card>
          </div>

          {/* Management Sections */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* User Management */}
            <Card className="bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("userManagement", { defaultValue: "User Management" })}
                </h2>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  {t("viewAll", { defaultValue: "View All" })}
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        C
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t("customers", { defaultValue: "Customers" })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        0 {t("users", { defaultValue: "users" })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        O
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t("vehicleOwners", { defaultValue: "Vehicle Owners" })}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        0 {t("users", { defaultValue: "users" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t("pendingApprovals", { defaultValue: "Pending Approvals" })}
                </h2>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  0 {t("pending", { defaultValue: "pending" })}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <svg
                  className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("noPendingApprovals", {
                    defaultValue: "No pending approvals",
                  })}
                </p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/30">
                  <svg
                    className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t("manageUsers", { defaultValue: "Manage Users" })}
                </h3>
              </div>
            </Card>

            <Card className="cursor-pointer bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                  <svg
                    className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t("verifications", { defaultValue: "Verifications" })}
                </h3>
              </div>
            </Card>

            <Card className="cursor-pointer bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t("reports", { defaultValue: "Reports" })}
                </h3>
              </div>
            </Card>

            <Card className="cursor-pointer bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                  <svg
                    className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t("settings", { defaultValue: "Settings" })}
                </h3>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

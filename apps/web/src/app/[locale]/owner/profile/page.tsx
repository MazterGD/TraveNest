"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui";
import { useAuthStore } from "@/store";
import { useOwnerGuard } from "@/hooks";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUpload,
  FaFileAlt,
  FaCheckCircle,
  FaEye,
  FaDownload,
  FaLock,
  FaUser,
  FaArrowLeft,
  FaExclamationCircle,
} from "react-icons/fa";

type ProfileTab = "business" | "documents" | "personal" | "security";

interface Document {
  key: string;
  label: string;
  name: string | null;
  status: "verified" | "pending" | "rejected" | "missing";
  uploadDate: string | null;
  expiryDate: string | null;
}

export default function OwnerProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>("business");

  // Protect this route - only vehicle owners can access
  const { isLoading: guardLoading, isAuthorized } = useOwnerGuard();

  // Mock verification status - replace with API data
  const verificationStatus: "pending" | "verified" | "rejected" =
    user?.isVerified ? "verified" : "pending";

  // Mock documents - replace with API data
  const documents: Document[] = [
    {
      key: "license",
      label: "Business License",
      name: null,
      status: "missing",
      uploadDate: null,
      expiryDate: null,
    },
    {
      key: "insurance",
      label: "Insurance Certificate",
      name: null,
      status: "missing",
      uploadDate: null,
      expiryDate: null,
    },
    {
      key: "registration",
      label: "Vehicle Registration",
      name: null,
      status: "missing",
      uploadDate: null,
      expiryDate: null,
    },
    {
      key: "permit",
      label: "Operating Permit",
      name: null,
      status: "missing",
      uploadDate: null,
      expiryDate: null,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "rejected":
        return "text-red-700 bg-red-100";
      case "missing":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
            <Link
              href="/owner/dashboard"
              className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Profile & Verification
            </h1>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Verification Status Banner */}
          {verificationStatus === "verified" && (
            <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <FaCheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h2 className="font-semibold text-gray-900">
                      Verification Complete
                    </h2>
                    <span className="rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      Verified
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Your business is fully verified. You can now receive
                    quotation requests and manage bookings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {verificationStatus === "pending" && (
            <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <FaExclamationCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h2 className="font-semibold text-gray-900">
                      Verification Pending
                    </h2>
                    <span className="rounded-full bg-yellow-600 px-2.5 py-0.5 text-xs font-medium text-white">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Your account is under review. This typically takes 2-3
                    business days. You&apos;ll be notified once approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6">
              <nav className="flex gap-8">
                {[
                  {
                    id: "business",
                    label: "Business Information",
                    icon: FaBuilding,
                  },
                  { id: "documents", label: "Documents", icon: FaFileAlt },
                  { id: "personal", label: "Personal", icon: FaUser },
                  { id: "security", label: "Security", icon: FaLock },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ProfileTab)}
                    className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Business Information Tab */}
              {activeTab === "business" && (
                <div className="max-w-3xl">
                  <div className="mb-6">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Business Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage your business information
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Business Name
                        </label>
                        <input
                          type="text"
                          defaultValue=""
                          placeholder="Enter business name"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Business Type
                        </label>
                        <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option>Private Limited Company</option>
                          <option>Sole Proprietorship</option>
                          <option>Partnership</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          defaultValue=""
                          placeholder="Enter registration number"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          TIN Number
                        </label>
                        <input
                          type="text"
                          placeholder="123-456-789"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Business Address
                      </label>
                      <textarea
                        rows={3}
                        defaultValue=""
                        placeholder="Enter business address"
                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      ></textarea>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="Colombo"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          District
                        </label>
                        <select className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                          <option>Colombo</option>
                          <option>Gampaha</option>
                          <option>Kandy</option>
                          <option>Galle</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          placeholder="00300"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="max-w-4xl">
                  <div className="mb-6">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Business Documents
                    </h3>
                    <p className="text-sm text-gray-600">
                      Upload and manage your verification documents
                    </p>
                  </div>

                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.key}
                        className="rounded-lg border border-gray-200 p-5"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h4 className="mb-1 font-medium text-gray-900">
                              {doc.label}
                            </h4>
                            {doc.name && (
                              <p className="text-sm text-gray-600">
                                {doc.name}
                              </p>
                            )}
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                              doc.status,
                            )}`}
                          >
                            {doc.status}
                          </span>
                        </div>

                        {doc.name && (
                          <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Uploaded</div>
                              <div className="font-medium text-gray-900">
                                {doc.uploadDate}
                              </div>
                            </div>
                            {doc.expiryDate && (
                              <div>
                                <div className="text-gray-500">Expires</div>
                                <div className="font-medium text-gray-900">
                                  {doc.expiryDate}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {doc.name ? (
                            <>
                              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                                <FaEye className="h-4 w-4" />
                                View
                              </button>
                              <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                                <FaDownload className="h-4 w-4" />
                                Download
                              </button>
                              <button className="flex items-center gap-2 rounded-lg border border-primary px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5">
                                <FaUpload className="h-4 w-4" />
                                Replace
                              </button>
                            </>
                          ) : (
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                              <FaUpload className="h-4 w-4" />
                              Upload Document
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <FaFileAlt className="h-5 w-5 flex-shrink-0 text-blue-600" />
                      <div className="text-sm">
                        <div className="mb-1 font-medium text-gray-900">
                          Document Requirements
                        </div>
                        <ul className="space-y-1 text-gray-600">
                          <li>• All documents must be clear and readable</li>
                          <li>• Accepted formats: PDF, JPG, PNG (Max 5MB)</li>
                          <li>• Update expired documents promptly</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div className="max-w-3xl">
                  <div className="mb-6">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Personal Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Update your personal details
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.firstName}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user.lastName}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            defaultValue={user.email}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <div className="relative">
                          <FaPhone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            defaultValue={user.phone || ""}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="max-w-3xl">
                  <div className="mb-6">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      Security Settings
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage your account security
                    </p>
                  </div>

                  <div className="mb-5 rounded-lg border border-gray-200 p-5">
                    <h4 className="mb-4 font-medium text-gray-900">
                      Change Password
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="mb-1 font-medium text-gray-900">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-gray-600">
                          Add extra security to your account
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

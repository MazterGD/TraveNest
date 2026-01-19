"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui";
import { useAuthStore } from "@/store";
import { useOwnerGuard } from "@/hooks";
import {
  FaPlus,
  FaSearch,
  FaStar,
  FaEdit,
  FaEye,
  FaArrowLeft,
  FaFilter,
  FaBus,
  FaUsers,
} from "react-icons/fa";

type VehicleStatus = "all" | "active" | "inactive" | "pending";

interface Vehicle {
  id: string;
  image: string;
  registration: string;
  type: string;
  capacity: number;
  rating: number;
  bookings: number;
  status: "active" | "inactive" | "pending";
  acType: string;
}

export default function FleetManagementPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<VehicleStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Protect this route - only vehicle owners can access
  const { isLoading: guardLoading, isAuthorized } = useOwnerGuard();

  // Sample vehicles - will be replaced with API data
  const vehicles: Vehicle[] = [];

  const filteredVehicles = vehicles.filter((v) => {
    const matchesTab = activeTab === "all" || v.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      v.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const tabCounts = {
    all: vehicles.length,
    active: vehicles.filter((v) => v.status === "active").length,
    inactive: vehicles.filter((v) => v.status === "inactive").length,
    pending: vehicles.filter((v) => v.status === "pending").length,
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Fleet Management
                </h1>
                <p className="mt-0.5 text-sm text-gray-500">
                  {filteredVehicles.length} vehicle
                  {filteredVehicles.length !== 1 && "s"}
                </p>
              </div>
              <Link
                href="/owner/fleet/add"
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                <FaPlus className="h-4 w-4" />
                Add Vehicle
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Filters */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-2">
                {(
                  [
                    { id: "all", label: "All Vehicles" },
                    { id: "active", label: "Active" },
                    { id: "inactive", label: "Inactive" },
                    { id: "pending", label: "Pending" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label} ({tabCounts[tab.id]})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by registration or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50">
                <FaFilter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Vehicle Grid */}
          {filteredVehicles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
                >
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.registration}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute left-3 top-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                          vehicle.status,
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </div>
                    {vehicle.status === "active" && vehicle.rating > 0 && (
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
                        <FaStar className="h-3.5 w-3.5 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {vehicle.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="mb-1 font-semibold text-gray-900">
                        {vehicle.registration}
                      </h3>
                      <p className="text-sm text-gray-600">{vehicle.type}</p>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="mb-0.5 text-gray-500">Capacity</div>
                        <div className="font-medium text-gray-900">
                          {vehicle.capacity} seats
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 text-gray-500">AC Type</div>
                        <div className="font-medium text-gray-900">
                          {vehicle.acType}
                        </div>
                      </div>
                      {vehicle.status !== "pending" && (
                        <>
                          <div>
                            <div className="mb-0.5 text-gray-500">Bookings</div>
                            <div className="font-medium text-gray-900">
                              {vehicle.bookings}
                            </div>
                          </div>
                          <div>
                            <div className="mb-0.5 text-gray-500">Rating</div>
                            <div className="font-medium text-gray-900">
                              {vehicle.rating}/5.0
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {vehicle.status === "pending" && (
                      <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3">
                        <p className="text-xs font-medium text-yellow-700">
                          Awaiting verification approval
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link
                        href={`/owner/fleet/${vehicle.id}/edit`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <FaEdit className="h-4 w-4" />
                        Edit
                      </Link>
                      <Link
                        href={`/owner/fleet/${vehicle.id}`}
                        className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-gray-800"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto max-w-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <FaBus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  No Vehicles Found
                </h3>
                <p className="mb-6 text-sm text-gray-600">
                  {activeTab === "all"
                    ? "You haven't added any vehicles yet. Start by adding your first vehicle."
                    : `No ${activeTab} vehicles found.`}
                </p>
                <Link
                  href="/owner/fleet/add"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  <FaPlus className="h-4 w-4" />
                  Add Your First Vehicle
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

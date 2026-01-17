"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  FaFilter,
  FaStar,
  FaUsers,
  FaSnowflake,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader, Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils/cn";
import { VEHICLE_AMENITIES, SRI_LANKAN_DISTRICTS } from "@/constants";

// Mock data for demonstration
const MOCK_BUSES = [
  {
    id: "1",
    name: "Luxury Coach - 45 Seater",
    type: "luxury_bus",
    capacity: 45,
    acType: "ac",
    pricePerDay: 25000,
    rating: 4.8,
    totalReviews: 124,
    image: "/placeholder-bus.jpg",
    amenities: ["wifi", "ac", "usb_charging", "entertainment"],
    owner: "Colombo Tours",
  },
  {
    id: "2",
    name: "Semi-Luxury Bus - 35 Seater",
    type: "semi_luxury_bus",
    capacity: 35,
    acType: "ac",
    pricePerDay: 18000,
    rating: 4.5,
    totalReviews: 89,
    image: "/placeholder-bus.jpg",
    amenities: ["ac", "usb_charging", "reclining_seats"],
    owner: "Lanka Express",
  },
  {
    id: "3",
    name: "Mini Bus - 15 Seater",
    type: "mini_bus",
    capacity: 15,
    acType: "non_ac",
    pricePerDay: 8000,
    rating: 4.2,
    totalReviews: 56,
    image: "/placeholder-bus.jpg",
    amenities: ["gps", "first_aid"],
    owner: "Quick Travels",
  },
];

const VEHICLE_TYPES = [
  { value: "mini_bus", label: "Mini Bus" },
  { value: "standard_bus", label: "Standard Bus" },
  { value: "semi_luxury_bus", label: "Semi-Luxury Bus" },
  { value: "luxury_bus", label: "Luxury Bus" },
];

const AC_TYPES = [
  { value: "ac", label: "AC" },
  { value: "non_ac", label: "Non-AC" },
];

export default function SearchPage() {
  const t = useTranslations("search");
  const tCommon = useTranslations("common");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    vehicleType: "",
    minCapacity: "",
    maxCapacity: "",
    acType: "",
    district: "",
    amenities: [] as string[],
  });

  const toggleAmenity = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      vehicleType: "",
      minCapacity: "",
      maxCapacity: "",
      acType: "",
      district: "",
      amenities: [],
    });
  };

  return (
    <MainLayout>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Mobile Filter Toggle */}
            <div className="mb-6 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <FaFilter className="mr-2 h-4 w-4" />
                {t("filters.title")}
              </Button>
            </div>

            {/* Filters Sidebar */}
            <aside
              className={cn(
                "lg:col-span-1",
                showFilters ? "block" : "hidden lg:block"
              )}
            >
              <Card className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {t("filters.title")}
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("filters.clearAll")}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("filters.vehicleType")}
                    </label>
                    <select
                      value={filters.vehicleType}
                      onChange={(e) =>
                        setFilters({ ...filters, vehicleType: e.target.value })
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">All Types</option>
                      {VEHICLE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("filters.capacity")}
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minCapacity}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minCapacity: e.target.value,
                          })
                        }
                        className="w-1/2"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxCapacity}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxCapacity: e.target.value,
                          })
                        }
                        className="w-1/2"
                      />
                    </div>
                  </div>

                  {/* AC Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("filters.acType")}
                    </label>
                    <div className="flex gap-2">
                      {AC_TYPES.map((type) => (
                        <button
                          key={type.value}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              acType:
                                filters.acType === type.value ? "" : type.value,
                            })
                          }
                          className={cn(
                            "flex-1 px-3 py-2 text-sm rounded-md border transition-colors",
                            filters.acType === type.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-muted-foreground"
                          )}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("filters.district")}
                    </label>
                    <select
                      value={filters.district}
                      onChange={(e) =>
                        setFilters({ ...filters, district: e.target.value })
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">All Districts</option>
                      {SRI_LANKAN_DISTRICTS.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("filters.amenities")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {VEHICLE_AMENITIES.slice(0, 6).map((amenity) => (
                        <button
                          key={amenity.id}
                          onClick={() => toggleAmenity(amenity.id)}
                          className={cn(
                            "px-3 py-1.5 text-xs rounded-full border transition-colors",
                            filters.amenities.includes(amenity.id)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-muted-foreground"
                          )}
                        >
                          {amenity.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {MOCK_BUSES.length}
                  </span>{" "}
                  {t("results")}
                </p>
                <select className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <option value="">{t("sort.label")}</option>
                  <option value="price_asc">{t("sort.priceAsc")}</option>
                  <option value="price_desc">{t("sort.priceDesc")}</option>
                  <option value="rating">{t("sort.rating")}</option>
                  <option value="newest">{t("sort.newest")}</option>
                </select>
              </div>

              {/* Bus Cards */}
              <div className="space-y-4">
                {MOCK_BUSES.map((bus) => (
                  <Card key={bus.id} hover className="p-0 overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image placeholder */}
                      <div className="sm:w-64 h-48 sm:h-auto bg-muted flex items-center justify-center">
                        <FaMapMarkerAlt className="h-12 w-12 text-muted-foreground/30" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              {bus.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {bus.owner}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center mt-2">
                              <FaStar className="h-4 w-4 text-accent" />
                              <span className="ml-1 text-sm font-medium text-foreground">
                                {bus.rating}
                              </span>
                              <span className="ml-1 text-sm text-muted-foreground">
                                ({bus.totalReviews} reviews)
                              </span>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-3 mt-3">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <FaUsers className="mr-1.5 h-4 w-4" />
                                {bus.capacity} {tCommon("passengers")}
                              </div>
                              {bus.acType === "ac" && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <FaSnowflake className="mr-1.5 h-4 w-4" />
                                  AC
                                </div>
                              )}
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {bus.amenities.slice(0, 4).map((amenity) => {
                                const amenityInfo = VEHICLE_AMENITIES.find(
                                  (a) => a.id === amenity
                                );
                                return (
                                  <span
                                    key={amenity}
                                    className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                                  >
                                    {amenityInfo?.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              Rs. {bus.pricePerDay.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {tCommon("perDay")}
                            </p>
                            <Button className="mt-4" size="sm">
                              {tCommon("view")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {MOCK_BUSES.length === 0 && (
                <Card className="text-center py-12">
                  <FaMapMarkerAlt className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {t("noResults")}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {t("adjustFilters")}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

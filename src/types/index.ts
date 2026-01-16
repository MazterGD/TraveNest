/**
 * TravelNest Type Definitions
 * Centralized type definitions for the entire application
 */

// User Types
export enum UserRole {
  CUSTOMER = "customer",
  OWNER = "owner",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
}

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  name: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vehicle Types
export enum VehicleType {
  MINI_BUS = "mini_bus",
  STANDARD_BUS = "standard_bus",
  LUXURY_BUS = "luxury_bus",
  SEMI_LUXURY_BUS = "semi_luxury_bus",
}

export enum ACType {
  AC = "ac",
  NON_AC = "non_ac",
}

export enum VehicleStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING_VERIFICATION = "pending_verification",
  UNDER_MAINTENANCE = "under_maintenance",
}

export interface Vehicle {
  id: string;
  ownerId: string;
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  capacity: number;
  acType: ACType;
  color: string;
  description?: string;
  basePricePerKm: number;
  basePricePerDay: number;
  driverAllowancePerDay: number;
  amenities: string[];
  images: string[];
  status: VehicleStatus;
  gpsEnabled: boolean;
  averageRating?: number;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

// Booking Types
export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  DISPUTED = "disputed",
}

export enum PaymentStatus {
  PENDING = "pending",
  PARTIAL = "partial",
  PAID = "paid",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export interface Booking {
  id: string;
  customerId: string;
  ownerId: string;
  vehicleId: string;
  quotationId: string;
  bookingReference: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  pickupLocation: Location;
  destination: Location;
  stops: Location[];
  startDate: Date;
  endDate: Date;
  startTime: string;
  passengerCount: number;
  specialRequirements?: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Quotation Types
export enum QuotationStatus {
  PENDING = "pending",
  SENT = "sent",
  VIEWED = "viewed",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export interface Quotation {
  id: string;
  requestId: string;
  ownerId: string;
  vehicleId: string;
  status: QuotationStatus;
  vehicleRentalCost: number;
  driverCost: number;
  fuelCost: number;
  tollCharges: number;
  permitFees: number;
  otherCharges: number;
  tax: number;
  totalAmount: number;
  validityDays: number;
  expiryDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Location Type
export interface Location {
  address: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  district?: string;
}

// Review Types
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  ownerId: string;
  vehicleId: string;
  overallRating: number;
  vehicleConditionRating: number;
  driverBehaviorRating: number;
  punctualityRating: number;
  cleanlinessRating: number;
  valueForMoneyRating: number;
  title?: string;
  comment?: string;
  images?: string[];
  recommended: boolean;
  ownerResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Common Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Language Type
export type Locale = "en" | "si" | "ta";

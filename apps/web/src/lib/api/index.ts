// API Client
export { api, ApiError } from "./client";

// API Services
export {
  // Auth
  authService,
  type AuthResponse,
  type TokenResponse,
  type MessageResponse,

  // User
  userService,

  // Vehicle
  vehicleService,
  type VehicleSearchParams,

  // Quotation
  quotationService,

  // Booking
  bookingService,
  type BookingSearchParams,

  // Review
  reviewService,

  // Payment
  paymentService,
  type PaymentIntent,

  // Notification
  notificationService,
  type Notification,

  // Search
  searchService,
  type SearchParams,

  // Admin
  adminService,

  // Owner Registration
  ownerRegistrationService,

  // Pagination
  type PaginationParams,
} from "./services";

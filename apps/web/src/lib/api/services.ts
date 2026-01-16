import { api, ApiError } from "./client";
import {
  User,
  Vehicle,
  Booking,
  Quotation,
  Review,
  PaginatedResponse,
} from "@/types";
import {
  LoginInput,
  RegisterInput,
  QuotationRequestInput,
  VehicleInput,
  QuotationResponseInput,
  ReviewInput,
  ProfileUpdateInput,
} from "@/lib/validations";

// ============================================
// Auth Services
// ============================================
export const authService = {
  login: (data: LoginInput) =>
    api.post<{ user: User; token: string }>("/auth/login", data),

  register: (data: RegisterInput) =>
    api.post<{ user: User; token: string }>("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  me: () => api.get<User>("/auth/me"),

  refreshToken: () => api.post<{ token: string }>("/auth/refresh"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
};

// ============================================
// User Services
// ============================================
export const userService = {
  getProfile: () => api.get<User>("/users/profile"),

  updateProfile: (data: ProfileUpdateInput) =>
    api.patch<User>("/users/profile", data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/users/change-password", { currentPassword, newPassword }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    // Note: For file uploads, we'd need to handle differently
    return api.post<{ url: string }>("/users/avatar", formData);
  },
};

// ============================================
// Vehicle Services
// ============================================
export const vehicleService = {
  getAll: (params?: { page?: number; limit?: number; type?: string }) =>
    api.get<PaginatedResponse<Vehicle>>(
      `/vehicles?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`
    ),

  getById: (id: string) => api.get<Vehicle>(`/vehicles/${id}`),

  create: (data: VehicleInput) => api.post<Vehicle>("/vehicles", data),

  update: (id: string, data: Partial<VehicleInput>) =>
    api.patch<Vehicle>(`/vehicles/${id}`, data),

  delete: (id: string) => api.delete(`/vehicles/${id}`),

  getByOwner: (ownerId: string) =>
    api.get<Vehicle[]>(`/vehicles/owner/${ownerId}`),

  getMyVehicles: () => api.get<Vehicle[]>("/vehicles/my"),

  setAvailability: (id: string, available: boolean) =>
    api.patch(`/vehicles/${id}/availability`, { available }),
};

// ============================================
// Quotation Services
// ============================================
export const quotationService = {
  // Customer endpoints
  requestQuotation: (data: QuotationRequestInput) =>
    api.post<Quotation>("/quotations/request", data),

  getMyRequests: () => api.get<Quotation[]>("/quotations/my-requests"),

  getQuotesForRequest: (requestId: string) =>
    api.get<Quotation[]>(`/quotations/request/${requestId}/quotes`),

  acceptQuotation: (id: string) =>
    api.post<Booking>(`/quotations/${id}/accept`),

  rejectQuotation: (id: string) => api.post(`/quotations/${id}/reject`),

  // Owner endpoints
  getPendingRequests: () => api.get<Quotation[]>("/quotations/pending"),

  submitQuote: (data: QuotationResponseInput) =>
    api.post<Quotation>("/quotations/submit", data),

  getMyQuotes: () => api.get<Quotation[]>("/quotations/my-quotes"),
};

// ============================================
// Booking Services
// ============================================
export const bookingService = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Booking>>(
      `/bookings?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`
    ),

  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),

  getMyBookings: () => api.get<Booking[]>("/bookings/my"),

  cancel: (id: string, reason: string) =>
    api.post(`/bookings/${id}/cancel`, { reason }),

  complete: (id: string) => api.post(`/bookings/${id}/complete`),

  // Owner endpoints
  getOwnerBookings: () => api.get<Booking[]>("/bookings/owner"),

  confirmBooking: (id: string) => api.post(`/bookings/${id}/confirm`),
};

// ============================================
// Review Services
// ============================================
export const reviewService = {
  create: (data: ReviewInput) => api.post<Review>("/reviews", data),

  getByVehicle: (vehicleId: string) =>
    api.get<Review[]>(`/reviews/vehicle/${vehicleId}`),

  getByOwner: (ownerId: string) =>
    api.get<Review[]>(`/reviews/owner/${ownerId}`),

  getMyReviews: () => api.get<Review[]>("/reviews/my"),
};

// ============================================
// Search Services
// ============================================
export const searchService = {
  searchVehicles: (params: {
    pickup: string;
    dropoff: string;
    date: string;
    passengers: number;
    vehicleType?: string;
  }) => {
    const searchParams = new URLSearchParams({
      pickup: params.pickup,
      dropoff: params.dropoff,
      date: params.date,
      passengers: String(params.passengers),
      ...(params.vehicleType && { vehicleType: params.vehicleType }),
    });
    return api.get<Vehicle[]>(`/search/vehicles?${searchParams.toString()}`);
  },

  getPopularRoutes: () =>
    api.get<{ from: string; to: string; count: number }[]>(
      "/search/popular-routes"
    ),
};

// ============================================
// Admin Services
// ============================================
export const adminService = {
  // User management
  getUsers: (params?: { role?: string; status?: string; page?: number }) =>
    api.get<PaginatedResponse<User>>(
      `/admin/users?${new URLSearchParams(
        params as Record<string, string>
      ).toString()}`
    ),

  getUserById: (id: string) => api.get<User>(`/admin/users/${id}`),

  updateUserStatus: (id: string, status: string) =>
    api.patch(`/admin/users/${id}/status`, { status }),

  // Owner verification
  getPendingVerifications: () =>
    api.get<User[]>("/admin/verifications/pending"),

  verifyOwner: (id: string) => api.post(`/admin/verifications/${id}/approve`),

  rejectVerification: (id: string, reason: string) =>
    api.post(`/admin/verifications/${id}/reject`, { reason }),

  // Analytics
  getDashboardStats: () =>
    api.get<{
      totalUsers: number;
      totalBookings: number;
      totalRevenue: number;
      pendingVerifications: number;
    }>("/admin/stats"),

  getRevenueReport: (period: "week" | "month" | "year") =>
    api.get<{ date: string; amount: number }[]>(
      `/admin/reports/revenue?period=${period}`
    ),

  // Disputes
  getDisputes: () =>
    api.get<
      { id: string; bookingId: string; reason: string; status: string }[]
    >("/admin/disputes"),

  resolveDispute: (id: string, resolution: string) =>
    api.post(`/admin/disputes/${id}/resolve`, { resolution }),
};

export type { ApiError };

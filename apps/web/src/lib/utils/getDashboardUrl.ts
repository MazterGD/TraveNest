import { UserRole, type User } from "@/types";

/**
 * Get the appropriate dashboard URL based on user role
 */
export function getDashboardUrl(user: User, locale: string): string {
  switch (user.role) {
    case UserRole.ADMIN:
      return `/${locale}/admin`;
    case UserRole.VEHICLE_OWNER:
      return `/${locale}/owner/dashboard`;
    case UserRole.CUSTOMER:
    default:
      return `/${locale}/dashboard`;
  }
}

/**
 * Get dashboard path without locale prefix (for middleware use)
 */
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin";
    case UserRole.VEHICLE_OWNER:
      return "/owner/dashboard";
    case UserRole.CUSTOMER:
    default:
      return "/dashboard";
  }
}

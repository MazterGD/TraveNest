"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store";
import { getDashboardUrl } from "@/lib/utils/getDashboardUrl";
import { UserRole } from "@/types";

type GuardType = "auth" | "guest" | "role";

interface UseAuthGuardOptions {
  /**
   * Type of guard:
   * - "auth": Requires user to be logged in
   * - "guest": Requires user to NOT be logged in (for login/register pages)
   * - "role": Requires specific role(s)
   */
  type: GuardType;
  /**
   * Required roles (only for "role" type)
   */
  allowedRoles?: UserRole[];
  /**
   * Custom redirect path for unauthorized access
   */
  redirectTo?: string;
}

interface UseAuthGuardResult {
  isLoading: boolean;
  isAuthorized: boolean;
}

/**
 * Hook for protecting routes based on authentication state and user roles.
 * Handles redirects automatically and prevents flash of unauthorized content.
 */
export function useAuthGuard(options: UseAuthGuardOptions): UseAuthGuardResult {
  const { type, allowedRoles = [], redirectTo } = options;
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Wait for auth store to hydrate from localStorage
    if (authLoading) {
      return;
    }

    let authorized = false;
    let redirectPath: string | null = null;

    switch (type) {
      case "guest":
        // Guest routes (login, register) - redirect to dashboard if logged in
        if (isAuthenticated && user) {
          authorized = false;
          redirectPath = redirectTo || getDashboardUrl(user, locale);
        } else {
          authorized = true;
        }
        break;

      case "auth":
        // Protected routes - redirect to login if not logged in
        if (isAuthenticated && user) {
          authorized = true;
        } else {
          authorized = false;
          redirectPath = redirectTo || `/${locale}/login`;
        }
        break;

      case "role":
        // Role-based routes - check if user has required role
        if (!isAuthenticated || !user) {
          authorized = false;
          redirectPath = redirectTo || `/${locale}/login`;
        } else if (
          allowedRoles.length > 0 &&
          !allowedRoles.includes(user.role)
        ) {
          authorized = false;
          // Redirect to their appropriate dashboard instead
          redirectPath = getDashboardUrl(user, locale);
        } else {
          authorized = true;
        }
        break;
    }

    setIsAuthorized(authorized);
    setIsChecking(false);

    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [
    type,
    allowedRoles,
    redirectTo,
    isAuthenticated,
    user,
    authLoading,
    router,
    locale,
  ]);

  return {
    isLoading: authLoading || isChecking,
    isAuthorized,
  };
}

/**
 * Convenience hook for guest-only pages (login, register)
 */
export function useGuestGuard() {
  return useAuthGuard({ type: "guest" });
}

/**
 * Convenience hook for authenticated-only pages
 */
export function useAuthRequired() {
  return useAuthGuard({ type: "auth" });
}

/**
 * Convenience hook for customer-only pages
 */
export function useCustomerGuard() {
  return useAuthGuard({ type: "role", allowedRoles: [UserRole.CUSTOMER] });
}

/**
 * Convenience hook for vehicle owner-only pages
 */
export function useOwnerGuard() {
  return useAuthGuard({ type: "role", allowedRoles: [UserRole.VEHICLE_OWNER] });
}

/**
 * Convenience hook for admin-only pages
 */
export function useAdminGuard() {
  return useAuthGuard({ type: "role", allowedRoles: [UserRole.ADMIN] });
}

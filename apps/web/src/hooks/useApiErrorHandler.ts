"use client";

import { useCallback } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { ApiError } from "@/lib/api";

/**
 * Error messages mapped to error codes
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  TOKEN_INVALID: "Invalid authentication token",
  UNAUTHORIZED: "You need to be logged in to perform this action",
  FORBIDDEN: "You don't have permission to perform this action",
  ACCOUNT_DISABLED: "Your account has been disabled",
  EMAIL_NOT_VERIFIED: "Please verify your email address",

  // Validation errors
  VALIDATION_ERROR: "Please check the form for errors",
  INVALID_INPUT: "Invalid input provided",
  MISSING_REQUIRED_FIELD: "Please fill in all required fields",

  // Resource errors
  RESOURCE_NOT_FOUND: "The requested resource was not found",
  RESOURCE_ALREADY_EXISTS: "This resource already exists",
  RESOURCE_CONFLICT: "A conflict occurred with the current state",

  // Business logic errors
  BOOKING_NOT_AVAILABLE: "This booking slot is no longer available",
  VEHICLE_NOT_AVAILABLE: "This vehicle is not available for the selected dates",
  QUOTATION_EXPIRED: "This quotation has expired",
  PAYMENT_FAILED: "Payment processing failed. Please try again.",
  INSUFFICIENT_FUNDS: "Insufficient funds for this transaction",

  // Network errors
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  REQUEST_TIMEOUT: "The request timed out. Please try again.",

  // Rate limiting
  RATE_LIMIT_EXCEEDED: "Too many requests. Please wait a moment and try again.",

  // Server errors
  INTERNAL_ERROR: "An unexpected error occurred. Please try again later.",
  DATABASE_ERROR: "A database error occurred. Please try again.",
  EXTERNAL_SERVICE_ERROR:
    "An external service is unavailable. Please try again later.",
};

/**
 * Get user-friendly message for error code
 */
export function getErrorMessage(
  code: string,
  fallbackMessage?: string,
): string {
  return (
    ERROR_MESSAGES[code] || fallbackMessage || "An unexpected error occurred"
  );
}

/**
 * Hook options
 */
interface UseApiErrorHandlerOptions {
  /** Show toast notification for errors */
  showToast?: boolean;
  /** Custom error handler */
  onError?: (error: ApiError) => void;
  /** Ignore specific error codes */
  ignoreErrorCodes?: string[];
}

/**
 * Hook for handling API errors with toast notifications
 *
 * @example
 * ```tsx
 * const { handleError } = useApiErrorHandler();
 *
 * const handleSubmit = async () => {
 *   try {
 *     await api.post('/endpoint', data);
 *   } catch (error) {
 *     handleError(error);
 *   }
 * };
 * ```
 */
export function useApiErrorHandler(options: UseApiErrorHandlerOptions = {}) {
  const { showToast = true, onError, ignoreErrorCodes = [] } = options;
  const toast = useToast();

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      // Skip if not an error
      if (!error) return;

      // Convert to ApiError if needed
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError(
              500,
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
              "UNKNOWN_ERROR",
            );

      // Skip ignored error codes
      if (ignoreErrorCodes.includes(apiError.code)) {
        return;
      }

      // Get user-friendly message
      const message = getErrorMessage(apiError.code, apiError.message);
      const title = context ? `Error: ${context}` : "Error";

      // Show toast notification
      if (showToast) {
        // Different handling for validation errors
        if (apiError.isValidationError()) {
          const validationErrors = apiError.getValidationErrors();
          const errorMessages = Object.values(validationErrors).join(", ");
          toast.error(title, errorMessages || message);
        } else {
          toast.error(title, message);
        }
      }

      // Call custom error handler
      onError?.(apiError);

      // Log error in development
      if (process.env.NODE_ENV === "development") {
        console.error("[API Error]", {
          code: apiError.code,
          message: apiError.message,
          status: apiError.status,
          details: apiError.details,
          requestId: apiError.requestId,
        });
      }
    },
    [showToast, onError, ignoreErrorCodes, toast],
  );

  /**
   * Wrap an async function with error handling
   */
  const withErrorHandling = useCallback(
    <T, Args extends unknown[]>(
      fn: (...args: Args) => Promise<T>,
      context?: string,
    ): ((...args: Args) => Promise<T | null>) => {
      return async (...args: Args): Promise<T | null> => {
        try {
          return await fn(...args);
        } catch (error) {
          handleError(error, context);
          return null;
        }
      };
    },
    [handleError],
  );

  return {
    handleError,
    withErrorHandling,
    getErrorMessage,
  };
}

export default useApiErrorHandler;

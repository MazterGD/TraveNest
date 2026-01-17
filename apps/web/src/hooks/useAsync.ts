"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ApiError } from "@/lib/api";

/**
 * State shape for async operations
 */
interface UseAsyncState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Options for useAsync hook
 */
interface UseAsyncOptions<T> {
  /** Callback when operation succeeds */
  onSuccess?: (data: T) => void;
  /** Callback when operation fails */
  onError?: (error: ApiError) => void;
  /** Execute immediately on mount */
  immediate?: boolean;
  /** Dependencies for re-running when immediate is true */
  deps?: unknown[];
}

/**
 * Generic hook for handling async operations with loading, error, and success states
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, execute } = useAsync(
 *   () => vehicleService.getById(vehicleId),
 *   { immediate: true }
 * );
 * ```
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {},
) {
  const { onSuccess, onError, immediate = false, deps = [] } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    isSuccess: false,
    isError: false,
  });

  const mountedRef = useRef(true);
  const executingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      // Prevent duplicate concurrent executions
      if (executingRef.current) return null;
      executingRef.current = true;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        isSuccess: false,
        isError: false,
        error: null,
      }));

      try {
        const data = await asyncFunction(...args);
        if (mountedRef.current) {
          setState({
            data,
            error: null,
            isLoading: false,
            isSuccess: true,
            isError: false,
          });
          onSuccess?.(data);
        }
        return data;
      } catch (error) {
        const apiError =
          error instanceof ApiError
            ? error
            : new ApiError(
                500,
                error instanceof Error ? error.message : "An error occurred",
                "UNKNOWN_ERROR",
              );

        if (mountedRef.current) {
          setState({
            data: null,
            error: apiError,
            isLoading: false,
            isSuccess: false,
            isError: true,
          });
          onError?.(apiError);
        }
        return null;
      } finally {
        executingRef.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asyncFunction, onSuccess, onError],
  );

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as Args));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

/**
 * Hook for fetching data with automatic refetch capability
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  options: UseAsyncOptions<T> & { refetchInterval?: number } = {},
) {
  const { refetchInterval, ...asyncOptions } = options;
  const result = useAsync(fetcher, { ...asyncOptions, immediate: true });

  useEffect(() => {
    if (!refetchInterval) return;

    const interval = setInterval(() => {
      result.execute();
    }, refetchInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchInterval]);

  return {
    ...result,
    refetch: result.execute,
  };
}

/**
 * Hook for mutation operations (create, update, delete)
 */
export function useMutation<T, Args extends unknown[] = unknown[]>(
  mutationFn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {},
) {
  const result = useAsync(mutationFn, options);

  return {
    ...result,
    mutate: result.execute,
    mutateAsync: result.execute,
  };
}

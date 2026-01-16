"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// Define ApiError type locally to avoid circular dependency
interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

interface UseAsyncState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  immediate?: boolean;
}

export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { onSuccess, onError, immediate = false } = options;
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    isSuccess: false,
    isError: false,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
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
        const apiError = error as ApiError;
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
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

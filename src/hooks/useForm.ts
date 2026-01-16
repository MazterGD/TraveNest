"use client";

import { useState, useCallback } from "react";
import { z } from "zod";

interface UseFormOptions<T> {
  schema: z.ZodSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export function useForm<T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    isSubmitting: false,
    isValid: true,
  });

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      errors: { ...prev.errors, [field]: undefined },
    }));
  }, []);

  const setValues = useCallback((values: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, ...values },
    }));
  }, []);

  const validate = useCallback(() => {
    const result = schema.safeParse(state.values);
    if (!result.success) {
      const errors: Partial<Record<keyof T, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof T;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });
      setState((prev) => ({ ...prev, errors, isValid: false }));
      return false;
    }
    setState((prev) => ({ ...prev, errors: {}, isValid: true }));
    return true;
  }, [schema, state.values]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!validate()) return;

      setState((prev) => ({ ...prev, isSubmitting: true }));
      try {
        await onSubmit(state.values);
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [validate, onSubmit, state.values]
  );

  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      isSubmitting: false,
      isValid: true,
    });
  }, [initialValues]);

  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => ({
      value: state.values[field],
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => setValue(field, e.target.value as T[K]),
      error: state.errors[field],
    }),
    [state.values, state.errors, setValue]
  );

  return {
    ...state,
    setValue,
    setValues,
    validate,
    handleSubmit,
    reset,
    getFieldProps,
  };
}

"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { api } from "@/lib/api";
import type { User } from "@/types";
import type { LoginInput, RegisterInput } from "@/lib/validations";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: setLogin,
    logout: setLogout,
    setLoading,
    setUser,
  } = useAuthStore();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("travelnest-auth");
      if (storedToken) {
        try {
          // In real app, validate token with backend
          const parsed = JSON.parse(storedToken);
          if (parsed?.state?.token && parsed?.state?.user) {
            setLogin(parsed.state.user, parsed.state.token);
          }
        } catch {
          setLogout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [setLogin, setLogout, setLoading]);

  const login = useCallback(
    async (data: LoginInput) => {
      setLoading(true);
      try {
        // Mock API call - replace with real endpoint
        const response = await api.post<{ user: User; token: string }>(
          "/auth/login",
          data
        );

        setLogin(response.user, response.token);
        return { success: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [setLogin, setLoading]
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      setLoading(true);
      try {
        // Mock API call - replace with real endpoint
        const response = await api.post<{ user: User; token: string }>(
          "/auth/register",
          data
        );

        setLogin(response.user, response.token);
        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Registration failed";
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [setLogin, setLoading]
  );

  const logout = useCallback(() => {
    setLogout();
    localStorage.removeItem("travelnest-auth");
    router.push("/");
  }, [setLogout, router]);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!user) return { success: false, error: "Not authenticated" };

      setLoading(true);
      try {
        const response = await api.patch<User>(`/users/${user.id}`, data);
        setUser(response);
        return { success: true };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Update failed";
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [user, setUser, setLoading]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole, type User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;

  // Role checks
  isCustomer: () => boolean;
  isVehicleOwner: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token }),

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      // Role check helpers
      isCustomer: () => get().user?.role === UserRole.CUSTOMER,
      isVehicleOwner: () => get().user?.role === UserRole.VEHICLE_OWNER,
      isAdmin: () => get().user?.role === UserRole.ADMIN,
    }),
    {
      name: "travenest-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

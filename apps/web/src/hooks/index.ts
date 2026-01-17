// Authentication
export { useAuth } from "./useAuth";
export {
  useProtectedRoute,
  useCustomerRoute,
  useVehicleOwnerRoute,
  useAdminRoute,
  useOwnerOrAdminRoute,
} from "./useProtectedRoute";

// API & Data Fetching
export { useAsync, useFetch, useMutation } from "./useAsync";
export { useApiErrorHandler, getErrorMessage } from "./useApiErrorHandler";

// Domain Hooks
export { useQuotations } from "./useQuotations";
export { useBookings } from "./useBookings";

// Form
export { useForm } from "./useForm";

// Utilities
export {
  useDebounce,
  useLocalStorage,
  useClickOutside,
  useWindowSize,
  useMediaQuery,
  usePrevious,
  useToggle,
} from "./useUtils";

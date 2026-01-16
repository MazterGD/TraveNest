/**
 * Icon Components
 * Centralized SVG icons to avoid inline duplication throughout the codebase
 * Each icon accepts className and size props for customization
 */

import { cn } from "@/lib/utils/cn";

export interface IconProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  strokeWidth?: number;
}

const sizeMap = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

// Star icon - used for ratings
export function StarIcon({
  className,
  size = "md",
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

// Star filled icon - for filled star ratings
export function StarFilledIcon({ className, size = "md" }: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

// Plus icon - for add/create actions
export function PlusIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

// Chevron Right icon - for navigation
export function ChevronRightIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

// Arrow Right icon - for one-way indication
export function ArrowRightIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

// Arrows Right Left icon - for round-trip indication
export function ArrowsRightLeftIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );
}

// Calendar icon - for dates
export function CalendarIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

// Clock icon - for time
export function ClockIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// Map Pin icon - for locations
export function MapPinIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

// Check Circle icon - for success/completed
export function CheckCircleIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// Document/Clipboard icon - for quotations/bookings
export function ClipboardIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

// User icon - for profile
export function UserIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

// Currency/Money icon - for payments
export function CurrencyIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

// Phone icon - for contact
export function PhoneIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

// Mail/Envelope icon - for email
export function MailIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

// Vehicle/Car icon - for vehicles
export function VehicleIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M8 7h8m-8 4h8m-4 4v4m-4-4v4m8-4v4M4 11l1.5-4.5A2 2 0 017.39 5h9.22a2 2 0 011.89 1.5L20 11m-16 0h16m-16 0v7a1 1 0 001 1h2a1 1 0 001-1v-1h8v1a1 1 0 001 1h2a1 1 0 001-1v-7"
      />
    </svg>
  );
}

// Users/Group icon - for passengers
export function UsersIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

// Luggage/Briefcase icon - for luggage count
export function LuggageIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

// Snowflake/AC icon - for air conditioning
export function SnowflakeIcon({
  className,
  size = "md",
  strokeWidth = 2,
}: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"
      />
    </svg>
  );
}

// X/Close icon - for cancel/close actions
export function XIcon({ className, size = "md", strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

// Loading Spinner icon
export function SpinnerIcon({ className, size = "md" }: IconProps) {
  return (
    <svg
      className={cn(sizeMap[size], "animate-spin", className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Export all icons
export const Icons = {
  Star: StarIcon,
  StarFilled: StarFilledIcon,
  Plus: PlusIcon,
  ChevronRight: ChevronRightIcon,
  ArrowRight: ArrowRightIcon,
  ArrowsRightLeft: ArrowsRightLeftIcon,
  Calendar: CalendarIcon,
  Clock: ClockIcon,
  MapPin: MapPinIcon,
  CheckCircle: CheckCircleIcon,
  Clipboard: ClipboardIcon,
  User: UserIcon,
  Currency: CurrencyIcon,
  Phone: PhoneIcon,
  Mail: MailIcon,
  Vehicle: VehicleIcon,
  Users: UsersIcon,
  Luggage: LuggageIcon,
  Snowflake: SnowflakeIcon,
  X: XIcon,
  Spinner: SpinnerIcon,
};

export type IconName = keyof typeof Icons;

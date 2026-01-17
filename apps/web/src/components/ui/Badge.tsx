import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  outline: "border border-current bg-transparent",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-primary-foreground",
  secondary: "bg-secondary-foreground",
  success: "bg-green-600",
  warning: "bg-yellow-600",
  danger: "bg-red-600",
  info: "bg-blue-600",
  outline: "bg-current",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full mr-1.5", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}

// Status-specific badges for convenience
export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const statusConfig: Record<string, { variant: BadgeVariant; label: string }> =
    {
      // Quotation statuses
      pending: { variant: "warning", label: "Pending" },
      accepted: { variant: "success", label: "Accepted" },
      declined: { variant: "danger", label: "Declined" },
      expired: { variant: "secondary", label: "Expired" },

      // Booking statuses
      confirmed: { variant: "success", label: "Confirmed" },
      in_progress: { variant: "info", label: "In Progress" },
      completed: { variant: "success", label: "Completed" },
      cancelled: { variant: "danger", label: "Cancelled" },

      // Payment statuses
      paid: { variant: "success", label: "Paid" },
      unpaid: { variant: "warning", label: "Unpaid" },
      refunded: { variant: "info", label: "Refunded" },

      // Verification statuses
      verified: { variant: "success", label: "Verified" },
      unverified: { variant: "warning", label: "Unverified" },
      rejected: { variant: "danger", label: "Rejected" },

      // Generic
      active: { variant: "success", label: "Active" },
      inactive: { variant: "secondary", label: "Inactive" },
    };

  const config = statusConfig[status.toLowerCase()] || {
    variant: "secondary" as BadgeVariant,
    label: status,
  };

  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
}

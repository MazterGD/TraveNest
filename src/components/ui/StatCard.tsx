import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "./Card";
import type { ReactNode } from "react";

interface StatCardProps {
  /** The stat value (number, currency, etc.) */
  value: string | number;
  /** Label/description for the stat */
  label: string;
  /** Icon element to display */
  icon: ReactNode;
  /** Color variant for the icon background */
  variant?: "primary" | "success" | "warning" | "info" | "error";
  /** Optional trend indicator */
  trend?: {
    value: number;
    isPositive: boolean;
  };
  /** Additional className for the card */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const variantStyles = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
  },
  success: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-600",
  },
};

/**
 * StatCard Component
 *
 * A card component for displaying statistics with an icon, value, and label.
 * Used in dashboards and overview sections.
 *
 * @example Basic usage
 * ```tsx
 * <StatCard
 *   value={12}
 *   label="Active Bookings"
 *   icon={<CalendarIcon className="w-6 h-6" />}
 *   variant="primary"
 * />
 * ```
 *
 * @example With trend
 * ```tsx
 * <StatCard
 *   value="Rs. 125,000"
 *   label="Total Revenue"
 *   icon={<CurrencyIcon className="w-6 h-6" />}
 *   variant="success"
 *   trend={{ value: 12.5, isPositive: true }}
 * />
 * ```
 */
export function StatCard({
  value,
  label,
  icon,
  variant = "primary",
  trend,
  className,
  onClick,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
              styles.bg
            )}
          >
            <div className={styles.text}>{icon}</div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-bold text-foreground truncate">
              {value}
            </p>
            <p className="text-sm text-muted-foreground truncate">{label}</p>
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium mt-1",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;

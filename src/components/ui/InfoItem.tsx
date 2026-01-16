import { cn } from "@/lib/utils/cn";
import type { ReactNode, ElementType } from "react";

interface InfoItemProps {
  /** Title/label of the info item */
  title: string;
  /** Value/content of the info item */
  value: ReactNode;
  /** Icon element (ReactNode) or React Icon component (ElementType) */
  icon: ReactNode | ElementType;
  /** Optional href for making the item a link */
  href?: string;
  /** Visual variant */
  variant?: "default" | "horizontal" | "compact";
  /** Additional className */
  className?: string;
}

/**
 * InfoItem Component
 *
 * A component for displaying information with an icon, title, and value.
 * Used in contact pages, detail sections, and info lists.
 *
 * @example Basic usage
 * ```tsx
 * <InfoItem
 *   title="Address"
 *   value="123 Main Street, Colombo"
 *   icon={<FaMapMarkerAlt />}
 * />
 * ```
 *
 * @example As a link
 * ```tsx
 * <InfoItem
 *   title="Email"
 *   value="support@example.com"
 *   icon={FaEnvelope}
 *   href="mailto:support@example.com"
 * />
 * ```
 *
 * @example Compact variant
 * ```tsx
 * <InfoItem
 *   title="Phone"
 *   value="+94 11 234 5678"
 *   icon={FaPhone}
 *   variant="compact"
 * />
 * ```
 */
export function InfoItem({
  title,
  value,
  icon,
  href,
  variant = "default",
  className,
}: InfoItemProps) {
  // Determine if icon is a component (function) or already a ReactNode
  const isIconComponent = typeof icon === "function";
  const IconComponent = isIconComponent ? (icon as ElementType) : null;

  const content = (
    <div
      className={cn(
        "flex items-start",
        variant === "horizontal" ? "flex-row gap-4" : "space-x-4",
        variant === "compact" && "items-center space-x-3",
        className
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary/10 flex-shrink-0",
          variant === "compact" ? "h-10 w-10" : "h-12 w-12"
        )}
      >
        {IconComponent ? (
          <IconComponent
            className={cn(
              "text-primary",
              variant === "compact" ? "h-4 w-4" : "h-5 w-5"
            )}
          />
        ) : (
          <span
            className={cn(
              "text-primary",
              variant === "compact" ? "text-sm" : "text-base"
            )}
          >
            {icon as ReactNode}
          </span>
        )}
      </div>

      {/* Content */}
      <div className={variant === "compact" ? "" : "flex-1"}>
        <h3
          className={cn(
            "font-semibold text-foreground",
            variant === "compact" && "text-sm"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-muted-foreground",
            variant === "compact" ? "text-xs" : "mt-1"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
}

interface InfoItemListProps {
  children: ReactNode;
  /** Gap between items */
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * InfoItemList Component
 *
 * A container for InfoItem components with consistent spacing.
 *
 * @example
 * ```tsx
 * <InfoItemList spacing="md">
 *   <InfoItem title="Email" value="..." icon={FaEnvelope} />
 *   <InfoItem title="Phone" value="..." icon={FaPhone} />
 * </InfoItemList>
 * ```
 */
export function InfoItemList({
  children,
  spacing = "md",
  className,
}: InfoItemListProps) {
  const spacingStyles = {
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
  };

  return (
    <div className={cn(spacingStyles[spacing], className)}>{children}</div>
  );
}

export default InfoItem;

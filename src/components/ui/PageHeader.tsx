interface PageHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  centered = true,
  className = "",
}: PageHeaderProps) {
  return (
    <section
      className={`bg-gradient-to-br from-muted via-background to-accent/20 py-16 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={centered ? "text-center" : ""}>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

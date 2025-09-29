import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

// Predefined skeleton patterns
export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = "md",
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return <Skeleton className={cn("rounded-full", sizeClasses[size])} />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-4 bg-white rounded-lg border border-gray-200 space-y-3",
        className,
      )}
    >
      <div className="flex items-center space-x-3">
        <SkeletonAvatar />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

// Group-specific skeletons
export function SkeletonGroupItem() {
  return (
    <div className="flex items-center gap-3 p-4 bg-white">
      <SkeletonAvatar size="lg" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

export function SkeletonMessage({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={cn("flex gap-3 mb-4", isOwn && "flex-row-reverse")}>
      {!isOwn && <SkeletonAvatar size="sm" />}
      <div className={cn("space-y-1", isOwn ? "items-end" : "items-start")}>
        {!isOwn && <Skeleton className="h-3 w-20" />}
        <Skeleton
          className={cn(
            "h-10 rounded-2xl",
            isOwn ? "w-32 bg-blue-200" : "w-40 bg-gray-200",
          )}
        />
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
  );
}

export function SkeletonNote() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SkeletonAvatar size="xs" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
          <SkeletonText lines={2} />
        </div>
        <div className="flex gap-1">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-8 h-8 rounded" />
        </div>
      </div>
    </div>
  );
}

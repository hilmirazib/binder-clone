import { cn } from "@/lib/utils";
import { Profile } from "@/lib/types/profile";

interface AvatarProps {
  profile?: Pick<
    Profile,
    "displayName" | "username" | "avatarEmoji" | "avatarColor" | "avatarUrl"
  >;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showBorder?: boolean;
  fallbackEmoji?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-lg",
  lg: "w-12 h-12 text-xl",
  xl: "w-16 h-16 text-2xl",
  "2xl": "w-24 h-24 text-4xl",
};

export function Avatar({
  profile,
  size = "md",
  className,
  showBorder = false,
  fallbackEmoji = "👤",
}: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (profile?.avatarUrl) {
    return (
      <div
        className={cn(
          sizeClass,
          "rounded-full overflow-hidden bg-gray-100 flex items-center justify-center",
          showBorder && "ring-2 ring-white ring-offset-2",
          className,
        )}
      >
        <img
          src={profile.avatarUrl}
          alt={profile.displayName || profile.username || "Avatar"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Use emoji avatar
  const emoji = profile?.avatarEmoji || fallbackEmoji;
  const backgroundColor = profile?.avatarColor || "#6366F1";

  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full flex items-center justify-center font-medium",
        showBorder && "ring-2 ring-white ring-offset-2",
        className,
      )}
      style={{ backgroundColor }}
    >
      <span className="select-none">{emoji}</span>
    </div>
  );
}

export function AvatarFallback({
  displayName,
  size = "md",
  className,
}: {
  displayName?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}) {
  const sizeClass = sizeClasses[size];
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold",
        className,
      )}
    >
      {initials}
    </div>
  );
}

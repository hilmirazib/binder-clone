"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/space",
    label: "Space",
    icon: Users,
    description: "Groups & Chat",
  },
  {
    href: "/you",
    label: "You",
    icon: User,
    description: "Profile & Settings",
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200">
      <div className="mx-auto max-w-md flex justify-around h-16 items-center px-4">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] h-12 rounded-lg transition-all duration-200 group",
                active
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:scale-95",
              )}
            >
              <Icon
                className={cn(
                  "transition-all duration-200",
                  active
                    ? "w-6 h-6"
                    : "w-5 h-5 group-hover:w-5.5 group-hover:h-5.5",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  active ? "text-blue-600" : "text-gray-500",
                )}
              >
                {tab.label}
              </span>

              {/* Active indicator */}
              {active && (
                <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area for iPhone home indicator */}
      <div className="h-safe-bottom bg-white/95" />
    </nav>
  );
}

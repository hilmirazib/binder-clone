"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Smile } from "lucide-react";

const tabs = [
  { href: "/space", label: "Space", icon: Users },
  { href: "/you", label: "You", icon: Smile },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
      <div className="mx-auto max-w-md flex justify-around h-14 items-center">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center text-xs ${
                active ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              <Icon size={20} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/space", label: "Space" },
  { href: "/you", label: "You" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-3xl px-4 flex gap-4 h-12 items-center">
        <div className="font-semibold">Binder</div>
        <div className="ml-auto flex gap-3">
          {tabs.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`text-sm ${active ? "font-semibold" : "text-gray-600 hover:text-black"}`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

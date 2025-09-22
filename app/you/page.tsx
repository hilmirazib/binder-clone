"use client";

import AvatarEmoji from "@/components/AvatarEmoji";
import { Pencil, ChevronRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const profile = {
    displayName: "hilmi razib yusuf",
    username: "hilmi",
    avatarEmoji: "😄",
    avatarBg: "bg-yellow-200",
    wallpaper: "Brand Doodle",
  };

  return (
    <section className="mx-auto w-full max-w-md">
      {/* Header user */}
      <div className="flex items-center gap-3 p-4 bg-white">
        <AvatarEmoji emoji={profile.avatarEmoji} bg={profile.avatarBg} />
        <div className="flex-1">
          <div className="font-semibold leading-tight">
            {profile.displayName}
          </div>
          <div className="text-sm text-gray-500 leading-tight">
            {profile.username}
          </div>
        </div>
        <button
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
          aria-label="Edit profile"
          onClick={() => router.push("/you/edit")}
        >
          <Pencil size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Section label */}
      <div className="px-4 pt-4 text-xs font-semibold tracking-wider text-gray-500">
        SPACE THEME
      </div>

      {/* List item: Wallpaper */}
      <button
        className="w-full bg-white px-4 py-3 flex items-center justify-between active:bg-gray-50"
        onClick={() => router.push("/you/wallpaper")}
      >
        <span className="text-sm">Wallpaper</span>
        <span className="flex items-center gap-2 text-sm text-gray-500">
          {profile.wallpaper}
          <ChevronRight size={18} className="text-gray-400" />
        </span>
      </button>

      {/* Divider */}
      <div className="h-3" />

      {/* Logout */}
      <button
        className="w-full bg-white px-4 py-3 flex items-center gap-2 text-orange-600 active:bg-orange-50"
        onClick={() => {
          // TODO: supabase.auth.signOut().then(()=>router.replace('/login'))
          alert("Log out (coming soon)");
        }}
      >
        <LogOut size={18} />
        <span className="text-sm">Log out</span>
      </button>

      <div className="pb-16" />
    </section>
  );
}

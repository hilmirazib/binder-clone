"use client";

import { Pencil, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProfileActions({ profile }: { profile: any }) {
  const router = useRouter();

  return (
    <>
      {/* Header user */}
      <div className="flex items-center gap-3 p-4 bg-white">
        {/* <AvatarEmoji emoji={profile.avatarEmoji} bg={profile.avatarBg} /> */}
        😄
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
          {/* Brand Doodle */}
          {profile.wallpaper}
          <ChevronRight size={18} className="text-gray-400" />
        </span>
      </button>
    </>
  );
}

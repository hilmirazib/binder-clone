import { supabaseServer } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/lib/actions/logout";
import { ensureProfile } from "@/lib/actions/profile";
import { LogOut } from "lucide-react";
import { ProfileActions } from "@/components/ProfileActions";

export default async function YouPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <section className="max-w-sm mx-auto">
        <p className="mb-3">You are signed out.</p>
        <a className="underline" href="/login">
          Go to login
        </a>
      </section>
    );
  }
  await ensureProfile();

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return (
    <section className="mx-auto w-full max-w-md">
      {/* Header user */}
      <ProfileActions profile={profile} />

      {/* Divider */}
      <div className="h-3" />

      {/* Logout */}
      <form action={signOut}>
        <button className="w-full bg-white px-4 py-3 flex items-center gap-2 text-orange-600 active:bg-orange-50">
          <LogOut size={18} />
          <span className="text-sm">Log out</span>
        </button>
      </form>

      <div className="pb-16" />
    </section>
  );
}

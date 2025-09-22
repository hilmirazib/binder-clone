"use server";

import { supabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function signOut() {
  const supa = supabaseServer();
  await supa.auth.signOut();
  redirect("/login");
}

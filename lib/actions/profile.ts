"use server";

import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
import { z } from "zod";

function slugBase(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_{2,}/g, "_")
    .slice(0, 16);
}

export async function ensureProfile() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");
  const base =
    slugBase(
      user.user_metadata?.name ?? user.phone?.replace(/^\+/, "") ?? "user",
    ) || "user";
  const candidate = `${base}_${Math.floor(1000 + Math.random() * 9000)}`;

  await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      displayName: user.user_metadata?.name ?? null,
      username: candidate,
      phone: user.phone ?? null,
    },
    update: {},
  });

  return { ok: true };
}

const ProfileSchema = z.object({
  displayName: z.string().min(1).max(100),
  username: z
    .string()
    .min(3)
    .max(24)
    .regex(/^[a-z0-9_]+$/),
  avatarEmoji: z.string().optional(),
  avatarColor: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export async function setProfile(input: z.infer<typeof ProfileSchema>) {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");

  const body = ProfileSchema.parse(input);

  const exists = await prisma.profile.findFirst({
    where: { username: body.username, NOT: { userId: user.id } },
    select: { userId: true },
  });
  if (exists) throw new Error("Username already taken");

  await prisma.profile.update({
    where: { userId: user.id },
    data: {
      displayName: body.displayName,
      username: body.username,
      avatarEmoji: body.avatarEmoji,
      avatarColor: body.avatarColor,
      avatarUrl: body.avatarUrl,
    },
  });

  return { ok: true };
}

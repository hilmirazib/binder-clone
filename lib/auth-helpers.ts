import { supabase } from "./supabase";

export interface OnboardingData {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  avatar: {
    type: "emoji" | "photo";
    emoji?: string;
    color?: string;
    photo?: string;
  };
}

export async function sendPhoneOTP(
  phone: string,
  method: "sms" | "whatsapp" = "sms",
) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: method === "whatsapp" ? "whatsapp" : "sms",
    },
  });

  if (error) throw error;
  return data;
}

export async function verifyOTP(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) throw error;
  return data;
}

export async function checkUsernameAvailability(username: string) {
  const { data, error } = await supabase
    .from("Profile")
    .select("userId")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !data; // true if available
}

export async function completeOnboarding(
  userData: OnboardingData,
  userId: string,
) {
  const { error: profileError } = await supabase.from("Profile").upsert({
    userId: userId,
    displayName: userData.name,
    username: userData.username,
    email: userData.email,
    avatarEmoji: userData.avatar.emoji,
    avatarColor: userData.avatar.color,
    phone: userData.phoneNumber,
    updatedAt: new Date().toISOString(),
  });

  if (profileError) throw profileError;
}

export function generateUsernameOptions(name: string): string[] {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const options = [
    cleanName,
    `${cleanName}${Math.floor(Math.random() * 100)}`,
    `${cleanName}_${Math.floor(Math.random() * 1000)}`,
    `${cleanName}${new Date().getFullYear()}`,
  ];
  return options.slice(0, 4);
}

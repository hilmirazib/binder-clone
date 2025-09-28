export interface Profile {
  id: string;
  displayName: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  avatarEmoji: string | null;
  avatarColor: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  lastUsernameChange: string | null;
}

export interface ProfileUpdateData {
  displayName?: string;
  username?: string;
  email?: string;
  avatarEmoji?: string;
  avatarColor?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UsernameCheckResult {
  available: boolean;
  message: string;
}

export interface AvatarData {
  type: "emoji" | "upload";
  emoji?: string;
  color?: string;
  url?: string;
}

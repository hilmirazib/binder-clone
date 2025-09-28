import { supabase } from "../supabase";
import { ProfileUpdateData, UsernameCheckResult } from "../types/profile";

export class ProfileService {
  static async getCurrentProfile() {
    try {
      // Get current session first
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Failed to get session");
      }

      if (!session?.user) {
        console.error("No active session found");
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("Profile")
        .select("*")
        .eq("userId", session.user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);

        // If profile doesn't exist, create one
        if (error.code === "PGRST116") {
          console.log("Profile not found, creating new profile...");
          return await this.createInitialProfile(session.user);
        }

        throw error;
      }

      return data;
    } catch (error) {
      console.error("getCurrentProfile error:", error);
      throw error;
    }
  }

  static async createInitialProfile(user: any) {
    try {
      const initialProfile = {
        userId: user.userId,
        displayName: user.user_metadata?.displayName || null,
        username: user.user_metadata?.username || null,
        email: user.email || null,
        phone: user.phone || null,
        avatarEmoji: "😊",
        avatarColor: "#6366F1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("Profile")
        .insert(initialProfile)
        .select()
        .single();

      if (error) {
        console.error("Failed to create initial profile:", error);
        throw error;
      }

      console.log("Initial profile created successfully");
      return data;
    } catch (error) {
      console.error("createInitialProfile error:", error);
      throw error;
    }
  }

  static async updateProfile(updates: ProfileUpdateData) {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("Profile")
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq("userId", session.user.id)
        .select()
        .single();

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("updateProfile error:", error);
      throw error;
    }
  }

  static async checkUsernameAvailability(
    username: string,
  ): Promise<UsernameCheckResult> {
    try {
      if (!username || username.length < 3) {
        return {
          available: false,
          message: "Username must be at least 3 characters",
        };
      }

      if (username.length > 20) {
        return {
          available: false,
          message: "Username must be less than 20 characters",
        };
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return {
          available: false,
          message:
            "Username can only contain letters, numbers, and underscores",
        };
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      // Check if it's the user's current username
      const { data: currentProfile } = await supabase
        .from("Profile")
        .select("username")
        .eq("userId", session.user.id)
        .single();

      if (currentProfile?.username === username) {
        return { available: true, message: "This is your current username" };
      }

      // Check if username is taken by someone else
      const { data, error } = await supabase
        .from("Profile")
        .select("userId")
        .eq("username", username)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Username check error:", error);
        throw error;
      }

      if (data) {
        return { available: false, message: "Username is already taken" };
      }

      return { available: true, message: "Username is available" };
    } catch (error) {
      console.error("checkUsernameAvailability error:", error);
      return {
        available: false,
        message: "Error checking username availability",
      };
    }
  }

  static generateUsernameOptions(displayName: string): string[] {
    if (!displayName) return [];

    const cleanName = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 15);

    if (!cleanName) return [];

    return [
      cleanName,
      `${cleanName}_${Math.floor(Math.random() * 100)}`,
      `${cleanName}${new Date().getFullYear()}`,
      `${cleanName}_official`,
      `${cleanName}_${Math.floor(Math.random() * 1000)}`,
    ]
      .filter(Boolean)
      .slice(0, 4);
  }

  static async updateLastUsernameChange() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      await supabase
        .from("Profile")
        .update({ lastUsernameChange: new Date().toISOString() })
        .eq("userId", session.user.id);
    } catch (error) {
      console.error("updateLastUsernameChange error:", error);
      throw error;
    }
  }

  static async canChangeUsername(): Promise<{
    canChange: boolean;
    daysLeft?: number;
  }> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      const { data } = await supabase
        .from("Profile")
        .select("lastUsernameChange")
        .eq("userId", session.user.id)
        .single();

      if (!data?.lastUsernameChange) {
        return { canChange: true };
      }

      const lastChange = new Date(data.lastUsernameChange);
      const daysSinceChange = Math.floor(
        (Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24),
      );
      const daysLeft = Math.max(0, 7 - daysSinceChange);

      return {
        canChange: daysSinceChange >= 7,
        daysLeft: daysLeft > 0 ? daysLeft : undefined,
      };
    } catch (error) {
      console.error("canChangeUsername error:", error);
      return { canChange: true };
    }
  }
}

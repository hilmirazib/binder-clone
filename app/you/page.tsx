"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Edit3,
  LogOut,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/Avatar";
import { ProfileService } from "@/lib/services/profileService";
import { Profile } from "@/lib/types/profile";
import { useAuth } from "@/lib/hooks/useAuth";

export default function YouPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        const profileData = await ProfileService.getCurrentProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Failed to load profile data");
        toast.error("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      loadProfile();
    }
  }, [isAuthenticated, authLoading]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/splash");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/splash");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {error || "Authentication Required"}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Please sign in to view your profile"}
          </p>
          <Button onClick={() => router.push("/splash")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-lg font-semibold">You</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/you/edit")}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Profile Section */}
        <div className="bg-white mx-4 mt-4 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar profile={profile} size="xl" showBorder />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {profile?.displayName || user?.email || "No name"}
              </h2>
              <p className="text-sm text-gray-600 truncate">
                @{profile?.username || "no-username"}
              </p>
              {profile?.bio && (
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push("/you/edit")}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Settings Sections */}
        <div className="p-4 space-y-4">
          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Account</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <button className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-900">Settings</span>
              </button>
              <button className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-900">Notifications</span>
              </button>
              <button className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-900">
                  Privacy & Security
                </span>
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Appearance</h3>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-900">Dark Mode</span>
                </div>
                <div className="text-sm text-gray-500">Coming soon</div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Support</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <button className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-900">Help & Support</span>
              </button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-600 font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Check, X, Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmojiPicker } from "@/components/profile/EmojiPicker";

import { ProfileService } from "@/lib/services/profileService";
import {
  profileUpdateSchema,
  ProfileUpdateForm,
} from "@/lib/validations/profileSchema";
import { Profile } from "@/lib/types/profile";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<{
    status: "checking" | "available" | "taken" | "current" | null;
    message: string;
  }>({ status: null, message: "" });
  const [canChangeUsername, setCanChangeUsername] = useState({
    canChange: true,
    daysLeft: 0,
  });
  const [usernameOptions, setUsernameOptions] = useState<string[]>([]);

  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      bio: "",
      avatarEmoji: "😊",
      avatarColor: "#6366F1",
    },
  });

  const watchedUsername = form.watch("username");
  const watchedDisplayName = form.watch("displayName");
  const debouncedUsername = useDebounce(watchedUsername, 500);

  // Load profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await ProfileService.getCurrentProfile();
        const usernameStatus = await ProfileService.canChangeUsername();

        setProfile(profileData);
        setCanChangeUsername({
          canChange: usernameStatus.canChange,
          daysLeft: usernameStatus.daysLeft ?? 0,
        });

        form.reset({
          displayName: profileData.displayName || "",
          username: profileData.username || "",
          email: profileData.email || "",
          bio: profileData.bio || "",
          avatarEmoji: profileData.avatarEmoji || "😊",
          avatarColor: profileData.avatarColor || "#6366F1",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [form]);

  useEffect(() => {
    if (watchedDisplayName && watchedDisplayName.length > 2) {
      const options =
        ProfileService.generateUsernameOptions(watchedDisplayName);
      setUsernameOptions(options);
    } else {
      setUsernameOptions([]);
    }
  }, [watchedDisplayName]);

  useEffect(() => {
    async function checkUsername() {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        setUsernameCheck({ status: null, message: "" });
        return;
      }

      setUsernameCheck({
        status: "checking",
        message: "Checking availability...",
      });

      try {
        const result =
          await ProfileService.checkUsernameAvailability(debouncedUsername);

        if (result.available) {
          const isCurrent = profile?.username === debouncedUsername;
          setUsernameCheck({
            status: isCurrent ? "current" : "available",
            message: result.message,
          });
        } else {
          setUsernameCheck({
            status: "taken",
            message: result.message,
          });
        }
      } catch (error) {
        console.error("Username check failed:", error);
        setUsernameCheck({ status: null, message: "" });
      }
    }

    checkUsername();
  }, [debouncedUsername, profile]);

  const onSubmit = async (data: ProfileUpdateForm) => {
    setIsSaving(true);

    try {
      const usernameChanged = data.username !== profile?.username;
      if (usernameChanged && !canChangeUsername.canChange) {
        toast.error(
          `You can change username again in ${canChangeUsername.daysLeft} days`,
        );
        return;
      }

      if (usernameChanged) {
        const availability = await ProfileService.checkUsernameAvailability(
          data.username,
        );
        if (!availability.available) {
          toast.error(availability.message);
          return;
        }
      }

      await ProfileService.updateProfile(data);

      if (usernameChanged) {
        await ProfileService.updateLastUsernameChange();
      }

      toast.success("Profile updated successfully!");
      router.push("/you");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmojiSelect = (emoji: string, color: string) => {
    form.setValue("avatarEmoji", emoji);
    form.setValue("avatarColor", color);
  };

  const handleUsernameOptionClick = (username: string) => {
    form.setValue("username", username);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Edit Profile</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar
                profile={{
                  displayName: form.watch("displayName") || "",
                  username: form.watch("username") || "",
                  avatarEmoji: form.watch("avatarEmoji") ?? null,
                  avatarColor: form.watch("avatarColor") ?? null,
                  avatarUrl: null,
                }}
                size="2xl"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(true)}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Tap to change your avatar
            </p>
          </div>

          {/* Display Name */}
          <div>
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              {...form.register("displayName")}
              placeholder="Your full name"
              className="mt-1"
            />
            {form.formState.errors.displayName && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.displayName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="username">Username *</Label>
              {!canChangeUsername.canChange && (
                <span className="text-xs text-amber-600">
                  Can change in {canChangeUsername.daysLeft} days
                </span>
              )}
            </div>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 text-sm">@</span>
              </div>
              <Input
                id="username"
                {...form.register("username")}
                placeholder="your_username"
                className="pl-8 pr-10"
                disabled={!canChangeUsername.canChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {usernameCheck.status === "checking" && (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                )}
                {usernameCheck.status === "available" && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
                {usernameCheck.status === "taken" && (
                  <X className="w-4 h-4 text-red-500" />
                )}
                {usernameCheck.status === "current" && (
                  <Check className="w-4 h-4 text-blue-500" />
                )}
              </div>
            </div>

            {usernameCheck.message && (
              <p
                className={`text-sm mt-1 ${
                  usernameCheck.status === "available" ||
                  usernameCheck.status === "current"
                    ? "text-green-600"
                    : usernameCheck.status === "taken"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {usernameCheck.message}
              </p>
            )}

            {/* Username Suggestions */}
            {usernameOptions.length > 0 && canChangeUsername.canChange && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {usernameOptions.map((option) => (
                    <Badge
                      key={option}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200 text-xs"
                      onClick={() => handleUsernameOptionClick(option)}
                    >
                      @{option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Used for tagging and adding friends. Can only be changed once
              every 7 days.
            </p>

            {form.formState.errors.username && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register("email")}
              placeholder="your.email@domain.com"
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder="Tell us about yourself..."
              className="mt-1 resize-none"
              rows={3}
              maxLength={160}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {form.formState.errors.bio && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.bio.message}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {form.watch("bio")?.length || 0}/160
              </p>
            </div>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSaving || usernameCheck.status === "taken"}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>

      {/* Emoji Picker Modal */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={handleEmojiSelect}
        selectedEmoji={form.watch("avatarEmoji")}
        selectedColor={form.watch("avatarColor")}
      />
    </div>
  );
}

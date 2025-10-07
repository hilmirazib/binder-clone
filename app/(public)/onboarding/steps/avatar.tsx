"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { completeOnboarding } from "@/lib/auth-helpers";
import { EmojiPicker } from "@/components/onboarding/EmojiPicker";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";

export default function AvatarStep() {
  const {
    phoneNumber,
    countryCode,
    name,
    username,
    email,
    avatar,
    setAvatar,
    nextStep,
    setLoading,
    setError,
    isLoading,
    error,
  } = useOnboardingStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);

  const handleSkip = async () => {
    await handleComplete();
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      await completeOnboarding(
        {
          name,
          username,
          email,
          phoneNumber: `${countryCode}${phoneNumber}`,
          avatar,
        },
        user.id,
      );

      nextStep();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setError("Failed to set up your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiSelect = (emoji: string, color: string) => {
    setAvatar({ type: "emoji", emoji, color });
  };

  // const handleImageUpload = (file: File) => {
  //   setShowImageOptions(false);
  // };

  return (
    <div className="min-h-[60vh] bg-slate-50 py-12">
      <section className="max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Add a profile image
            </h1>
            <p className="text-sm text-slate-500">
              Take a photo, upload, or pick an emoji.
            </p>
          </div>

          {/* Preview */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(true)}
              className="h-28 w-28 rounded-full border-4 border-violet-200 shadow-inner"
              style={{ backgroundColor: avatar.color || "#6366F1" }}
              aria-label="Choose emoji"
            >
              {avatar.type === "emoji" && avatar.emoji ? (
                <span className="text-5xl leading-none">{avatar.emoji}</span>
              ) : (
                <Plus className="mx-auto h-6 w-6 text-white" />
              )}
            </button>
          </div>

          {/* Error chip (konsisten) */}
          {error && (
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 mx-auto">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="h-px bg-slate-200" />
            <span className="absolute inset-x-0 -top-3 mx-auto w-fit bg-white px-3 text-xs text-slate-400">
              Choose method
            </span>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowEmojiPicker(true)}
              className="h-12 w-full justify-start rounded-xl"
            >
              <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                😊
              </span>
              <span className="text-sm">Use emoji</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowImageOptions(true)}
              disabled
              className="h-12 w-full justify-start rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                {/* <Image className="h-4 w-4 text-blue-600" /> */}
              </span>
              <span className="text-sm">Choose from gallery</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowImageOptions(true)}
              disabled
              className="h-12 w-full justify-start rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Camera className="h-4 w-4 text-green-600" />
              </span>
              <span className="text-sm">Take a photo</span>
            </Button>
          </div>

          {/* Divider + Actions */}
          <div className="relative">
            <div className="h-px bg-slate-200" />
            <span className="absolute inset-x-0 -top-3 mx-auto w-fit bg-white px-3 text-xs text-slate-400">
              Continue
            </span>
          </div>

          <div className="grid gap-2">
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="h-11 w-full rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </span>
              ) : (
                "Choose Image"
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isLoading}
              className="h-11 w-full rounded-full text-sm disabled:opacity-60"
            >
              Skip
            </Button>

            <p className="text-center text-xs text-slate-500">
              Recommended: square image, min 400×400px.
            </p>
          </div>
        </div>
      </section>

      {/* Emoji Picker Modal */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
        selectedEmoji={avatar.emoji || "😊"}
        selectedColor={avatar.color || "#6366F1"}
      />

      {/* Sheet placeholder (opsi lain nonaktif) */}
      {showImageOptions && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl p-6 space-y-3">
            <h3 className="text-center text-base font-semibold">
              Choose Space Image
            </h3>
            <Button variant="outline" className="w-full justify-start" disabled>
              😊 Use emoji
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              📷 Choose from gallery
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              📸 Take a photo
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowImageOptions(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

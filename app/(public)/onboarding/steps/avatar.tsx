"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { completeOnboarding } from "@/lib/auth-helpers";
import { EmojiPicker } from "@/components/onboarding/EmojiPicker";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Camera, Image } from "lucide-react";

export default function AvatarStep() {
  const router = useRouter();
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
    resetOnboarding,
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

  const handleImageUpload = (file: File) => {
    setShowImageOptions(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Add a profile image
          </h1>
          <p className="text-gray-600">
            Take a photo, upload one, or pick an emoji—it's your call! You can
            always update it later.
          </p>
        </div>

        <div className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div
              className="w-32 h-32 rounded-full border-4 border-purple-200 flex items-center justify-center cursor-pointer hover:border-purple-300 transition-colors"
              onClick={() => setShowEmojiPicker(true)}
              style={{ backgroundColor: avatar.color || "#6366F1" }}
            >
              {avatar.type === "emoji" && avatar.emoji ? (
                <span className="text-6xl">{avatar.emoji}</span>
              ) : (
                <Plus className="w-8 h-8 text-white" />
              )}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowEmojiPicker(true)}
              variant="outline"
              className="w-full py-4 text-left justify-start h-auto"
            >
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">😊</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Use emoji</div>
                  <div className="text-sm text-gray-500">
                    Pick an emoji with background color
                  </div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => setShowImageOptions(true)}
              variant="outline"
              className="w-full py-4 text-left justify-start h-auto"
            >
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Image className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Choose from gallery
                  </div>
                  <div className="text-sm text-gray-500">
                    Upload a photo from your device
                  </div>
                </div>
              </div>
            </Button>

            <Button
              onClick={() => setShowImageOptions(true)}
              variant="outline"
              className="w-full py-4 text-left justify-start h-auto"
            >
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Camera className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Take a photo</div>
                  <div className="text-sm text-gray-500">
                    Use your camera to take a new photo
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleComplete}
            className="w-full py-3"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Setting up your profile...
              </div>
            ) : (
              "Choose Image"
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full"
            disabled={isLoading}
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Emoji Picker Modal */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
        selectedEmoji={avatar.emoji || "😊"}
        selectedColor={avatar.color || "#6366F1"}
      />

      {/* Image Options Modal (placeholder) */}
      {showImageOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-lg w-full max-w-sm p-6 space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Choose Space Image
            </h3>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                😊 Use emoji
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📷 Choose from gallery
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📸 Take a photo
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setShowImageOptions(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

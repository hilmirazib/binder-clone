"use client";

import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import {
  checkUsernameAvailability,
  generateUsernameOptions,
} from "@/lib/auth-helpers";
import { profileSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";

export default function ProfileStep() {
  const {
    name,
    username,
    email,
    setProfileData,
    nextStep,
    setLoading,
    setError,
    isLoading,
    error,
  } = useOnboardingStore();

  const [usernameOptions, setUsernameOptions] = useState<string[]>([]);
  const [usernameStatus, setUsernameStatus] = useState<
    "checking" | "available" | "taken" | null
  >(null);
  const [formData, setFormData] = useState({
    name: name || "",
    username: username || "",
    email: email || "",
  });

  useEffect(() => {
    if (formData.name && formData.name.length > 2) {
      const options = generateUsernameOptions(formData.name);
      setUsernameOptions(options);

      if (!formData.username) {
        setFormData((prev) => ({ ...prev, username: options[0] }));
      }
    }
  }, [formData.name]);

  useEffect(() => {
    if (!formData.username || formData.username.length < 3) {
      setUsernameStatus(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setUsernameStatus("checking");

      try {
        const isAvailable = await checkUsernameAvailability(formData.username);
        setUsernameStatus(isAvailable ? "available" : "taken");
      } catch (error) {
        console.error("Username check failed:", error);
        setUsernameStatus(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      const validation = profileSchema.safeParse(formData);
      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }

      if (usernameStatus !== "available") {
        throw new Error("Please choose an available username");
      }

      setProfileData(formData);
      nextStep();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Please fill all fields correctly",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSelect = (selectedUsername: string) => {
    setFormData((prev) => ({ ...prev, username: selectedUsername }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Let's get you set up!
          </h1>
        </div>

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your full name"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              Letters only, no emoji or symbols
            </p>
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Username *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 text-sm">@</span>
              </div>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, ""),
                  }))
                }
                placeholder="your.username"
                className="pl-8"
                maxLength={20}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {usernameStatus === "checking" && (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                )}
                {usernameStatus === "available" && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
                {usernameStatus === "taken" && (
                  <X className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>

            {/* Username suggestions */}
            {usernameOptions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-2">
                  Suggested usernames:
                </p>
                <div className="flex flex-wrap gap-1">
                  {usernameOptions.map((option) => (
                    <Badge
                      key={option}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => handleUsernameSelect(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Used for tagging and adding friends. You can only change it once
              every 7 days.
            </p>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="youremail@domain.com"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <Button
          onClick={handleContinue}
          className="w-full py-3"
          disabled={
            !formData.name ||
            !formData.username ||
            !formData.email ||
            isLoading ||
            usernameStatus !== "available"
          }
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Setting up...
            </div>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
}

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
        throw new Error(validation.error.issues[0].message);
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
    <div className="min-h-[60vh] bg-slate-50 py-12">
      <section className="max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Set up your profile
            </h1>
            <p className="text-sm text-slate-500">Tell us a bit about you.</p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Your full name"
                className="h-11 rounded-xl border-slate-300 px-4 focus-visible:ring-2 focus-visible:ring-slate-300"
              />
              <p className="text-[11px] text-slate-500">
                Letters only, no emoji or symbols.
              </p>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Username *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">
                  @
                </span>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      username: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_]/g, ""),
                    }))
                  }
                  placeholder="your.username"
                  className="h-11 rounded-xl border-slate-300 pl-8 pr-9 focus-visible:ring-2 focus-visible:ring-slate-300"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {usernameStatus === "checking" && (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  )}
                  {usernameStatus === "available" && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                  {usernameStatus === "taken" && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </span>
              </div>

              {usernameOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {usernameOptions.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => handleUsernameSelect(u)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-700 hover:bg-slate-100"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-slate-500">
                You can change it once every 7 days.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="you@domain.com"
                className="h-11 rounded-xl border-slate-300 px-4 focus-visible:ring-2 focus-visible:ring-slate-300"
              />
            </div>

            {/* Error chip (seragam dengan Welcome/Login) */}
            {error && (
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="h-px bg-slate-200" />
            <span className="absolute inset-x-0 -top-3 mx-auto w-fit bg-white px-3 text-xs text-slate-400">
              Continue
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleContinue}
              disabled={
                !formData.name ||
                !formData.username ||
                !formData.email ||
                isLoading ||
                usernameStatus !== "available"
              }
              className="h-11 w-full rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
            <p className="text-center text-[11px] text-slate-500">
              Make sure all fields are valid before continuing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { Button } from "@/components/ui/button";

export default function ConfirmationStep() {
  const router = useRouter();
  const { name, username, avatar, resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      resetOnboarding();
      router.push("/space");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, resetOnboarding]);

  const handleContinue = () => {
    resetOnboarding();
    router.push("/space");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center space-y-8">
        {/* Success Animation */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto mb-6">
            {/* Avatar Preview */}
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center shadow-xl"
              style={{ backgroundColor: avatar.color || "#6366F1" }}
            >
              {avatar.emoji && <span className="text-6xl">{avatar.emoji}</span>}
            </div>

            {/* Success checkmark */}
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Looking good!</h1>

          <div className="space-y-2">
            <p className="text-xl font-semibold text-gray-800">
              Welcome to Binder, {name}!
            </p>
            <p className="text-gray-600">@{username}</p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            You're all set up and ready to start chatting and taking notes with
            your groups.
          </p>
        </div>

        {/* Success Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Phone verified</span>
          </div>

          <div className="flex items-center justify-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Profile created</span>
          </div>

          <div className="flex items-center justify-center space-x-2 text-green-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">Ready to go!</span>
          </div>
        </div>

        {/* Auto-redirect indicator */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Redirecting to your dashboard...
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
            <div
              className="bg-blue-600 h-1 rounded-full animate-pulse"
              style={{ animation: "grow 3s linear forwards" }}
            ></div>
          </div>

          <Button onClick={handleContinue} size="lg" className="w-full">
            Continue to Dashboard
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes grow {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

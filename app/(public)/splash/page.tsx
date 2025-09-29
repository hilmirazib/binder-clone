"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { supabase } from "@/lib/supabase";

export default function SplashPage() {
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("Profile")
            .select("*")
            .eq("userId", user.id)
            .single();

          if (profile && profile.displayName && profile.username) {
            router.push("/space");
          } else {
            router.push("/onboarding");
          }
        } else {
          resetOnboarding();

          setTimeout(() => {
            router.push("/onboarding");
          }, 2000);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/onboarding");
      }
    };

    checkAuth();
  }, [router, resetOnboarding]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* Binder Logo */}
        <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
          <div className="text-white text-3xl font-bold">B</div>
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Binder</h1>
        <p className="text-gray-600">Smarter chats. Zero spam.</p>

        {/* Loading animation */}
        <div className="mt-8">
          <div className="w-8 h-8 mx-auto">
            <div className="w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

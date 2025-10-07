"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";
import { MessageCircle, MessageSquare } from "lucide-react";
import { sendPhoneOTP } from "@/lib/auth-helpers";

export default function VerificationStep() {
  const {
    phoneNumber,
    countryCode,
    setVerificationMethod,
    nextStep,
    setLoading,
    setError,
    isLoading,
    error,
  } = useOnboardingStore();

  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  const handleMethodSelect = async (method: "sms" | "whatsapp") => {
    setLoading(true);
    setError(null);
    setVerificationMethod(method);

    try {
      await sendPhoneOTP(fullPhoneNumber, method);
      nextStep();
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] bg-slate-50 py-12">
      <section className="max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Choose verification
            </h1>
            <p className="text-sm text-slate-500">
              Send code to{" "}
              <span className="font-medium text-slate-700">
                {fullPhoneNumber}
              </span>
              .
            </p>
          </div>

          {error && (
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
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

          <div className="space-y-3">
            <button
              disabled
              className="w-full h-14 rounded-xl border border-slate-300 px-4
                       flex items-center justify-between text-left disabled:opacity-60"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-medium text-slate-900">
                    WhatsApp
                  </span>
                  <span className="block text-xs text-slate-500">
                    Coming soon
                  </span>
                </span>
              </span>
              <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
                Disabled
              </span>
            </button>

            <button
              onClick={() => handleMethodSelect("sms")}
              disabled={isLoading}
              className="w-full h-14 rounded-xl border border-slate-300 px-4
                       flex items-center justify-between text-left hover:bg-slate-50
                       disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-medium text-slate-900">
                    SMS
                  </span>
                  <span className="block text-xs text-slate-500">
                    Get code via text
                  </span>
                </span>
              </span>
              <span className="text-slate-400">{">"}</span>
            </button>

            {isLoading && (
              <div className="text-center text-xs text-slate-500">
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                Sending verification code...
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Carrier SMS delivery may take up to a minute.
          </p>
        </div>
      </section>
    </div>
  );
}

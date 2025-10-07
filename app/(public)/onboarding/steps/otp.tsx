"use client";

import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { verifyOTP, sendPhoneOTP } from "@/lib/auth-helpers";
import { otpSchema } from "@/lib/validation";
import { OTPInput } from "@/components/onboarding/OTPInput";

export default function OTPStep() {
  const {
    phoneNumber,
    countryCode,
    verificationMethod,
    otpCode,
    setOTPCode,
    nextStep,
    previousStep,
    setLoading,
    setError,
    isLoading,
    error,
  } = useOnboardingStore();

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    const validation = otpSchema.safeParse({ code: otpCode });

    if (!validation.success) {
      setError(
        validation.error?.issues?.[0]?.message ||
          "An unknown validation error occurred.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyOTP(fullPhoneNumber, otpCode);

      if (result.user) {
        nextStep();
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError("Wrong code. Please double-check and try again.");
      setOTPCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError(null);

    try {
      await sendPhoneOTP(fullPhoneNumber, verificationMethod || "sms");

      setCountdown(60);
      setCanResend(false);
      setOTPCode("");
    } catch (error) {
      console.error("Failed to resend code:", error);
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (otpCode.length === 6 && !isLoading) {
      handleVerify();
    }
  }, [otpCode]);

  return (
    <div className="min-h-[60vh] bg-slate-50 py-12">
      <section className="max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Enter the code
            </h1>
            <p className="text-sm text-slate-500">
              We sent a code to{" "}
              <span className="font-medium text-slate-700">
                {fullPhoneNumber}
              </span>{" "}
              via {verificationMethod === "whatsapp" ? "WhatsApp" : "SMS"}.
            </p>
          </div>

          {/* OTP inputs */}
          <div className="mx-auto w-full max-w-[320px]">
            <OTPInput
              value={otpCode}
              onChange={setOTPCode}
              length={6}
              error={!!error}
            />
          </div>

          {error && (
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 mx-auto">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <p className="text-sm text-red-700">Oops! {error}</p>
            </div>
          )}

          {/* Divider tipis */}
          <div className="relative">
            <div className="h-px bg-slate-200" />
            <span className="absolute inset-x-0 -top-3 mx-auto w-fit bg-white px-3 text-xs text-slate-400">
              Help
            </span>
          </div>

          {/* Actions/help */}
          <div className="space-y-3">
            <p className="text-center text-xs text-slate-500">
              Didn't get the code?
            </p>

            <div className="flex items-center justify-between text-xs">
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="font-medium text-blue-600 hover:underline disabled:opacity-60"
                >
                  Resend via{" "}
                  {verificationMethod === "whatsapp" ? "WhatsApp" : "SMS"}
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Resend available in {countdown}s
                </span>
              )}

              <button
                onClick={previousStep}
                disabled={isLoading}
                className="text-slate-600 hover:underline disabled:opacity-60"
              >
                Change verification method
              </button>
            </div>

            {isLoading && (
              <div className="text-center text-xs text-slate-500">
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-top-color-transparent" />
                Verifying code...
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            It can take up to a minute for the SMS to arrive.
          </p>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { verifyOTP, sendPhoneOTP } from "@/lib/auth-helpers";
import { Button } from "@/components/ui/button";
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
      setError(validation.error.errors[0].message);
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
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Enter the code
          </h1>
          <p className="text-gray-600 leading-relaxed">
            We just texted you at{" "}
            <span className="font-semibold">{fullPhoneNumber}</span> via{" "}
            {verificationMethod === "whatsapp" ? "WhatsApp" : "SMS"}. It may
            take a few minutes to get it.
          </p>
        </div>

        <div className="space-y-6">
          <OTPInput
            value={otpCode}
            onChange={setOTPCode}
            length={6}
            error={!!error}
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                Oops! Wrong code.
              </div>
              <div className="text-xs">{error}</div>
            </div>
          )}

          {isLoading && (
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-gray-600">Verifying code...</span>
              </div>
            </div>
          )}
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">Didn't get the code?</p>

          <div className="space-y-2">
            {canResend ? (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isLoading}
                >
                  Resend via{" "}
                  {verificationMethod === "whatsapp" ? "WhatsApp" : "SMS"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={previousStep}
                  disabled={isLoading}
                >
                  Change verification method
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Resend available in {countdown}s
                </p>

                <Button
                  variant="ghost"
                  onClick={previousStep}
                  disabled={isLoading}
                >
                  Change verification method
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

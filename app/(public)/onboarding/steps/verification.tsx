"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";
import { Button } from "@/components/ui/button";
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
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Choose a verification method
          </h1>
          <p className="text-gray-600 leading-relaxed">
            We'll send you a verification code to make sure it's really you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Send code to:{" "}
              <span className="font-semibold">{fullPhoneNumber}</span>
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => handleMethodSelect("whatsapp")}
              variant="outline"
              className="w-full py-4 text-left justify-start h-auto"
              disabled={isLoading}
            >
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">WhatsApp</div>
                  <div className="text-sm text-gray-500">
                    Get code via WhatsApp
                  </div>
                </div>
                <div className="text-gray-400">{">"}</div>
              </div>
            </Button>

            <Button
              onClick={() => handleMethodSelect("sms")}
              variant="outline"
              className="w-full py-4 text-left justify-start h-auto"
              disabled={isLoading}
            >
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">SMS</div>
                  <div className="text-sm text-gray-500">
                    Get code via text message
                  </div>
                </div>
                <div className="text-gray-400">{">"}</div>
              </div>
            </Button>
          </div>

          {isLoading && (
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-gray-600">
                  Sending verification code...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

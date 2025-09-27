"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { PhoneInput } from "@/components/onboarding/PhoneInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { phoneSchema } from "@/lib/validation";

export default function WelcomeStep() {
  const {
    phoneNumber,
    countryCode,
    setPhoneNumber,
    setCountryCode,
    nextStep,
    setLoading,
    setError,
    isLoading,
    error,
  } = useOnboardingStore();

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleContinue = async () => {
    if (!phoneNumber || !agreedToTerms) {
      setError("Please enter phone number and agree to terms");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate phone number format
      const validation = phoneSchema.safeParse({
        countryCode,
        phoneNumber,
      });

      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }

      nextStep();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Welcome to Binder!
          </h1>
          <p className="text-gray-600 leading-relaxed">
            First things first, let's verify your phone number. This will be
            your login number moving forward.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number *
            </label>
            <PhoneInput
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onCountryCodeChange={setCountryCode}
              onPhoneNumberChange={setPhoneNumber}
              placeholder="8123456789"
            />
          </div>

          <p className="text-xs text-gray-500">
            Rest assured, your number stays private. Always!
          </p>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) =>
                setAgreedToTerms(checked as boolean)
              }
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-relaxed"
            >
              I agree to Binder's{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full py-3 text-base"
          disabled={!phoneNumber || !agreedToTerms || isLoading}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Validating...
            </div>
          ) : (
            "Continue →"
          )}
        </Button>
      </div>
    </div>
  );
}

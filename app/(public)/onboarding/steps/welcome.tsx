"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { PhoneInput } from "@/components/onboarding/PhoneInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { phoneSchema } from "@/lib/validation";
import Link from "next/link";

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
        throw new Error(validation.error.issues[0].message);
      }

      nextStep();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
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
              Welcome to Binder
            </h1>
            <p className="text-sm text-slate-500">
              Verify your phone number to continue.
            </p>
          </div>

          {/* Phone input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Phone number
            </label>
            <PhoneInput
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onCountryCodeChange={setCountryCode}
              onPhoneNumberChange={setPhoneNumber}
              placeholder="8123456789"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(c) => setAgreedToTerms(c as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-xs leading-relaxed text-slate-600"
            >
              I agree to Binder’s{" "}
              <a className="text-blue-600 underline">Terms</a> and{" "}
              <a className="text-blue-600 underline">Privacy</a>.
            </label>
          </div>

          {/* Error chip */}
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
              Continue
            </span>
          </div>

          {/* Actions (non-sticky) */}
          <div className="grid gap-3">
            <button
              onClick={handleContinue}
              disabled={!phoneNumber || !agreedToTerms || isLoading}
              className="h-11 rounded-full bg-slate-900 text-white text-sm font-medium
                         hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Validating..." : "Continue"}
            </button>

            {/* Login (outline pill) */}
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full text-sm"
            >
              <Link
                href="/login"
                aria-label="Log in if you already have an account"
              >
                Log in instead
              </Link>
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            We’ll send a 6-digit code to your phone number.
          </p>
        </div>
      </section>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { verifyOTP } from "@/lib/auth-helpers";
import { OTPInput } from "@/components/onboarding/OTPInput";

export default function VerifyPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [channel, setChannel] = useState<"sms" | "whatsapp">("sms");
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const p = sp.get("phone");
    const ch = sp.get("ch") as "sms" | "whatsapp" | null;
    if (p) setPhone(p);
    if (ch === "whatsapp") setChannel("whatsapp");
  }, []);

  useEffect(() => {
    if (code.length === 6 && !isLoading) {
      void verify();
    }
  }, [code]);

  async function verify() {
    if (code.length !== 6) return;
    setIsLoading(true);
    setErr(null);
    try {
      const result = await verifyOTP(phone, code);
      if (result.user) {
        window.location.href = "/you";
      } else {
        setErr("Wrong code, try again.");
      }
    } catch {
      setErr("Wrong code, try again.");
    } finally {
      setIsLoading(false);
    }
  }

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
              We sent a code via{" "}
              <span className="font-medium text-slate-700">
                {channel.toUpperCase()}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-700">
                {phone || "your phone"}
              </span>
              .
            </p>
          </div>

          {/* OTP inputs (48×48, center) */}
          <div className="mx-auto w-full max-w-[320px]">
            <OTPInput
              value={code}
              onChange={(v: string) =>
                setCode(v.replace(/\D/g, "").slice(0, 6))
              }
              length={6}
              error={!!err}
            />
          </div>

          {/* Error chip */}
          {err && (
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <p className="text-sm text-red-700">{err}</p>
            </div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="h-px bg-slate-200" />
            <span className="absolute inset-x-0 -top-3 mx-auto w-fit bg-white px-3 text-xs text-slate-400">
              Continue
            </span>
          </div>

          {/* Actions */}
          <div className="grid gap-2">
            <button
              onClick={verify}
              disabled={code.length !== 6 || isLoading}
              className="h-11 rounded-full bg-slate-900 text-white text-sm font-medium
                         hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
            <p className="text-center text-xs text-slate-500">
              It can take up to a minute for the {channel.toUpperCase()} to
              arrive.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [phone, setPhone] = useState("+62");
  const [loading, setLoading] = useState<"sms" | "whatsapp" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function sendOtp(channel: "sms" | "whatsapp") {
    setLoading(channel);
    setMsg(null);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { channel },
      });
      if (error) throw error;
      window.location.href = `/verify?phone=${encodeURIComponent(
        phone,
      )}&ch=${channel}`;
    } catch (e: any) {
      setMsg(e?.message ?? "Failed to send OTP");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-[60vh] bg-slate-50 py-12">
      <section className="max-w-md mx-auto">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in with phone
            </h1>
            <p className="text-sm text-slate-500">
              We’ll send a 6-digit code via SMS or WhatsApp.
            </p>
          </div>

          {/* Phone input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Phone number
            </label>
            <input
              className="w-full h-11 rounded-xl border border-slate-300 bg-white px-4
                       placeholder:text-slate-400 focus:outline-none focus:ring-2
                       focus:ring-slate-300 focus:border-slate-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 8123456789"
              inputMode="tel"
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="h-px bg-slate-200" />
            <span className="absolute inset-x-0 -top-3 mx-auto w-fit bg-white px-3 text-xs text-slate-400">
              Choose method
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              className="flex-1 h-11 rounded-full bg-slate-900 text-white text-sm font-medium
                       hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => sendOtp("sms")}
              disabled={!!loading}
            >
              {loading === "sms" ? "Sending…" : "Send via SMS"}
            </button>
            <button
              className="flex-1 h-11 rounded-full border border-slate-300 text-sm font-medium
                       hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => sendOtp("whatsapp")}
              disabled
            >
              {loading === "whatsapp" ? "Sending…" : "Send via WhatsApp"}
            </button>
          </div>

          {/* Inline alert */}
          {msg && (
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <p className="text-sm text-red-700">{msg}</p>
            </div>
          )}

          {/* Footer note */}
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Make sure geo-permissions for your country are enabled in Twilio
            Verify.
          </p>
        </div>
      </section>
    </div>
  );
}

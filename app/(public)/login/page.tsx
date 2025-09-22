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
    <section className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Sign in with phone</h1>
      <p className="text-sm text-gray-600">
        We’ll send a 6-digit code via SMS or WhatsApp.
      </p>

      <input
        className="w-full border rounded px-3 py-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+62 8123456789"
      />

      <div className="flex gap-2">
        <button
          className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
          onClick={() => sendOtp("sms")}
          disabled={!!loading}
        >
          {loading === "sms" ? "Sending…" : "Send via SMS"}
        </button>
        <button
          className="px-3 py-2 rounded border disabled:opacity-50"
          onClick={() => sendOtp("whatsapp")}
          disabled={!!loading}
        >
          {loading === "whatsapp" ? "Sending…" : "Send via WhatsApp"}
        </button>
      </div>

      {msg && <p className="text-sm text-red-600">{msg}</p>}

      <p className="text-xs text-gray-500">
        Make sure geo-permissions for your country are enabled in Twilio Verify.
      </p>
    </section>
  );
}

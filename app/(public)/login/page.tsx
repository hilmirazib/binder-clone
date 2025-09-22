"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [phone, setPhone] = useState("+62");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function sendOtpSms() {
    setLoading(true);
    setMsg(null);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { channel: "sms" },
      });
      if (error) throw error;
      window.location.href = `/verify?phone=${encodeURIComponent(phone)}`;
    } catch (e: any) {
      setMsg(e.message ?? "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Sign in with phone</h1>
      <input
        className="w-full border rounded px-3 py-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+62 8123456789"
      />
      <button
        className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
        onClick={sendOtpSms}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send code via SMS"}
      </button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </section>
  );
}

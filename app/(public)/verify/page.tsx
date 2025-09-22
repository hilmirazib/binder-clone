"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function VerifyPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("phone");
    if (p) setPhone(p);
  }, []);

  async function verify() {
    setErr(null);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: "sms",
      });
      if (error) throw error;
      // sukses -> ke onboarding (ensure profile terjadi di server)
      window.location.href = "/you";
    } catch (e: any) {
      setErr(e.message ?? "Wrong code, try again.");
    }
  }

  return (
    <section className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Enter the code</h1>
      <p className="text-sm text-gray-600">
        We sent an SMS to {phone || "your phone"}.
      </p>
      <input
        className="w-full border rounded px-3 py-2 tracking-widest text-center"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
        maxLength={6}
      />
      <button
        className="px-3 py-2 rounded bg-black text-white"
        onClick={verify}
      >
        Verify
      </button>
      {err && <p className="text-sm text-red-600">{err}</p>}
    </section>
  );
}

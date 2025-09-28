"use client";
import { useEffect, useState } from "react";
import { verifyOTP } from "@/lib/auth-helpers";

export default function VerifyPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [channel, setChannel] = useState<"sms" | "whatsapp">("sms");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const p = sp.get("phone");
    const ch = sp.get("ch") as "sms" | "whatsapp" | null;
    if (p) setPhone(p);
    if (ch === "whatsapp") setChannel("whatsapp");
  }, []);

  async function verify() {
    try {
      const result = await verifyOTP(phone, code);

      if (result.user) {
        window.location.href = "/you";
      }
    } catch (error) {
      setErr("Wrong code, try again.");
    } finally {
      setErr(null);
    }
  }

  return (
    <section className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Enter the code</h1>
      <p className="text-sm text-gray-600">
        We sent a code via <b>{channel.toUpperCase()}</b> to{" "}
        {phone || "your phone"}.
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

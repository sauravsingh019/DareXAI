"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, ShieldCheck, ArrowRight } from "lucide-react";
import DareXLogo from "@/components/DareXLogo";

export default function OnboardingPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, industry }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-canvas relative overflow-hidden">
      {/* Background neon glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-signal/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <form onSubmit={submit} className="max-w-md w-full glass-panel rounded-lg p-8 relative z-10">
        <div className="font-mono text-signal glow-text-signal text-xs tracking-widest mb-6 flex items-center gap-1.5 font-semibold">
          <DareXLogo className="h-5 w-5 animate-pulse" />
          <span>DAREXAI · SETUP</span>
        </div>
        <h1 className="text-lg font-medium text-ink mb-1">Tell us about your business</h1>
        <p className="text-mute text-xs mb-6">
          This gives your AI assistant the baseline business context it needs to execute tools from day one.
        </p>

        <div className="space-y-4 text-xs mb-6">
          <div>
            <label className="block text-mute mb-1.5 font-medium flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-mute" />
              <span>Business name</span>
            </label>
            <input
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal placeholder-mute"
              placeholder="e.g. Meridian Textiles"
            />
          </div>

          <div>
            <label className="block text-mute mb-1.5 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-mute" />
              <span>Industry</span>
            </label>
            <input
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal placeholder-mute"
              placeholder="e.g. B2B textile manufacturing"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400 mb-4 font-mono">⚠ {error}</p>}

        <button
          disabled={loading}
          className="w-full py-2.5 bg-signal text-canvas font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity text-xs flex items-center justify-center gap-1"
        >
          <span>{loading ? "Configuring workspace…" : "Enter platform"}</span>
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>
    </main>
  );
}

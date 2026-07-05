"use client";

import { useState } from "react";

const OWNERSHIPS = [
  "Sole Proprietorship – Owned by one person.",
  "Partnership – Owned by two or more people.",
  "Limited Liability Company (LLC) – Owners have limited personal liability (available in many countries).",
  "Private Limited Company (Pvt. Ltd.) – Privately owned; shares are not publicly traded.",
  "Public Limited Company (PLC/Ltd.) – Can offer shares to the public.",
  "Corporation – A separate legal entity owned by shareholders.",
  "Cooperative – Owned and operated by members for mutual benefit.",
  "Nonprofit Organization – Operates for a social or charitable purpose rather than profit."
];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Finance",
  "Education",
  "Construction",
  "Real Estate",
  "Hospitality",
  "Transportation",
  "Agriculture",
  "Energy",
  "Media & Entertainment",
  "Telecommunications",
  "E-commerce"
];

const SIZES = [
  "Micro Enterprise",
  "Small Business",
  "Medium Enterprise",
  "Large Enterprise",
  "Multinational Corporation (MNC)"
];

const MODELS = [
  "B2B (Business-to-Business)",
  "B2C (Business-to-Consumer)",
  "C2C (Consumer-to-Consumer)",
  "D2C (Direct-to-Consumer)",
  "B2G (Business-to-Government)"
];

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("AIzaSyD-mock-gemini-key-verification");
  const [showKey, setShowKey] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Antigravity, a B2B sales automation assistant. Analyze opportunities, draft WhatsApp replies with helpful tone, qualify deals, and log trace audit logs for every tool execution."
  );
  const [waNumber, setWaNumber] = useState("+919876543210");
  const [waTemplate, setWaTemplate] = useState("lead_qualification_v1");

  // Company profile states using the user parameters
  const [ownership, setOwnership] = useState(OWNERSHIPS[3]); // Pvt Ltd default
  const [industry, setIndustry] = useState(INDUSTRIES[2]); // Manufacturing default
  const [size, setSize] = useState(SIZES[2]); // Medium default
  const [model, setModel] = useState(MODELS[0]); // B2B default

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    setTimeout(() => {
      setSaving(false);
      setFeedback("Credentials, configurations, and Company Profile synced successfully.");
    }, 700);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1">
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">APIs & Console Settings</h1>
          <p className="text-mute text-xs">Configure your LLM credentials, webhook sandbox tokens, company profile, and prompts.</p>
        </div>
        {feedback && (
          <span className="text-[10px] font-mono border border-signal/20 bg-signal/5 px-3 py-1 rounded-full text-signal animate-fade-in">
            {feedback}
          </span>
        )}
      </div>

      <form onSubmit={saveSettings} className="space-y-6">
        {/* LLM Credentials Card */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal border-b border-line/35 pb-2">
            1. Gemini AI Credentials
          </h2>
          <div className="text-xs space-y-4">
            <div>
              <label className="block text-mute mb-1.5 font-medium">Gemini API Key</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal font-mono pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-3 text-[10px] text-mute hover:text-signal font-mono"
                >
                  {showKey ? "HIDE" : "SHOW"}
                </button>
              </div>
              <p className="text-[10px] text-mute mt-1.5 leading-normal">
                Used to execute the AI agent, analyze sentiments, and score incoming B2B leads.
              </p>
            </div>

            <div>
              <label className="block text-mute mb-1.5 font-medium font-sans">System Guidelines & Prompts</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal leading-relaxed font-mono resize-none"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Sandbox Configurations */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal border-b border-line/35 pb-2">
            2. WhatsApp Sandbox parameters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-mute mb-1.5 font-medium">Test Sandbox Phone Number</label>
              <input
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal font-mono"
              />
            </div>
            <div>
              <label className="block text-mute mb-1.5 font-medium">WhatsApp Template Name</label>
              <input
                value={waTemplate}
                onChange={(e) => setWaTemplate(e.target.value)}
                className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal font-mono"
              />
            </div>
          </div>
        </div>

        {/* Company & Tenant Profile (User Parameters Integration) */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal border-b border-line/35 pb-2">
            3. Tenant Company Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-mute mb-1.5 font-medium">Ownership Structure</label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value)}
                className="w-full bg-canvas border border-line rounded px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-signal"
              >
                {OWNERSHIPS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.split(" – ")[0]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-mute mb-1.5 font-medium">Industry Sector</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-canvas border border-line rounded px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-signal"
              >
                {INDUSTRIES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-mute mb-1.5 font-medium">Business Size Class</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-canvas border border-line rounded px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-signal"
              >
                {SIZES.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-mute mb-1.5 font-medium">Business Model Classification</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-canvas border border-line rounded px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-signal"
              >
                {MODELS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[10px] text-mute mt-3 leading-relaxed">
            * Note: These parameters adapt the AI auto-reply sentiment limits and route leads based on your specific business environment.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-signal text-canvas text-xs font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? "Synchronizing settings..." : "Synchronize Tenant Configurations"}
          </button>
        </div>
      </form>
    </main>
  );
}

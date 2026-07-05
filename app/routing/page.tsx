"use client";

import { useState } from "react";

interface SalesRep {
  id: string;
  name: string;
  role: string;
  activeLeads: number;
  status: "HIGH LOAD" | "MODERATE" | "AVAILABLE";
  conversion: string;
}

export default function RoutingPage() {
  const [threshold, setThreshold] = useState(85);
  const [waRoute, setWaRoute] = useState(true);
  const [slackAlert, setSlackAlert] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [reps, setReps] = useState<SalesRep[]>([
    { id: "1", name: "Sanjay Sharma", role: "Head of Sales", activeLeads: 12, status: "HIGH LOAD", conversion: "84%" },
    { id: "2", name: "Vikram Patel", role: "Senior Account Manager", activeLeads: 8, status: "MODERATE", conversion: "78%" },
    { id: "3", name: "Swati Bhat", role: "Inbound Specialist", activeLeads: 4, status: "AVAILABLE", conversion: "72%" },
  ]);

  function saveConfig() {
    setSaving(true);
    setFeedback("");
    setTimeout(() => {
      setSaving(false);
      setFeedback("Lead routing rules updated successfully.");
      setTimeout(() => setFeedback(""), 2000);
    }, 750);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">AI Smart Lead Router</h1>
          <p className="text-mute text-xs">Configure assignment policies to route qualified prospects between reps and AI bots.</p>
        </div>
        <div className="flex items-center gap-3">
          {feedback && (
            <span className="text-[10px] font-mono border border-signal/20 bg-signal/5 px-3 py-1 rounded-full text-signal">
              {feedback}
            </span>
          )}
          <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute font-bold">
            ROUTING SERVICE: ONLINE
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Left: Configuration rules */}
        <div className="glass-panel rounded-lg p-5 space-y-6">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-signal border-b border-line/35 pb-2">
            AI Assignment Policies
          </h2>
          <div className="space-y-4 text-xs">
            {/* Slider */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-mute mb-1.5">
                <span>Direct Lead Assignment Threshold</span>
                <span className="text-signal font-bold">Score &gt;= {threshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                step="5"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-signal bg-line h-1 rounded-lg"
              />
              <p className="text-[9px] text-mute mt-1.5 leading-relaxed">
                Leads scoring at or above this threshold will route directly to human representatives. Lower scores route to AI bot auto-responders.
              </p>
            </div>

            {/* Switches */}
            <div className="space-y-3.5 border-t border-line/40 pt-4">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-mute">Enable automatic WhatsApp rep assignment</span>
                <button
                  type="button"
                  onClick={() => setWaRoute(!waRoute)}
                  className={`w-9 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${waRoute ? "bg-signal" : "bg-line"}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-canvas transition-transform ${waRoute ? "translate-x-4.5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-mute">Send Slack alerts when lead is routed to human</span>
                <button
                  type="button"
                  onClick={() => setSlackAlert(!slackAlert)}
                  className={`w-9 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${slackAlert ? "bg-signal" : "bg-line"}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-canvas transition-transform ${slackAlert ? "translate-x-4.5" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-mute">Email customer summary to rep on routing</span>
                <button
                  type="button"
                  onClick={() => setEmailDigest(!emailDigest)}
                  className={`w-9 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${emailDigest ? "bg-signal" : "bg-line"}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-canvas transition-transform ${emailDigest ? "translate-x-4.5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            <button
              onClick={saveConfig}
              disabled={saving}
              className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity mt-4 text-xs"
            >
              {saving ? "Synchronizing routing rules..." : "Save Assignment Rules"}
            </button>
          </div>
        </div>

        {/* Right: Sales Rep Workload Matrix */}
        <div className="glass-panel rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-line bg-panel/30">
            <span className="text-[10px] font-mono text-mute uppercase tracking-widest font-bold">Active Sales Rep Allocation</span>
          </div>
          <div className="divide-y divide-line/45">
            {reps.map((rep) => (
              <div key={rep.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-ink block">{rep.name}</span>
                  <span className="text-[10px] text-mute block mt-0.5">{rep.role}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="font-mono text-[10px]">
                    <span className="text-mute block">Leads: {rep.activeLeads}</span>
                    <span className="text-mute block mt-0.5">Conv: {rep.conversion}</span>
                  </div>
                  <span className={`px-2 py-0.5 border rounded text-[9px] font-mono shrink-0 ${
                    rep.status === "AVAILABLE" ? "text-signal border-signal/20 bg-signal/5" :
                    rep.status === "MODERATE" ? "text-amber-400 border-amber-950/20 bg-amber-950/5" :
                    "text-red-400 border-red-950/20 bg-red-950/5"
                  }`}>
                    {rep.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

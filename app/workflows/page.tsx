"use client";

import { useState } from "react";

// Inline Custom SVG Icons to avoid Lucide React version mismatches
const PlayIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const HelpIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function WorkflowsPage() {
  const [leadActive, setLeadActive] = useState(true);
  const [leadThreshold, setLeadThreshold] = useState(80);
  const [waActive, setWaActive] = useState(true);
  const [waAutoReply, setWaAutoReply] = useState(true);
  const [emailActive, setEmailActive] = useState(false);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  function saveConfig() {
    setSaving(true);
    setFeedback("");
    setTimeout(() => {
      setSaving(false);
      setFeedback("Workflow adjustments synchronized successfully.");
    }, 800);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink">
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">AI Trigger Workflows</h1>
          <p className="text-mute text-xs">Configure automation pipelines and AI scoring thresholds.</p>
        </div>
        {feedback && (
          <span className="text-[10px] font-mono border border-signal/20 bg-signal/5 px-3 py-1 rounded-full text-signal">
            {feedback}
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Lead Qualification Pipeline Card */}
        <div className="glass-panel rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-signal flex items-center gap-1.5">
              <span>⚡ Lead Qualification Workflow</span>
            </h2>
            <button
              onClick={() => setLeadActive(!leadActive)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${leadActive ? "bg-signal" : "bg-line"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-canvas transition-transform duration-200 ${leadActive ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <p className="text-[11px] text-mute mb-4 leading-relaxed">
            Triggered automatically when a new B2B lead is captured in the CRM or via webhook. Runs Gemini classification to rate lead interest.
          </p>
          <div className="space-y-4 border-t border-line/40 pt-4 text-xs">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-mute mb-1.5">
                <span>AI Score Threshold (Hot Deal filter)</span>
                <span className="text-signal font-bold">{leadThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={leadThreshold}
                onChange={(e) => setLeadThreshold(Number(e.target.value))}
                disabled={!leadActive}
                className="w-full accent-signal bg-line h-1 rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-mute">Auto-trigger WhatsApp follow-up if qualified</span>
              <span className="text-signal font-mono">ENABLED</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-mute">Log deal task under opportunities</span>
              <span className="text-signal font-mono">ENABLED</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Auto-Reply Pipeline Card */}
        <div className="glass-panel rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-signal flex items-center gap-1.5">
              <span>⚡ Inbound Communications Workflow</span>
            </h2>
            <button
              onClick={() => setWaActive(!waActive)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${waActive ? "bg-signal" : "bg-line"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-canvas transition-transform duration-200 ${waActive ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
          <p className="text-[11px] text-mute mb-4 leading-relaxed">
            Ingests inbound WhatsApp messaging logs. Performs intent classification and sentiment indexing via Gemini to populate customer timeline.
          </p>
          <div className="space-y-3.5 border-t border-line/40 pt-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-mute">AI-suggested draft responses</span>
              <button
                onClick={() => setWaAutoReply(!waAutoReply)}
                disabled={!waActive}
                className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${waAutoReply ? "bg-signal" : "bg-line"}`}
              >
                <div className={`w-3 h-3 rounded-full bg-canvas transition-transform duration-200 ${waAutoReply ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-mute">Flag negative sentiment alerts</span>
              <span className="text-amber font-mono">ALWAYS ON</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Flowchart */}
      <div className="glass-panel rounded-lg p-5 mb-6">
        <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
          Active Pipeline Routing Model
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center font-mono text-[10px]">
          <div className="border border-line bg-panel p-3.5 rounded-lg">
            <span className="text-mute block mb-1">TRIGGER</span>
            <strong className="text-ink text-xs">Lead Ingest</strong>
          </div>
          <div className="text-mute rotate-90 md:rotate-0">➔</div>
          <div className="border border-line bg-panel p-3.5 rounded-lg">
            <span className="text-mute block mb-1">AI SCORING</span>
            <strong className="text-ink text-xs">Gemini Evaluation</strong>
          </div>
          <div className="text-mute rotate-90 md:rotate-0">➔</div>
          <div className={`border p-3.5 rounded-lg ${leadActive ? "border-signal/50 bg-signal/5" : "border-line bg-panel opacity-60"}`}>
            <span className="text-mute block mb-1">BRANCH ACTION</span>
            <strong className={leadActive ? "text-signal text-xs" : "text-mute text-xs"}>
              {leadActive ? `WhatsApp & Task (>=${leadThreshold}%)` : "Disabled"}
            </strong>
          </div>
        </div>
      </div>

      {/* Save Settings Action Bar */}
      <div className="flex justify-end gap-3">
        <button
          onClick={saveConfig}
          disabled={saving}
          className="px-5 py-2 bg-signal text-canvas text-xs font-semibold rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? "Synchronizing..." : "Save Workflow Configuration"}
        </button>
      </div>
    </main>
  );
}

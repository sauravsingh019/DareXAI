"use client";

import { useState } from "react";

// Custom inline SVG icons to prevent import mismatches
const PlayIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const PauseIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <rect x="6" y="4" width="4" height="16" rx="1"/>
    <rect x="14" y="4" width="4" height="16" rx="1"/>
  </svg>
);

interface CallLog {
  id: string;
  name: string;
  company: string;
  type: "INBOUND" | "OUTBOUND";
  duration: string;
  date: string;
  sentiment: string;
  intent: string;
  actions: string[];
  transcript: { speaker: string; text: string }[];
}

const CALLS: CallLog[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    company: "Meridian Textiles",
    type: "INBOUND",
    duration: "2m 45s",
    date: "Today, 11:34 AM",
    sentiment: "neutral",
    intent: "Price Negotiation",
    actions: [
      "Send updated volume pricing grid for linen fabric via WhatsApp",
      "Update opportunity pipeline deal value to ₹5,00,000",
      "Schedule callback for Tuesday 10 AM",
    ],
    transcript: [
      { speaker: "Customer", text: "Hello, I wanted to discuss the rates for the bulk order of 500 meters of linen fabric. The price you sent seems a bit high." },
      { speaker: "AI Voice Bot", text: "Hi Rahul, I understand. For 500 meters of linen, we can apply a custom volume discount of 10%, bringing the rate down. Does that work for your budget?" },
      { speaker: "Customer", text: "That sounds much more reasonable. Can you send me the updated pricing structure? I'll review it with my team." },
      { speaker: "AI Voice Bot", text: "Absolutely, I will send the updated price grid to your WhatsApp number immediately. I can also schedule a quick check-in call for next Tuesday at 10 AM if that fits." },
      { speaker: "Customer", text: "Yes, please do that. Tuesday morning works. Thank you." },
    ],
  },
  {
    id: "2",
    name: "Amit Gupta",
    company: "Gupta Tech Solutions",
    type: "OUTBOUND",
    duration: "1m 12s",
    date: "Yesterday, 4:15 PM",
    sentiment: "positive",
    intent: "Deal Qualification",
    actions: [
      "Qualify lead as HOT deal in CRM",
      "Create client account profile",
    ],
    transcript: [
      { speaker: "AI Voice Bot", text: "Hi Amit, this is the onboarding desk from DareXAI. We noticed your inquiry about widgets integrations." },
      { speaker: "Customer", text: "Yes! We are looking to buy 10,000 units of custom widgets for our Q3 manufacturing cycle. We need them delivered by mid-August." },
      { speaker: "AI Voice Bot", text: "Got it, that fits our production timelines perfectly. I've marked you as a qualified hot opportunity, and our account head will get back to you with the draft contract shortly." },
    ],
  },
  {
    id: "3",
    name: "Priya Nair",
    company: "Coastal Crafts",
    type: "INBOUND",
    duration: "1m 50s",
    date: "2 days ago",
    sentiment: "negative",
    intent: "Delivery Complaint",
    actions: [
      "Flag negative sentiment alert on dashboard",
      "Log priority support ticket with shipping vendor",
    ],
    transcript: [
      { speaker: "Customer", text: "Hi, our shipment was supposed to arrive yesterday morning, but the tracker is showing it hasn't even left the warehouse. This is holding up our operations!" },
      { speaker: "AI Voice Bot", text: "I apologize for the delay, Priya. Let me look up the tracker. It seems the package was delayed at warehouse hub 4. I will flag this immediately and coordinate priority courier dispatch." },
    ],
  },
];

export default function VoiceAiPage() {
  const [selectedCall, setSelectedCall] = useState<CallLog>(CALLS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">Voice AI Dashboard</h1>
          <p className="text-mute text-xs">Inspect client calls, read transcripts, and track AI-extracted actions.</p>
        </div>
        <span className="text-[10px] font-mono border border-signal/20 bg-signal/5 px-3 py-1 rounded-full text-signal">
          VOICE INTELLIGENCE ACTIVE
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Left: Call Logs List */}
        <div className="glass-panel rounded-lg overflow-hidden flex flex-col max-h-[600px] h-fit">
          <div className="px-4 py-3 border-b border-line bg-panel/30">
            <span className="text-[10px] font-mono text-mute uppercase tracking-widest font-bold">Call History Log</span>
          </div>
          <div className="divide-y divide-line/40 overflow-y-auto no-scrollbar">
            {CALLS.map((call) => {
              const isActive = selectedCall.id === call.id;
              return (
                <button
                  key={call.id}
                  onClick={() => { setSelectedCall(call); setIsPlaying(false); }}
                  className={`w-full text-left px-5 py-4 hover:bg-panel/30 transition-colors flex items-center justify-between text-xs ${
                    isActive ? "bg-panel border-l-2 border-signal pl-4.5" : ""
                  }`}
                >
                  <div className="min-w-0 pr-4">
                    <span className="text-ink font-semibold truncate block">{call.name}</span>
                    <span className="text-[10px] text-mute truncate block mt-0.5">{call.company}</span>
                  </div>
                  <div className="text-right shrink-0 text-[10px] font-mono text-mute">
                    <span className={call.type === "INBOUND" ? "text-sky-400" : "text-amber-400"}>
                      {call.type}
                    </span>
                    <span className="block mt-0.5">{call.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center/Right: Call Transcript & Waveform details */}
        <div className="md:col-span-2 space-y-6 max-h-[600px] overflow-y-auto pr-1 no-scrollbar flex flex-col">
          {/* Audio Player & Waveform Visualizer */}
          <div className="glass-panel rounded-lg p-5 flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-line/40 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-semibold text-ink">{selectedCall.name}</h3>
                <span className="text-[9px] text-mute font-mono">{selectedCall.company} · {selectedCall.date}</span>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-mono capitalize ${
                  selectedCall.sentiment === "positive" ? "text-signal border-signal/20 bg-signal/5" :
                  selectedCall.sentiment === "negative" ? "text-red-400 border-red-950/20 bg-red-950/5" :
                  "text-mute border-line bg-panel"
                }`}>
                  {selectedCall.sentiment}
                </span>
                <span className="text-mute border border-line bg-panel/50 px-2.5 py-0.5 rounded-full text-[9px] font-mono">
                  {selectedCall.intent}
                </span>
              </div>
            </div>

            {/* Pulsing Visual Waveform Bars */}
            <div className="flex items-center gap-1.5 h-12 justify-center w-full mb-4">
              {[6, 12, 18, 10, 24, 14, 28, 8, 16, 22, 12, 6, 14, 24, 18, 10, 28, 16, 8, 12, 6].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: isPlaying ? `${Math.max(4, h + Math.sin(Date.now() / 200 + i) * 6)}px` : `${h / 2}px`,
                    transition: "height 0.15s ease-in-out",
                  }}
                  className={`w-[3px] rounded-full ${isPlaying ? "bg-signal animate-pulse" : "bg-mute/40"}`}
                />
              ))}
            </div>

            {/* Play Button controls */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-signal text-canvas rounded-full hover:opacity-90 transition-opacity flex items-center justify-center shrink-0"
            >
              {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4 ml-0.5" />}
            </button>
          </div>

          {/* Transcript details and Action items split */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transcript Timeline */}
            <div className="glass-panel rounded-lg p-5 flex flex-col">
              <h4 className="text-[10px] font-mono text-signal uppercase tracking-wider mb-4 border-b border-line/40 pb-2">
                Call Dialog Transcript
              </h4>
              <div className="space-y-4 overflow-y-auto max-h-[300px] pr-1.5 text-[11px] leading-relaxed">
                {selectedCall.transcript.map((line, idx) => {
                  const isBot = line.speaker === "AI Voice Bot";
                  return (
                    <div key={idx} className="space-y-1">
                      <span className={`text-[9px] font-mono uppercase font-bold tracking-wider ${isBot ? "text-signal" : "text-sky-400"}`}>
                        {line.speaker}
                      </span>
                      <p className="text-ink/90 pl-1">{line.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Extracted Action Checklist */}
            <div className="glass-panel rounded-lg p-5">
              <h4 className="text-[10px] font-mono text-amber uppercase tracking-wider mb-4 border-b border-line/40 pb-2">
                ⚡ AI-Extracted Action Items
              </h4>
              <div className="space-y-3.5 text-xs text-mute font-mono">
                {selectedCall.actions.map((act, idx) => (
                  <label key={idx} className="flex gap-2.5 items-start cursor-pointer hover:text-ink transition-colors leading-relaxed">
                    <input
                      type="checkbox"
                      className="mt-1 accent-signal cursor-pointer"
                    />
                    <span>{act}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

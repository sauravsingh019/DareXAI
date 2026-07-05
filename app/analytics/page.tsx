"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    csat: 94,
    conversion: 68,
    avgDeal: 320000,
    channels: { whatsapp: 550, email: 320, calls: 140 },
    sentiment: { positive: 70, neutral: 20, negative: 10 },
  });

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">Analytics & Business Intelligence</h1>
          <p className="text-mute text-xs">Visual reporting of communication channels, conversion rates, and client sentiment.</p>
        </div>
        <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute">
          METRICS BOUNDARY: MONTHLY
        </span>
      </div>

      {/* KPI Circle progress meters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="glass-panel rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-mute uppercase tracking-widest block mb-1">CSAT SCORE</span>
            <span className="text-2xl font-bold font-mono text-signal glow-text-signal">{metrics.csat}%</span>
            <span className="text-[9px] text-mute block mt-1">Customer satisfaction index</span>
          </div>
          {/* Radial progress mockup using border and clip */}
          <div className="w-14 h-14 rounded-full border-4 border-signal/15 flex items-center justify-center relative shrink-0">
            <div className="absolute inset-0 rounded-full border-4 border-signal border-t-transparent border-r-transparent rotate-45" />
            <span className="text-[9px] font-mono font-bold text-signal">{metrics.csat}%</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-mute uppercase tracking-widest block mb-1">LEAD CONVERSION</span>
            <span className="text-2xl font-bold font-mono text-signal glow-text-signal">{metrics.conversion}%</span>
            <span className="text-[9px] text-mute block mt-1">Lead to Won pipeline conversion</span>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-signal/15 flex items-center justify-center relative shrink-0">
            <div className="absolute inset-0 rounded-full border-4 border-signal border-t-transparent rotate-[120deg]" />
            <span className="text-[9px] font-mono font-bold text-signal">{metrics.conversion}%</span>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-mute uppercase tracking-widest block mb-1">AVG OPPORTUNITY VALUE</span>
            <span className="text-xl font-bold font-mono text-signal glow-text-signal">₹{metrics.avgDeal.toLocaleString("en-IN")}</span>
            <span className="text-[9px] text-mute block mt-1">Mean value of qualified B2B deals</span>
          </div>
          {/* A simple gear/dollar graphic */}
          <div className="p-3 border border-line bg-canvas/40 rounded-lg shrink-0 text-signal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Row 2: Channels breakdown and Sentiment indexes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Channel volume bar chart */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
            Communication Channel breakdown
          </h2>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-mono text-[10px] text-mute mb-1">
                <span>WhatsApp Messages</span>
                <span className="text-signal font-bold">{metrics.channels.whatsapp}</span>
              </div>
              <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                <div style={{ width: "85%" }} className="h-full bg-signal rounded-full" />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between font-mono text-[10px] text-mute mb-1">
                <span>Inbound/Outbound Emails</span>
                <span className="text-sky-400 font-bold">{metrics.channels.email}</span>
              </div>
              <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                <div style={{ width: "55%" }} className="h-full bg-sky-400 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[10px] text-mute mb-1">
                <span>Recorded Phone Call Logs</span>
                <span className="text-amber font-bold">{metrics.channels.calls}</span>
              </div>
              <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                <div style={{ width: "25%" }} className="h-full bg-amber rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment breakdown */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
            Client Interaction Sentiment Index
          </h2>
          <div className="space-y-4 text-xs font-mono text-[10px]">
            <div>
              <div className="flex justify-between text-mute mb-1">
                <span>Positive Sentiment (Grounded)</span>
                <span className="text-signal font-bold">{metrics.sentiment.positive}%</span>
              </div>
              <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
                <div style={{ width: `${metrics.sentiment.positive}%` }} className="h-full bg-signal rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-mute mb-1">
                <span>Neutral Sentiment</span>
                <span className="text-mute font-bold">{metrics.sentiment.neutral}%</span>
              </div>
              <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
                <div style={{ width: `${metrics.sentiment.neutral}%` }} className="h-full bg-mute rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-mute mb-1">
                <span>Negative Sentiment (Alert Flagged)</span>
                <span className="text-red-400 font-bold">{metrics.sentiment.negative}%</span>
              </div>
              <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
                <div style={{ width: `${metrics.sentiment.negative}%` }} className="h-full bg-red-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Pipeline Funnel & Weekly Performance Log */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Pipeline Funnel */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
            B2B Pipeline Funnel Drop-off
          </h2>
          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-mono text-[9px] text-mute mb-1">
                <span>1. Ingested Leads (Total)</span>
                <span className="font-bold text-signal">100 Leads (100%)</span>
              </div>
              <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                <div style={{ width: "100%" }} className="h-full bg-signal rounded-full opacity-100" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[9px] text-mute mb-1">
                <span>2. Qualified Opportunities</span>
                <span className="font-bold text-signal">80 Leads (80%)</span>
              </div>
              <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                <div style={{ width: "80%" }} className="h-full bg-signal rounded-full opacity-85" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[9px] text-mute mb-1">
                <span>3. Proposals Delivered</span>
                <span className="font-bold text-signal">60 Deals (60%)</span>
              </div>
              <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                <div style={{ width: "60%" }} className="h-full bg-signal rounded-full opacity-70" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[9px] text-mute mb-1">
                <span>4. Contracts Negotiated</span>
                <span className="font-bold text-signal">35 Deals (35%)</span>
              </div>
              <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                <div style={{ width: "35%" }} className="h-full bg-signal rounded-full opacity-55" />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono text-[9px] text-mute mb-1">
                <span>5. Closed-Won Accounts</span>
                <span className="font-bold text-signal">18 Deals (18%)</span>
              </div>
              <div className="w-full bg-line rounded-full h-2 overflow-hidden">
                <div style={{ width: "18%" }} className="h-full bg-signal rounded-full opacity-40" />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Logs */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
            Weekly AI Agent Message Volume
          </h2>
          <div className="space-y-2.5 text-xs font-mono text-[10px] max-h-56 overflow-y-auto pr-1">
            {[
              { day: "Monday", count: 124 },
              { day: "Tuesday", count: 145 },
              { day: "Wednesday", count: 168 },
              { day: "Thursday", count: 130 },
              { day: "Friday", count: 155 },
              { day: "Saturday", count: 48 },
              { day: "Sunday", count: 32 },
            ].map((d, idx) => (
              <div key={idx} className="flex items-center gap-3.5">
                <span className="w-20 text-mute">{d.day}</span>
                <div className="flex-1 bg-line rounded-full h-1.5 overflow-hidden">
                  <div style={{ width: `${(d.count / 180) * 100}%` }} className="h-full bg-signal rounded-full" />
                </div>
                <span className="w-12 text-right text-signal font-bold">{d.count} msg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

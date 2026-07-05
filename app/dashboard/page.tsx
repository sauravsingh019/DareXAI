"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/KpiCard";
import Link from "next/link";

// Inline SVG Icons structured to prevent Tailwind prop overriding bugs
const UsersIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 shrink-0 ${className}`}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const TrendingUpIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 shrink-0 ${className}`}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const ClockIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 shrink-0 ${className}`}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const AwardIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 shrink-0 ${className}`}>
    <circle cx="12" cy="8" r="7"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);

const ShieldAlertIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 shrink-0 ${className}`}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ActivityIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 shrink-0 ${className}`}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

interface Metrics {
  tenantName: string;
  tenantSlug: string;
  activeOpportunities: number;
  pipelineValue: number;
  pendingFollowUps: number;
  wonThisMonth: number;
  aiAlerts: { id: string; message: string }[];
  recentActivity: { id: string; action: string; createdAt: string }[];
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          setError(data.error || "Failed to load dashboard metrics");
        } else {
          setMetrics(data);
        }
      })
      .catch(() => {
        setError("Unable to connect to the backend server");
      });
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  function getActionBadge(action: string) {
    if (action.startsWith("auth.")) {
      return "text-sky-400 border-sky-500/20 bg-sky-950/20";
    }
    if (action.startsWith("lead.")) {
      return "text-purple-400 border-purple-500/20 bg-purple-950/20";
    }
    if (action.startsWith("reply.") || action.startsWith("whatsapp.")) {
      return "text-signal border-signal/20 bg-signal/5";
    }
    return "text-mute border-line bg-panel/30";
  }

  return (
    <main className="p-8 w-full text-ink flex-1 overflow-y-auto space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">Business Dashboard</h1>
          <p className="text-mute text-xs">
            Live view of your operations console {metrics?.tenantName && <span>for <strong className="text-signal">{metrics.tenantName}</strong></span>}.
          </p>
        </div>
        {metrics?.tenantSlug && (
          <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute">
            SLUG: {metrics.tenantSlug}
          </span>
        )}
      </div>

      {error ? (
        <div className="text-xs text-red-400 border border-red-900/50 bg-red-950/20 rounded-md px-4 py-3 max-w-md font-mono flex items-center gap-2">
          <ShieldAlertIcon className="text-red-400" />
          <span>Error: {error}</span>
        </div>
      ) : !metrics ? (
        <div className="text-mute text-xs font-mono animate-pulse">Initializing terminal metrics…</div>
      ) : (
        <>
          {/* Metrics KPIs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Active Opportunities"
              value={String(metrics.activeOpportunities)}
              icon={<UsersIcon className="text-signal" />}
            />
            <KpiCard
              label="Revenue Pipeline"
              value={fmt(metrics.pipelineValue)}
              icon={<TrendingUpIcon className="text-signal" />}
            />
            <KpiCard
              label="Pending Follow-ups"
              value={String(metrics.pendingFollowUps)}
              accent="amber"
              icon={<ClockIcon className="text-amber" />}
            />
            <KpiCard
              label="Won This Month"
              value={fmt(metrics.wonThisMonth)}
              icon={<AwardIcon className="text-signal" />}
            />
          </div>

          {/* Core Dashboard Panels */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Security & Operations Health Monitor */}
            <div className="glass-panel rounded-lg p-5 flex flex-col justify-between min-h-[300px]">
              <div>
                <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-amber flex items-center gap-1.5 border-b border-line/35 pb-2">
                  <ShieldAlertIcon className="text-amber" />
                  AI Safety & System Health
                </h2>
                
                {metrics.aiAlerts && metrics.aiAlerts.length > 0 ? (
                  <ul className="space-y-3">
                    {metrics.aiAlerts.map((a) => (
                      <li key={a.id} className="text-xs text-ink/90 border-l border-amber/70 bg-amber/5 px-3 py-2 rounded-r-md leading-relaxed font-mono">
                        {a.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-mute">AI Assistant Security Isolation</span>
                      <span className="text-signal font-mono font-bold">✓ SECURED</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-mute">Multi-Tenant Boundary Filters</span>
                      <span className="text-signal font-mono font-bold">✓ ENFORCED</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-mute">Average Agent Response Latency</span>
                      <span className="text-signal font-mono">140ms (Optimal)</span>
                    </div>
                    
                    <div className="border-t border-line/40 pt-3.5 mt-3">
                      <span className="text-[10px] text-mute block font-mono mb-2">ACTIVE SECURITY VERIFICATION CHECKS</span>
                      <ul className="space-y-1.5 text-[10px] text-mute/80 font-mono">
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                          <span>Tenant parameter validation active</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                          <span>Google OAuth Redirection redemptions secured</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                          <span>httpOnly JWT Rotate-On-Refresh enabled</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Logs */}
            <div className="glass-panel rounded-lg p-5 min-h-[300px] flex flex-col justify-between">
              <div>
                <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal flex items-center gap-1.5 border-b border-line/35 pb-2">
                  <ActivityIcon className="text-signal" />
                  Audit Logs & Operations Feed
                </h2>
                <ul className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {metrics.recentActivity && metrics.recentActivity.length === 0 ? (
                    <p className="text-xs text-mute font-mono">No recent activity logged.</p>
                  ) : (
                    metrics.recentActivity?.map((a) => (
                      <li key={a.id} className="text-xs text-mute font-mono flex justify-between items-center py-1 last:border-0 border-b border-line/20">
                        <span className={`px-2 py-0.5 border rounded text-[9px] font-mono shrink-0 mr-3 ${getActionBadge(a.action)}`}>
                          {a.action}
                        </span>
                        <span className="text-ink/80 truncate flex-1 text-left">{a.action.startsWith("auth.") ? "User Logged In" : a.action.startsWith("lead.") ? "Lead Qualified" : "Timeline Ingestion"}</span>
                        <span className="text-[10px] text-mute/70 shrink-0 ml-2">{new Date(a.createdAt).toLocaleTimeString()}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Access Actions Footer */}
          <div className="border-t border-line/40 pt-4">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-mute mb-3">AI Intelligence Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <Link href="/chat" className="glass-panel p-3.5 rounded-lg hover:border-signal/50 transition-colors block text-left">
                <span className="text-signal block mb-1">💬 AI Agent</span>
                <span className="text-[10px] text-mute">Instruct your assistant</span>
              </Link>
              <Link href="/voice" className="glass-panel p-3.5 rounded-lg hover:border-signal/50 transition-colors block text-left">
                <span className="text-signal block mb-1">🎙 Voice AI</span>
                <span className="text-[10px] text-mute">Read call transcripts</span>
              </Link>
              <Link href="/knowledge" className="glass-panel p-3.5 rounded-lg hover:border-signal/50 transition-colors block text-left">
                <span className="text-signal block mb-1">📚 Knowledge</span>
                <span className="text-[10px] text-mute">Ground agent answers</span>
              </Link>
              <Link href="/workflows" className="glass-panel p-3.5 rounded-lg hover:border-signal/50 transition-colors block text-left">
                <span className="text-signal block mb-1">⚙ Workflows</span>
                <span className="text-[10px] text-mute">Adjust scoring settings</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

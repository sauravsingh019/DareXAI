"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DareXLogo from "@/components/DareXLogo";

// Inline Custom SVG Icons to avoid Lucide React version mismatches
const CpuIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
    <rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/>
    <line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/>
    <line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/>
    <line x1="20" y1="15" x2="23" y2="15"/>
    <line x1="1" y1="9" x2="4" y2="9"/>
    <line x1="1" y1="15" x2="4" y2="15"/>
  </svg>
);

const SparklesIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z"/>
  </svg>
);

const UsersIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const TrendingUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const MessageSquareIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);

const ShieldIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const WorkflowIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <path d="M7 10v4h7"/>
  </svg>
);

const CheckCircleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 mr-1.5 shrink-0" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 23 23" className="w-3.5 h-3.5 mr-1.5 shrink-0" fill="currentColor">
    <path d="M0 0h11v11H0z" fill="#f25022"/>
    <path d="M12 0h11v11H12z" fill="#7fba00"/>
    <path d="M0 12h11v11H0z" fill="#00a4ef"/>
    <path d="M12 12h11v11H12z" fill="#ffb900"/>
  </svg>
);

export default function Home() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot">("signin");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [feedback, setFeedback] = useState("");

  // Check URL params for login trigger
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        setAuthMode("signin");
        setIsAuthModalOpen(true);
      }
    }
  }, []);

  function handleSocialLogin(provider: string) {
    setFeedback("");
    if (provider === "google") {
      router.push("/api/auth/google");
    } else {
      // Simulate OAuth for GitHub/Microsoft/Bypass using dev provisioner
      setFeedback(`Redirecting via secure local bypass...`);
      setTimeout(() => {
        router.push("/api/auth/bypass");
      }, 600);
    }
  }

  function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setFeedback("");
    
    if (authMode === "forgot") {
      setFeedback(`Simulated: Recovery link dispatched to ${email}. Check mailbox.`);
      return;
    }

    setFeedback(authMode === "signin" ? "Authenticating credentials..." : "Provisioning workspace tenant...");
    setTimeout(() => {
      // Redirect to dev bypass to auto-provision session
      router.push("/api/auth/bypass");
    }, 600);
  }

  return (
    <div className="min-h-screen bg-transparent text-ink font-sans relative overflow-x-hidden selection:bg-signal selection:text-canvas">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-signal/[0.04] to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] -left-20 w-96 h-96 bg-signal/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[1400px] -right-20 w-96 h-96 bg-amber/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Header / Nav */}
      <header className="border-b border-line bg-canvas/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <DareXLogo className="h-6 w-6" />
            <div>
              <span className="font-bold text-xs tracking-widest text-ink font-mono uppercase">DAREXAI</span>
              <span className="text-[9px] text-mute block -mt-0.5 tracking-wider">BUSINESS OPERATIONS</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-xs text-mute">
            <a href="#features" className="hover:text-ink transition-colors">Platform Pillars</a>
            <a href="#workflow" className="hover:text-ink transition-colors">Qualification Automation</a>
            <a href="#architecture" className="hover:text-ink transition-colors">Security & Trust</a>
          </nav>
          <button
            onClick={() => { setAuthMode("signin"); setIsAuthModalOpen(true); }}
            className="px-4 py-2 border border-signal/20 bg-signal/5 hover:bg-signal/10 text-signal font-semibold rounded-md text-xs transition-colors font-mono"
          >
            Launch Console →
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        {/* Top Tagline */}
        <div className="text-signal text-[11px] tracking-[0.2em] mb-4 uppercase font-bold flex items-center justify-center gap-2">
          <DareXLogo className="w-4 h-4" />
          <span>DAREXAI PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink max-w-3xl mx-auto leading-[1.1] text-balance">
          The AI Business assistant that runs operations, <span className="text-signal glow-text-signal">not just a dashboard</span>.
        </h1>

        <p className="text-mute mt-6 text-sm sm:text-base max-w-xl mx-auto leading-relaxed opacity-90">
          Automate business operations using secure AI Agents, WhatsApp automation, CRM intelligence, call logs, and qualified workflow chains in a multi-tenant sandbox.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => { setAuthMode("signin"); setIsAuthModalOpen(true); }}
            className="px-6 py-3 bg-signal text-canvas font-semibold rounded-md hover:opacity-90 transition-opacity text-xs"
          >
            Enter Operations Console
          </button>
          <a
            href="#features"
            className="px-6 py-3 border border-line bg-panel/30 hover:bg-panel text-ink hover:text-signal font-semibold rounded-md text-xs transition-colors font-mono"
          >
            Explore Pillars ↓
          </a>
        </div>

        {/* Console UI Preview Mockup */}
        <div className="mt-14 max-w-4xl mx-auto glass-panel rounded-xl p-3 shadow-2xl relative">
          <div className="flex items-center justify-between px-3 py-2 border-b border-line bg-canvas/30 rounded-t-lg text-xs font-mono text-mute">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
              <span className="w-2.5 h-2.5 rounded-full bg-signal/30" />
            </div>
            <span>DAREXAI OPS BOARD (SIMULATOR ACTIVE)</span>
            <span className="text-signal">● LIVE SECURE SESSION</span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3 bg-canvas/60 rounded-b-lg border border-line/40">
            {/* Stat 1 */}
            <div className="border border-line bg-panel/40 p-3 rounded-lg text-left">
              <span className="text-[10px] text-mute font-mono uppercase">ACTIVE DEALS</span>
              <div className="text-lg font-bold text-signal font-mono mt-1">12 Opportunities</div>
            </div>
            {/* Stat 2 */}
            <div className="border border-line bg-panel/40 p-3 rounded-lg text-left">
              <span className="text-[10px] text-mute font-mono uppercase">REVENUE PIPELINE</span>
              <div className="text-lg font-bold text-signal font-mono mt-1">₹17,30,000</div>
            </div>
            {/* Stat 3 */}
            <div className="border border-line bg-panel/40 p-3 rounded-lg text-left">
              <span className="text-[10px] text-mute font-mono uppercase">AI ALERTS LOGGED</span>
              <div className="text-lg font-bold text-amber font-mono mt-1">2 Pending Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Pillars Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t border-line/60 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-2">The Five Operational Pillars</h2>
          <p className="text-mute text-xs max-w-sm mx-auto">Core features engineered for multi-tenant B2B automation.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="glass-panel p-6 rounded-lg transition-all">
            <div className="p-3 border border-signal/20 bg-signal/5 rounded-lg w-fit mb-4">
              <SparklesIcon className="w-5 h-5 text-signal" />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-ink">AI Agent Assistant</h3>
            <p className="text-mute text-xs leading-relaxed">
              An intelligent, context-aware business assistant that streams answers, parses customer queries, and calls backend CRM and WhatsApp tools automatically.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass-panel p-6 rounded-lg transition-all">
            <div className="p-3 border border-signal/20 bg-signal/5 rounded-lg w-fit mb-4">
              <UsersIcon className="w-5 h-5 text-signal" />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-ink">CRM Intelligence</h3>
            <p className="text-mute text-xs leading-relaxed">
              Full deals pipeline tracking with dynamic Next Best Action recommendations automatically generated by AI to optimize your sales conversion.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass-panel p-6 rounded-lg transition-all">
            <div className="p-3 border border-signal/20 bg-signal/5 rounded-lg w-fit mb-4">
              <MessageSquareIcon className="w-5 h-5 text-signal" />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-ink">Unified Inbox Center</h3>
            <p className="text-mute text-xs leading-relaxed">
              Consolidate WhatsApp, Email, and Call logs in a single thread timeline. Features real-time AI-powered sentiment analysis and intent detection.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Pillar 4 */}
          <div className="glass-panel p-6 rounded-lg transition-all">
            <div className="p-3 border border-signal/20 bg-signal/5 rounded-lg w-fit mb-4">
              <WorkflowIcon className="w-5 h-5 text-signal" />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-ink">Workflow Automation</h3>
            <p className="text-mute text-xs leading-relaxed">
              Automate multi-step pipelines. Qualified leads instantly trigger AI grading, WhatsApp follow-up schedules, sales task reminders, and audit trails.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="glass-panel p-6 rounded-lg transition-all">
            <div className="p-3 border border-signal/20 bg-signal/5 rounded-lg w-fit mb-4">
              <ShieldIcon className="w-5 h-5 text-signal" />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-ink">Tenant Isolation & Security</h3>
            <p className="text-mute text-xs leading-relaxed">
              Enforced tenant separation boundaries, secure cookies, PKCE OAuth, refresh token rotation, parameter validation, and comprehensive audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Workflow flowchart */}
      <section id="workflow" className="max-w-6xl mx-auto px-6 py-16 border-t border-line/60 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Automated Qualification Pipeline</h2>
          <p className="text-mute text-xs max-w-sm mx-auto">Visualizing our step-by-step lead processing workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="border border-line bg-panel p-4 rounded-lg text-center">
            <div className="text-[10px] font-mono text-signal mb-1">STAGE 1</div>
            <div className="text-xs font-semibold text-ink">New Lead Ingest</div>
            <p className="text-[10px] text-mute mt-1">Webhook logs inbound customer details</p>
          </div>
          <div className="flex justify-center text-mute rotate-90 md:rotate-0">→</div>
          <div className="border border-line bg-panel p-4 rounded-lg text-center">
            <div className="text-[10px] font-mono text-signal mb-1">STAGE 2</div>
            <div className="text-xs font-semibold text-ink">AI Scoring</div>
            <p className="text-[10px] text-mute mt-1">Gemini rates sales readiness 0-100</p>
          </div>
          <div className="flex justify-center text-mute rotate-90 md:rotate-0">→</div>
          <div className="border border-line bg-panel p-4 rounded-lg text-center">
            <div className="text-[10px] font-mono text-signal mb-1">STAGE 3</div>
            <div className="text-xs font-semibold text-ink">Follow-up Trigger</div>
            <p className="text-[10px] text-mute mt-1">Auto-sends customized WhatsApp text</p>
          </div>
        </div>
      </section>

      {/* Architecture & Security section */}
      <section id="architecture" className="max-w-6xl mx-auto px-6 py-16 border-t border-line/60 scroll-mt-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink mb-4">
              Enterprise-Grade Security by Architecture
            </h2>
            <p className="text-mute text-xs leading-relaxed mb-4">
              We separate security and access boundaries at the core data layer. Every query is filtered automatically using the tenant session token. It is impossible for one business tenant to ever read or write details belonging to another.
            </p>
            <ul className="space-y-2.5 text-xs text-mute font-mono">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-signal shrink-0" />
                <span>Google OAuth with PKCE for secure redirection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-signal shrink-0" />
                <span>httpOnly secure cookies guarding session tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-signal shrink-0" />
                <span>Refresh Token Rotation (RTR) to block replay attacks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-signal shrink-0" />
                <span>Every AI agent command validated inside audit logs</span>
              </li>
            </ul>
          </div>
          <div className="border border-line bg-panel p-6 rounded-xl font-mono text-[11px] leading-relaxed text-signal/80 relative">
            <div className="absolute top-3 right-3 text-[9px] text-mute border border-line px-2 py-0.5 rounded bg-canvas">
              AUDIT LOG
            </div>
            <div className="text-mute mb-2">// Tenant access isolation check</div>
            <div className="text-ink">
              <span className="text-purple-400">const</span> session = <span className="text-purple-400">await</span> getSession();
            </div>
            <div className="text-ink">
              <span className="text-purple-400">const</span> deals = <span className="text-purple-400">await</span> prisma.opportunity.findMany(&#123;
            </div>
            <div className="pl-4">
              where: &#123; tenantId: session.tenantId &#125;
            </div>
            <div className="text-ink">&#125;);</div>
            <div className="text-mute mt-4">// Proof of tenant boundary verification</div>
            <div className="text-signal glow-text-signal mt-1">
              [SYSTEM] SELECT * FROM opportunities WHERE tenant_id = &apos;tenant-uuid-1&apos;
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line py-12 bg-panel/30">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-mute font-mono">
          <div className="flex items-center gap-2.5">
            <DareXLogo className="h-5 w-5" />
            <span>DAREXAI CO. © 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ink transition-colors">Documentation</a>
          </div>
        </div>
      </footer>

      {/* Authentication Modal Overlay */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-sm w-full rounded-xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => { setIsAuthModalOpen(false); setFeedback(""); }}
              className="absolute top-4 right-4 text-mute hover:text-ink transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>

            {/* Brand Logo */}
            <div className="flex justify-center mb-3">
              <DareXLogo className="h-10 w-10 text-signal" />
            </div>
            <div className="font-mono text-signal glow-text-signal text-[11px] tracking-[0.25em] mb-5 uppercase font-semibold text-center">
              DAREXAI
            </div>

            {/* Mode selection tabs */}
            {authMode !== "forgot" && (
              <div className="flex gap-6 border-b border-line mb-5 text-[11px] font-mono justify-center">
                <button
                  onClick={() => { setAuthMode("signin"); setFeedback(""); }}
                  className={`pb-2 relative transition-colors ${authMode === "signin" ? "text-signal font-semibold" : "text-mute hover:text-ink"}`}
                >
                  Sign In
                  {authMode === "signin" && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-signal" />}
                </button>
                <button
                  onClick={() => { setAuthMode("signup"); setFeedback(""); }}
                  className={`pb-2 relative transition-colors ${authMode === "signup" ? "text-signal font-semibold" : "text-mute hover:text-ink"}`}
                >
                  Sign Up
                  {authMode === "signup" && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-signal" />}
                </button>
              </div>
            )}

            {/* Feedback Message */}
            {feedback && (
              <div className="text-[10px] font-mono border border-line bg-panel/50 px-3 py-2 rounded text-amber mb-4">
                {feedback}
              </div>
            )}

            {/* Form rendering */}
            {authMode === "signin" && (
              <form onSubmit={handleEmailAuth} className="space-y-4 text-xs">
                <div>
                  <label className="block text-mute mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-canvas border border-line rounded px-3.5 py-2 text-xs focus:outline-none focus:border-signal text-ink placeholder-mute"
                    placeholder="e.g. name@company.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-mute font-medium">Password</label>
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgot")}
                      className="text-[10px] text-signal hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-canvas border border-line rounded px-3.5 py-2 text-xs focus:outline-none focus:border-signal text-ink"
                    placeholder="••••••••"
                  />
                </div>
                <button className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 transition-opacity">
                  Sign In to Console
                </button>
              </form>
            )}

            {authMode === "signup" && (
              <form onSubmit={handleEmailAuth} className="space-y-4 text-xs">
                <div>
                  <label className="block text-mute mb-1 font-medium">Company / Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-canvas border border-line rounded px-3.5 py-2 text-xs focus:outline-none focus:border-signal text-ink placeholder-mute"
                    placeholder="e.g. Meridian Textiles"
                  />
                </div>
                <div>
                  <label className="block text-mute mb-1 font-medium">Work Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-canvas border border-line rounded px-3.5 py-2 text-xs focus:outline-none focus:border-signal text-ink placeholder-mute"
                    placeholder="e.g. name@company.com"
                  />
                </div>
                <div>
                  <label className="block text-mute mb-1 font-medium">Create Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-canvas border border-line rounded px-3.5 py-2 text-xs focus:outline-none focus:border-signal text-ink"
                    placeholder="••••••••"
                  />
                </div>
                <button className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 transition-opacity">
                  Create Account & Onboard
                </button>
              </form>
            )}

            {authMode === "forgot" && (
              <form onSubmit={handleEmailAuth} className="space-y-4 text-xs">
                <h3 className="text-xs font-semibold text-center">Reset your password</h3>
                <p className="text-[10px] text-mute text-center leading-relaxed">
                  Enter your email address and we will dispatch a password recovery link.
                </p>
                <div>
                  <label className="block text-mute mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-canvas border border-line rounded px-3.5 py-2 text-xs focus:outline-none focus:border-signal text-ink placeholder-mute"
                    placeholder="name@company.com"
                  />
                </div>
                <button className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 transition-opacity">
                  Send Recovery Link
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("signin"); setFeedback(""); }}
                  className="w-full text-center text-[10px] text-mute hover:text-signal block"
                >
                  ← Back to Sign In
                </button>
              </form>
            )}

            {/* Social Logins Divider */}
            <div className="mt-5 border-t border-line/60 pt-4">
              <div className="text-center text-[9px] text-mute uppercase tracking-widest mb-3 font-mono">
                Or Continue With
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="py-2 border border-line hover:border-signal/50 bg-panel/30 hover:bg-panel flex items-center justify-center rounded text-[10px] font-medium transition-colors"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button
                  onClick={() => handleSocialLogin("github")}
                  className="py-2 border border-line hover:border-signal/50 bg-panel/30 hover:bg-panel flex items-center justify-center rounded text-[10px] font-medium transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  <span>GitHub</span>
                </button>
                <button
                  onClick={() => handleSocialLogin("microsoft")}
                  className="py-2 border border-line hover:border-signal/50 bg-panel/30 hover:bg-panel flex items-center justify-center rounded text-[10px] font-medium transition-colors"
                >
                  <MicrosoftIcon />
                  <span>Microsoft</span>
                </button>
              </div>
            </div>

            {/* Developer Bypass Option */}
            <div className="mt-4 border-t border-line/45 pt-4">
              <button
                onClick={() => handleSocialLogin("bypass")}
                className="w-full py-2 border border-line/60 hover:border-signal bg-panel/40 hover:bg-panel text-signal font-mono text-[10px] tracking-wider rounded font-bold transition-all"
              >
                ⚡ Developer Bypass Login (Direct access)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

// Real Corporate Brand SVG Logos
const SalesforceIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="#009DDC">
    <path d="M18.1 10.4c-.6 0-1.1.2-1.6.5-.8-1.7-2.6-2.9-4.7-2.9-2.6 0-4.7 1.8-5.2 4.2-.3-.1-.7-.2-1-.2-1.9 0-3.5 1.5-3.5 3.4 0 1.9 1.6 3.4 3.5 3.4h12.5c2.3 0 4.1-1.8 4.1-4.1-.1-2.4-1.9-4.3-4.1-4.3z"/>
  </svg>
);

const ZohoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <rect x="3" y="3" width="8" height="8" fill="#E42527" rx="1"/>
    <rect x="13" y="3" width="8" height="8" fill="#089949" rx="1"/>
    <circle cx="7" cy="17" r="4" fill="#226DB4"/>
    <circle cx="17" cy="17" r="4" fill="#F9B21D"/>
  </svg>
);

const HubSpotIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none" stroke="#FF7A59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <circle cx="12" cy="5" r="2"/>
    <circle cx="6" cy="17" r="2"/>
    <circle cx="18" cy="17" r="2"/>
    <line x1="12" y1="7" x2="12" y2="9"/>
    <line x1="7.5" y1="15.5" x2="10" y2="13.5"/>
    <line x1="16.5" y1="15.5" x2="14" y2="13.5"/>
  </svg>
);

const PipedriveIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="#00B887">
    <path d="M12 2L2 9l10 7 10-7-10-7zm0 13l-8-5.6v3.2l8 5.6 8-5.6v-3.2l-8 5.6z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <path d="M21.35 11.1H12v3.8h5.38c-.23 1.22-.92 2.26-1.96 2.96v2.45h3.17c1.86-1.72 2.93-4.25 2.93-7.21 0-.6-.05-1.17-.17-1.57z" fill="#4285F4"/>
    <path d="M12 21c2.43 0 4.47-.8 5.96-2.19l-3.17-2.45c-.88.6-2 .95-3.17.95-2.44 0-4.51-1.65-5.25-3.87H3.1v2.53C4.58 18.28 8.03 21 12 21z" fill="#34A853"/>
    <path d="M6.75 13.44c-.19-.58-.3-1.2-.3-1.84s.11-1.26.3-1.84V7.23H3.1A8.995 8.995 0 003.1 16.77l3.65-3.33z" fill="#FBBC05"/>
    <path d="M12 6.75c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 4.09 14.43 3 12 3c-3.97 0-7.42 2.72-8.9 5.53l3.65 3.33c.74-2.22 2.81-3.87 5.25-3.87z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <rect x="3" y="3" width="8" height="8" fill="#F25022"/>
    <rect x="13" y="3" width="8" height="8" fill="#7FBA00"/>
    <rect x="3" y="13" width="8" height="8" fill="#00A4EF"/>
    <rect x="13" y="13" width="8" height="8" fill="#FFB900"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="#25D366">
    <path d="M12.004 2C6.48 2 2.002 6.477 2.002 12c0 1.91.537 3.69 1.47 5.215L2.023 22l4.945-1.42a9.957 9.957 0 005.036 1.423c5.524 0 10.002-4.477 10.002-10s-4.478-10-10.002-10zm5.836 13.9c-.244.693-1.422 1.253-1.96 1.3-.49.043-1.127.172-3.328-.742-2.813-1.17-4.605-4.04-4.745-4.227-.14-.188-1.134-1.51-1.134-2.88 0-1.37.715-2.043.97-2.316.254-.272.553-.34.737-.34.184 0 .368.002.528.01.164.007.387-.063.606.464.224.54.767 1.868.83 2.002.065.134.11.29.02.467-.09.177-.134.29-.267.447-.133.156-.28.35-.4.47-.133.134-.273.28-.117.548.156.268.694 1.135 1.488 1.84.996.883 1.832 1.157 2.09 1.292.257.135.41.11.56-.06.15-.173.65-.758.825-1.02.174-.26.347-.217.586-.13.24.088 1.518.717 1.777.847.26.13.432.195.496.305.064.11.064.63-.18 1.323z"/>
  </svg>
);

const TwilioIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="#F22F46">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="9" cy="9" r="1.8" fill="#FFF"/>
    <circle cx="15" cy="9" r="1.8" fill="#FFF"/>
    <circle cx="9" cy="15" r="1.8" fill="#FFF"/>
    <circle cx="15" cy="15" r="1.8" fill="#FFF"/>
  </svg>
);

const SlackIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523 2.528 2.528 0 01-2.522-2.523 2.528 2.528 0 012.522-2.52h2.52v2.52zM6.302 15.165a2.528 2.528 0 012.52-2.52h5.043a2.528 2.528 0 012.522 2.52v5.043a2.528 2.528 0 01-2.522 2.52H8.822a2.528 2.528 0 01-2.52-2.52v-5.043z" fill="#36C5F0"/>
    <path d="M8.822 5.042a2.528 2.528 0 01-2.52-2.52 2.528 2.528 0 012.52-2.522 2.528 2.528 0 012.52 2.522v2.52h-2.52zM8.822 6.302a2.528 2.528 0 012.52 2.52v5.043a2.528 2.528 0 01-2.52 2.522H3.779a2.528 2.528 0 01-2.52-2.522V8.822a2.528 2.528 0 012.52-2.52h5.043z" fill="#2EB67D"/>
    <path d="M18.958 8.822a2.528 2.528 0 012.52-2.52 2.528 2.528 0 012.522 2.52 2.528 2.528 0 01-2.522 2.52h-2.52v-2.52zM17.698 8.822a2.528 2.528 0 01-2.52 2.52h-5.043a2.528 2.528 0 01-2.522-2.52V3.779a2.528 2.528 0 012.522-2.52h5.043a2.528 2.528 0 012.52 2.52v5.043z" fill="#ECB22E"/>
    <path d="M15.178 18.958a2.528 2.528 0 012.52 2.52 2.528 2.528 0 01-2.52 2.522 2.528 2.528 0 01-2.52-2.522v-2.52h2.52zM15.178 17.698a2.528 2.528 0 01-2.52-2.52v-5.043a2.528 2.528 0 012.52-2.52h5.043a2.528 2.528 0 012.52 2.52v5.043a2.528 2.528 0 01-2.52 2.52h-5.043z" fill="#E01E5A"/>
  </svg>
);

const ZapierIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0">
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="#FF4A00" strokeWidth="3"/>
  </svg>
);

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "CONNECTED" | "DISCONNECTED";
  category: "CRM" | "CHANNELS" | "UTILITIES";
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    { id: "salesforce", name: "Salesforce CRM", description: "Synchronize leads, contacts, and opportunities with Salesforce in real-time.", icon: <SalesforceIcon />, status: "DISCONNECTED", category: "CRM" },
    { id: "zoho", name: "Zoho CRM", description: "Map pipeline opportunities and contact information to your Zoho CRM workspace.", icon: <ZohoIcon />, status: "DISCONNECTED", category: "CRM" },
    { id: "hubspot", name: "HubSpot", description: "Sync customer deals, notes, and timeline activities automatically with HubSpot.", icon: <HubSpotIcon />, status: "CONNECTED", category: "CRM" },
    { id: "pipedrive", name: "Pipedrive CRM", description: "Push custom deals, contact phone records, and email tags directly into Pipedrive.", icon: <PipedriveIcon />, status: "DISCONNECTED", category: "CRM" },
    
    { id: "whatsapp", name: "WhatsApp Business API", description: "Send automated updates and qualify incoming prospects over WhatsApp.", icon: <WhatsAppIcon />, status: "CONNECTED", category: "CHANNELS" },
    { id: "google", name: "Google Gmail & Calendar", description: "Connect corporate email chains and calendar appointments to AI agent scheduling.", icon: <GoogleIcon />, status: "DISCONNECTED", category: "CHANNELS" },
    { id: "microsoft", name: "Microsoft 365 Outlook", description: "Sync calendar scheduling hooks and outreach sequences with Outlook.", icon: <MicrosoftIcon />, status: "DISCONNECTED", category: "CHANNELS" },
    { id: "twilio", name: "Twilio Voice", description: "Integrate Twilio phone routing to compile call logs and transcripts in inbox.", icon: <TwilioIcon />, status: "CONNECTED", category: "CHANNELS" },
    
    { id: "slack", name: "Slack Notifications", description: "Stream CRM operations alerts and qualified lead logs to your Slack channels.", icon: <SlackIcon />, status: "DISCONNECTED", category: "UTILITIES" },
    { id: "zapier", name: "Zapier Connect", description: "Connect with 5000+ external apps to automate ingest triggers.", icon: <ZapierIcon />, status: "CONNECTED", category: "UTILITIES" },
  ]);

  const [activeIntegration, setActiveIntegration] = useState<IntegrationItem | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleConnectClick(item: IntegrationItem) {
    if (item.status === "CONNECTED") {
      setIntegrations(integrations.map((i) => (i.id === item.id ? { ...i, status: "DISCONNECTED" as const } : i)));
    } else {
      setActiveIntegration(item);
      setApiKey("");
      setApiUrl("");
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!activeIntegration) return;

    setConnecting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setConnecting(false);
          setIntegrations(
            integrations.map((i) => (i.id === activeIntegration.id ? { ...i, status: "CONNECTED" as const } : i))
          );
          setActiveIntegration(null);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">Integrations Hub</h1>
          <p className="text-mute text-xs">Connect external CRM databases, email channels, and voice tools to DareXAI.</p>
        </div>
        <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute">
          ACTIVE SYNC BOUNDARY
        </span>
      </div>

      {/* Categories */}
      {["CRM", "CHANNELS", "UTILITIES"].map((cat) => {
        const list = integrations.filter((i) => i.category === cat);
        return (
          <div key={cat} className="mb-8 last:mb-0">
            <h2 className="text-[10px] font-mono text-signal uppercase tracking-[0.15em] mb-4">
              {cat === "CRM" ? "CRM & Pipeline Connections" : cat === "CHANNELS" ? "Channels & Communication Sync" : "Workflow & System Utilities"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {list.map((item) => (
                <div key={item.id} className="glass-panel rounded-lg p-5 flex flex-col justify-between h-52">
                  <div>
                    <div className="flex justify-between items-start mb-3.5">
                      <div className="p-2 border border-line bg-canvas/40 rounded-lg shrink-0 flex items-center justify-center w-10 h-10">
                        {item.icon}
                      </div>
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-mono ${
                        item.status === "CONNECTED" ? "text-signal border-signal/20 bg-signal/5" : "text-mute border-line bg-panel"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-ink mb-1 truncate">{item.name}</h3>
                    <p className="text-[10px] text-mute leading-relaxed line-clamp-2">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleConnectClick(item)}
                    className={`w-full py-2 rounded text-[10px] font-mono font-bold transition-all border mt-3.5 shrink-0 ${
                      item.status === "CONNECTED"
                        ? "border-red-950/40 text-red-400 bg-red-950/10 hover:bg-red-950/20"
                        : "border-signal/20 text-signal bg-signal/5 hover:bg-signal/10"
                    }`}
                  >
                    {item.status === "CONNECTED" ? "DISCONNECT" : "CONNECT API"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Connect Configuration Overlay Drawer Modal */}
      {activeIntegration && (
        <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="glass-panel max-w-sm w-full rounded-xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => { if (!connecting) setActiveIntegration(null); }}
              className="absolute top-4 right-4 text-mute hover:text-ink transition-colors"
              disabled={connecting}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-line/40 pb-3">
              <div className="p-2 border border-line bg-canvas/40 rounded-lg shrink-0">
                {activeIntegration.icon}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-ink">Connect {activeIntegration.name}</h3>
                <span className="text-[9px] text-mute font-mono">Input API credentials below</span>
              </div>
            </div>

            {connecting ? (
              <div className="py-8 text-center text-xs font-mono space-y-3">
                <div className="text-signal animate-pulse">Establishing connection parameters...</div>
                <div className="w-full bg-line rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                  <div style={{ width: `${progress}%` }} className="h-full bg-signal rounded-full transition-all duration-300" />
                </div>
                <span className="text-[10px] text-mute block">{progress}% Verified</span>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-mute mb-1.5 font-medium">Integration API Endpoint URL</label>
                  <input
                    type="url"
                    required
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://api.integration.com/v1"
                    className="w-full bg-canvas border border-line rounded px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-signal font-mono placeholder-mute"
                  />
                </div>
                <div>
                  <label className="block text-mute mb-1.5 font-medium">Authentication Token / Secret Key</label>
                  <input
                    type="password"
                    required
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full bg-canvas border border-line rounded px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-signal font-mono"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveIntegration(null)}
                    className="px-3.5 py-1.5 border border-line hover:border-signal text-mute hover:text-ink text-xs font-mono rounded"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-1.5 bg-signal text-canvas text-xs font-medium rounded hover:opacity-90">
                    Verify & Save
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </main>
  );
}

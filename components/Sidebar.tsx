"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import DareXLogo from "./DareXLogo";

// Bulletproof inline SVG icons to prevent any lucide-react versioning crashes
const DashboardIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="9" rx="1"/>
    <rect x="14" y="3" width="7" height="5" rx="1"/>
    <rect x="14" y="12" width="7" height="9" rx="1"/>
    <rect x="3" y="16" width="7" height="5" rx="1"/>
  </svg>
);

const InboxIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
  </svg>
);

const CrmIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const MegaphoneIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 2v3M12 17v2"/>
  </svg>
);

const ContractIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const TicketIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2zM13 5v14M9 9h.01M9 15h.01"/>
  </svg>
);

const TasksIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);

const AnalyticsIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const AgentIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a8 8 0 00-8 8v2a2 2 0 002 2h12a2 2 0 002-2v-2a8 8 0 00-8-8zM12 18v3M9 21h6"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
  </svg>
);

const MicIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
  </svg>
);

const BookIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const RoutingIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="18" r="3"/>
    <circle cx="6" cy="6" r="3"/>
    <circle cx="18" cy="6" r="3"/>
    <path d="M6 9v7a3 3 0 003 3h6"/>
    <path d="M18 9v6"/>
  </svg>
);

const WorkflowIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <path d="M7 10v4h7"/>
  </svg>
);

const LogsIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="4 17 10 11 4 5"/>
    <line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
);

const SimulatorIcon = ({ className = "w-4 h-4" }) => (
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

const KeyIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const WidgetIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);

const ShareIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const SettingsIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const LogoutIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);

interface SidebarNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarGroup {
  title: string;
  items: SidebarNavItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Restore scroll position
    const saved = sessionStorage.getItem("sidebar-scroll");
    if (saved) {
      nav.scrollTop = parseInt(saved, 10);
    }

    // Listen to scroll to save position
    const handleScroll = () => {
      sessionStorage.setItem("sidebar-scroll", String(nav.scrollTop));
    };

    nav.addEventListener("scroll", handleScroll);
    return () => {
      nav.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const GROUPS: SidebarGroup[] = [
    {
      title: "Core Operations",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        { href: "/inbox", label: "Unified Inbox", icon: <InboxIcon /> },
        { href: "/crm", label: "CRM Core", icon: <CrmIcon /> },
        { href: "/campaigns", label: "Outreach Campaigns", icon: <MegaphoneIcon /> },
        { href: "/contracts", label: "B2B Contracts", icon: <ContractIcon /> },
        { href: "/tickets", label: "Support Tickets", icon: <TicketIcon /> },
        { href: "/tasks", label: "Operations Tasks", icon: <TasksIcon /> },
        { href: "/analytics", label: "Analytics & Reports", icon: <AnalyticsIcon /> },
      ],
    },
    {
      title: "AI Intelligence",
      items: [
        { href: "/chat", label: "AI Assistant", icon: <AgentIcon /> },
        { href: "/voice", label: "Voice AI", icon: <MicIcon /> },
        { href: "/knowledge", label: "Knowledge Base", icon: <BookIcon /> },
        { href: "/routing", label: "Smart Router", icon: <RoutingIcon /> },
        { href: "/workflows", label: "Workflows", icon: <WorkflowIcon /> },
        { href: "/logs", label: "Trace Logs", icon: <LogsIcon /> },
      ],
    },
    {
      title: "System Control",
      items: [
        { href: "/simulator", label: "Simulator Deck", icon: <SimulatorIcon /> },
        { href: "/api-keys", label: "API Access Keys", icon: <KeyIcon /> },
        { href: "/widget", label: "Web Chat Widget", icon: <WidgetIcon /> },
        { href: "/integrations", label: "Integrations", icon: <ShareIcon /> },
        { href: "/settings", label: "Settings & APIs", icon: <SettingsIcon /> },
      ],
    },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-56 shrink-0 border-r border-line bg-[#090b0a]/70 backdrop-blur-xl flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-line flex items-center gap-2.5">
        <DareXLogo className="h-6 w-6" />
        <div>
          <div className="font-mono text-signal text-xs tracking-widest uppercase font-semibold">DAREXAI</div>
          <div className="text-[9px] text-mute mt-0.5 uppercase tracking-wider font-semibold">ops console</div>
        </div>
      </div>

      {/* Grouped Nav Link Items */}
      <nav ref={navRef} className="flex-1 py-4 space-y-5 overflow-y-auto no-scrollbar">
        {GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-1 px-3">
            <div className="text-[9px] uppercase tracking-[0.15em] font-mono text-mute px-3 mb-1.5 font-bold opacity-80">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-all ${
                      isActive
                        ? "bg-signal/10 text-signal font-semibold border-l-2 border-signal pl-2"
                        : "text-mute hover:text-ink hover:bg-panel/20"
                    }`}
                  >
                    <span className={isActive ? "text-signal" : "text-mute"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Log Out footer */}
      <div className="p-3 border-t border-line">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-mute hover:text-red-400 hover:bg-red-950/10 rounded-md text-xs transition-colors text-left"
        >
          <LogoutIcon className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

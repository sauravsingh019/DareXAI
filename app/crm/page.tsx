"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Landmark, Tag, Phone, Mail, Building, Sparkles, TrendingUp, Search, Calendar, ChevronRight } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
}

interface Opportunity {
  id: string;
  title: string;
  stage: string;
  value: number;
  score?: number;
  nextBestAction?: string;
  nbaReasoning?: string;
  createdAt: string;
  contact: Contact;
}

const STAGES = ["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];
const STAGE_COLORS: Record<string, string> = {
  NEW: "border-sky-500/20 text-sky-400 bg-sky-950/20",
  QUALIFIED: "border-purple-500/20 text-purple-400 bg-purple-950/20",
  PROPOSAL: "border-indigo-500/20 text-indigo-400 bg-indigo-950/20",
  NEGOTIATION: "border-amber-500/20 text-amber-400 bg-amber-950/20",
  WON: "border-signal/20 text-signal bg-signal/5",
  LOST: "border-red-500/20 text-red-400 bg-red-950/20",
};

export default function CrmPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tab, setTab] = useState<"pipeline" | "contacts">("pipeline");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "" });
  const [search, setSearch] = useState("");

  async function load() {
    const [c, o] = await Promise.all([
      fetch("/api/crm/contacts").then((r) => r.json()),
      fetch("/api/crm/opportunities").then((r) => r.json()),
    ]);
    setContacts(c.contacts || []);
    setOpportunities(o.opportunities || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addContact(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/crm/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", phone: "", email: "", company: "" });
    setShowForm(false);
    load();
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || "").toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <main className="p-8 w-full text-ink">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">CRM Core</h1>
          <p className="text-mute text-xs">Manage deals pipeline and customer directories.</p>
        </div>
        <div className="flex items-center gap-3">
          {tab === "contacts" && (
            <div className="relative">
              <input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-canvas border border-line rounded px-3 py-1.5 pl-8 text-xs text-ink focus:outline-none focus:border-signal w-48 placeholder-mute"
              />
              <Search className="w-3.5 h-3.5 text-mute absolute left-2.5 top-2.5" />
            </div>
          )}
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-4 py-2 bg-signal text-canvas text-xs font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Creation form */}
      {showForm && (
        <form onSubmit={addContact} className="glass-panel rounded-lg p-5 mb-6 max-w-2xl transition-all duration-300">
          <h3 className="text-xs uppercase font-mono tracking-wider text-signal mb-4">Create New Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
            <div>
              <label className="block text-mute mb-1">Contact Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-canvas border border-line rounded px-3 py-2 text-xs focus:outline-none focus:border-signal"
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div>
              <label className="block text-mute mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full bg-canvas border border-line rounded px-3 py-2 text-xs focus:outline-none focus:border-signal"
                placeholder="e.g. Meridian Textiles"
              />
            </div>
            <div>
              <label className="block text-mute mb-1">Phone Number</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-canvas border border-line rounded px-3 py-2 text-xs focus:outline-none focus:border-signal"
                placeholder="e.g. +919876543210"
              />
            </div>
            <div>
              <label className="block text-mute mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-canvas border border-line rounded px-3 py-2 text-xs focus:outline-none focus:border-signal"
                placeholder="e.g. rahul@meridiantextiles.in"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3.5 py-1.5 border border-line hover:border-signal text-mute hover:text-ink text-xs font-mono rounded-md"
            >
              Cancel
            </button>
            <button className="px-4 py-1.5 bg-signal text-canvas text-xs font-medium rounded-md hover:opacity-90">
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-line mb-6 text-xs font-mono">
        <button
          onClick={() => setTab("pipeline")}
          className={`pb-3 transition-colors relative ${
            tab === "pipeline" ? "text-signal glow-text-signal font-semibold" : "text-mute hover:text-ink"
          }`}
        >
          Deals Pipeline ({opportunities.length})
          {tab === "pipeline" && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-signal" />}
        </button>
        <button
          onClick={() => setTab("contacts")}
          className={`pb-3 transition-colors relative ${
            tab === "contacts" ? "text-signal glow-text-signal font-semibold" : "text-mute hover:text-ink"
          }`}
        >
          Customer Directory ({contacts.length})
          {tab === "contacts" && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-signal" />}
        </button>
      </div>

      {/* Content */}
      {tab === "pipeline" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const list = opportunities.filter((o) => o.stage === stage);
            return (
              <div key={stage} className="border border-line bg-panel/30 rounded-lg p-3 min-w-[200px] flex flex-col h-full min-h-[500px]">
                <div className="flex justify-between items-center mb-3">
                  <div className={`px-2 py-0.5 border rounded text-[9px] font-mono tracking-wider ${STAGE_COLORS[stage]}`}>
                    {stage}
                  </div>
                  <span className="text-[10px] text-mute font-mono">{list.length}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-0.5">
                  {list.map((o) => (
                    <div
                      key={o.id}
                      className="glass-panel rounded-lg p-3.5 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <div className="text-xs font-medium text-ink/90 leading-tight mb-1 truncate">{o.title}</div>
                      
                      <div className="flex items-center gap-1 text-[10px] text-mute mb-2">
                        <Users className="w-3 h-3 text-mute shrink-0" />
                        <span className="truncate">{o.contact?.name}</span>
                      </div>

                      {o.score !== undefined && o.score !== null && (
                        <div className="mb-3">
                          <div className="flex justify-between text-[9px] font-mono text-mute mb-1">
                            <span>AI Readiness Score</span>
                            <span className={o.score >= 80 ? "text-signal" : "text-mute"}>{o.score}%</span>
                          </div>
                          <div className="w-full bg-canvas border border-line rounded-full h-1.5 overflow-hidden">
                            <div
                              style={{ width: `${o.score}%` }}
                              className={`h-full rounded-full ${o.score >= 80 ? "bg-signal" : "bg-mute"}`}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-signal border-t border-line/40 pt-2 mb-2">
                        <span>₹{o.value.toLocaleString("en-IN")}</span>
                      </div>

                      {o.nextBestAction && (
                        <div className="text-[10px] leading-relaxed text-amber border-t border-line/40 pt-2 mt-2 font-mono flex gap-1 items-start">
                          <Sparkles className="w-3.5 h-3.5 text-amber shrink-0 mt-0.5" />
                          <span>
                            <strong>NBA:</strong> {o.nextBestAction}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {list.length === 0 && (
                    <div className="border border-dashed border-line/60 rounded-lg py-12 text-center text-mute text-[10px] font-mono">
                      No deals here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-lg divide-y divide-line/45">
          {filteredContacts.length === 0 ? (
            <p className="p-8 text-center text-mute text-xs font-mono">No contacts found.</p>
          ) : (
            filteredContacts.map((c) => (
              <div key={c.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-panel/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-signal/20 bg-signal/5 flex items-center justify-center font-mono text-xs font-bold text-signal">
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-ink">{c.name}</h3>
                    {c.company && (
                      <p className="text-[10px] text-mute flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-mute shrink-0" />
                        <span>{c.company}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-mute">
                  {c.phone && (
                    <span className="flex items-center gap-1 bg-canvas border border-line px-2.5 py-1 rounded">
                      <Phone className="w-3 h-3 text-mute" />
                      {c.phone}
                    </span>
                  )}
                  {c.email && (
                    <span className="flex items-center gap-1 bg-canvas border border-line px-2.5 py-1 rounded">
                      <Mail className="w-3 h-3 text-mute" />
                      {c.email}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}

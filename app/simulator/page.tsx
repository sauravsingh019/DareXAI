"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Mail, Phone, Play, Terminal, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

export default function SimulatorPage() {
  const [tenantName, setTenantName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [logs, setLogs] = useState<string>("System online. Click any action card to simulate transaction events.");
  const [loading, setLoading] = useState(false);

  // WhatsApp fields
  const [waName, setWaName] = useState("Rahul Sharma");
  const [waPhone, setWaPhone] = useState("+919876543210");
  const [waText, setWaText] = useState("Hi, do you have updated rates for the bulk fabric order?");

  // Email fields
  const [emailName, setEmailName] = useState("Priya Nair");
  const [emailAddr, setEmailAddr] = useState("priya@coastalcrafts.in");
  const [emailText, setEmailText] = useState("We need to reschedule our meeting to Tuesday at 10 AM, hope that works.");

  // Call fields
  const [callName, setCallName] = useState("Vikram Patel");
  const [callPhone, setCallPhone] = useState("+919822334455");
  const [callText, setCallText] = useState("Spoke with client about Q3 contract renewal. They requested the updated draft by Friday.");

  // Lead fields
  const [leadName, setLeadName] = useState("Amit Gupta");
  const [leadPhone, setLeadPhone] = useState("+919988776655");
  const [leadCompany, setLeadCompany] = useState("Gupta Tech Solutions");
  const [leadInterest, setLeadInterest] = useState("Interested in purchasing 10,000 units of custom widgets, ready to move forward ASAP if pricing fits.");

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((r) => r.json())
      .then((data) => {
        setTenantName(data.tenantName);
        setTenantSlug(data.slug || data.tenantSlug);
      })
      .catch(() => {});
  }, []);

  async function triggerWhatsApp() {
    setLoading(true);
    setLogs("Simulating inbound WhatsApp webhook payload...");
    try {
      const res = await fetch("/api/inbox/webhook/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug,
          from: waPhone,
          name: waName,
          text: waText,
        }),
      });
      const data = await res.json();
      setLogs(JSON.stringify({ status: res.status, ok: res.ok, response: data }, null, 2));
    } catch (e) {
      setLogs(`Simulation failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  async function triggerEmail() {
    setLoading(true);
    setLogs("Ingesting simulated inbound Email transaction...");
    try {
      const res = await fetch("/api/simulator/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "EMAIL",
          contactName: emailName,
          contactEmail: emailAddr,
          messageText: emailText,
        }),
      });
      const data = await res.json();
      setLogs(JSON.stringify({ status: res.status, ok: res.ok, response: data }, null, 2));
    } catch (e) {
      setLogs(`Simulation failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  async function triggerCall() {
    setLoading(true);
    setLogs("Ingesting simulated Call Log timeline transaction...");
    try {
      const res = await fetch("/api/simulator/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "CALL",
          contactName: callName,
          contactPhone: callPhone,
          messageText: callText,
        }),
      });
      const data = await res.json();
      setLogs(JSON.stringify({ status: res.status, ok: res.ok, response: data }, null, 2));
    } catch (e) {
      setLogs(`Simulation failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  async function triggerLeadWorkflow() {
    setLoading(true);
    setLogs("Executing full Sales Lead Automation flow (Qualification → WhatsApp -> Task -> Audit Logs)...");
    try {
      const res = await fetch("/api/workflow/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          company: leadCompany,
          interest: leadInterest,
        }),
      });
      const data = await res.json();
      setLogs(JSON.stringify({ status: res.status, ok: res.ok, response: data }, null, 2));
    } catch (e) {
      setLogs(`Simulation failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink">
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">Operations Simulator</h1>
          <p className="text-mute text-xs">
            Trigger simulated actions for <strong className="text-signal">{tenantName || "your business"}</strong> (Slug: <span className="text-signal font-mono text-[10px]">{tenantSlug || "loading..."}</span>).
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 border border-line bg-panel rounded-full text-[10px] font-mono text-mute">
          <Terminal className="w-3.5 h-3.5 text-mute" />
          <span>DECK ACTIVE</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* WhatsApp Webhook Simulation */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-signal" />
            WhatsApp Webhook
          </h2>
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-mute text-[10px] mb-1">Sender Name</label>
                <input
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
              <div>
                <label className="block text-mute text-[10px] mb-1">Phone Number</label>
                <input
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
            </div>
            <div>
              <label className="block text-mute text-[10px] mb-1">Message Text</label>
              <textarea
                value={waText}
                onChange={(e) => setWaText(e.target.value)}
                rows={2}
                className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal resize-none"
              />
            </div>
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setWaText("Hi! I wanted to check the status of my order, it hasn't arrived.")}
                className="px-2 py-1 bg-canvas border border-line rounded text-[9px] text-mute hover:text-ink font-mono"
              >
                Complaint
              </button>
              <button
                onClick={() => setWaText("Amazing service! The widgets are perfect. Thanks a ton!")}
                className="px-2 py-1 bg-canvas border border-line rounded text-[9px] text-mute hover:text-ink font-mono"
              >
                Positive
              </button>
            </div>
            <button
              onClick={triggerWhatsApp}
              disabled={loading}
              className="w-full py-2 bg-signal text-canvas font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1 text-[11px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate WhatsApp Webhook</span>
            </button>
          </div>
        </div>

        {/* Email Simulator */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-sky-400 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-sky-400" />
            Email Ingestion
          </h2>
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-mute text-[10px] mb-1">Sender Name</label>
                <input
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
              <div>
                <label className="block text-mute text-[10px] mb-1">Email Address</label>
                <input
                  value={emailAddr}
                  onChange={(e) => setEmailAddr(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
            </div>
            <div>
              <label className="block text-mute text-[10px] mb-1">Email Body</label>
              <textarea
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                rows={2}
                className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal resize-none"
              />
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              <button
                onClick={() => {
                  setEmailName("Rahul Sharma");
                  setEmailAddr("rahul@meridiantextiles.in");
                  setEmailText("Do you offer bulk volume discounts for ordering over 500 meters of linen fabric?");
                }}
                className="px-2 py-1 bg-canvas border border-line rounded text-[9px] text-mute hover:text-ink font-mono"
              >
                Textiles Quote
              </button>
              <button
                onClick={() => {
                  setEmailName("Amit Gupta");
                  setEmailAddr("amit@guptatech.in");
                  setEmailText("Looking for pricing on the API keys for our 10,000 units widget SaaS integration.");
                }}
                className="px-2 py-1 bg-canvas border border-line rounded text-[9px] text-mute hover:text-ink font-mono"
              >
                SaaS Proposal
              </button>
              <button
                onClick={() => {
                  setEmailName("Priya Nair");
                  setEmailAddr("priya@coastalcrafts.in");
                  setEmailText("Hey, the link to pay the invoice is returning a 502 Bad Gateway. Please check.");
                }}
                className="px-2 py-1 bg-canvas border border-line rounded text-[9px] text-mute hover:text-ink font-mono"
              >
                Billing Issue
              </button>
            </div>
            <button
              onClick={triggerEmail}
              disabled={loading}
              className="w-full py-2 bg-signal text-canvas font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1 text-[11px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Email Inbound</span>
            </button>
          </div>
        </div>

        {/* Call Simulator */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-amber-400 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-amber-400" />
            Call Log Ingestion
          </h2>
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-mute text-[10px] mb-1">Contact Name</label>
                <input
                  value={callName}
                  onChange={(e) => setCallName(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
              <div>
                <label className="block text-mute text-[10px] mb-1">Phone Number</label>
                <input
                  value={callPhone}
                  onChange={(e) => setCallPhone(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
            </div>
            <div>
              <label className="block text-mute text-[10px] mb-1">Call Logs Notes</label>
              <textarea
                value={callText}
                onChange={(e) => setCallText(e.target.value)}
                rows={2}
                className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal resize-none"
              />
            </div>
            <button
              onClick={triggerCall}
              disabled={loading}
              className="w-full py-2 bg-signal text-canvas font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1 text-[11px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Call Log Ingest</span>
            </button>
          </div>
        </div>

        {/* Lead Qualification Workflow Simulator */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-purple-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Lead Qualification Workflow
          </h2>
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-mute text-[10px] mb-1">Lead Name</label>
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
              <div>
                <label className="block text-mute text-[10px] mb-1">Phone</label>
                <input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-mute text-[10px] mb-1">Company</label>
                <input
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
              <div>
                <label className="block text-mute text-[10px] mb-1">Lead Interest Notes</label>
                <textarea
                  value={leadInterest}
                  onChange={(e) => setLeadInterest(e.target.value)}
                  rows={2}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => {
                  setLeadName("Amit Gupta");
                  setLeadCompany("Gupta Tech Solutions");
                  setLeadInterest("Interested in purchasing 10,000 units of custom widgets, ready to move forward ASAP if pricing fits.");
                }}
                className="px-2 py-1 bg-canvas border border-line rounded text-[9px] text-mute hover:text-ink font-mono"
              >
                Hot Lead (Score &gt; 80)
              </button>
              <button
                onClick={() => {
                  setLeadName("Rohan Verma");
                  setLeadCompany("Verma Crafts");
                  setLeadInterest("Just browsing around, wanted to see if you ship to Goa. No hurry.");
                }}
                className="px-2 py-1 bg-canvas border border-line rounded text-[9px] text-mute hover:text-ink font-mono"
              >
                Cold Lead (Score &lt; 80)
              </button>
            </div>
            <button
              onClick={triggerLeadWorkflow}
              disabled={loading}
              className="w-full py-2 bg-signal text-canvas font-medium rounded hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1 text-[11px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Sales Workflow Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Logs Terminal Panel */}
      <div className="glass-panel rounded-lg p-5 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[10px] font-mono text-signal uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Output Terminal</span>
          </h2>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-signal/40" />
          </div>
        </div>
        <pre className="bg-[#040605] border border-line/60 p-4 rounded-md text-[11px] font-mono text-signal/90 overflow-x-auto whitespace-pre-wrap max-h-96 glow-text-signal shadow-inner leading-relaxed">
          {logs}
        </pre>
      </div>
    </main>
  );
}

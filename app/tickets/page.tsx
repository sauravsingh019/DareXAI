"use client";

import { useState } from "react";

interface Ticket {
  id: string;
  name: string;
  company: string;
  subject: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "RESOLVED";
  created: string;
  complaint: string;
  resolution: string;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "T-8921",
    name: "Priya Nair",
    company: "Coastal Crafts",
    subject: "Linen shipment delayed hub 4",
    priority: "HIGH",
    status: "OPEN",
    created: "Today, 10:45 AM",
    complaint: "Hi, our shipment was supposed to arrive yesterday morning, but the tracker is showing it hasn't even left the warehouse. This is holding up our operations!",
    resolution: "Dear Priya,\n\nI sincerely apologize for the delay. I have looked up your shipment (tracking ID: #TRK-89211) and it was temporarily held at warehouse hub 4 due to routing errors. I have authorized priority courier dispatch and the package is scheduled to arrive at your site by tomorrow morning.\n\nBest regards,\nOperations Desk",
  },
  {
    id: "T-8922",
    name: "Vikram Patel",
    company: "Patel Exports",
    subject: "Invoice payment link 502 error",
    priority: "MEDIUM",
    status: "OPEN",
    created: "Yesterday",
    complaint: "Hey, the link to pay the invoice is returning a 502 Bad Gateway. Please check.",
    resolution: "Dear Vikram,\n\nThank you for flagging this. Our billing gateway provider experienced a brief gateway outage yesterday. We have refreshed the transaction token. You can access the updated secure invoice link in your DareXAI CRM console under Opportunities. Let us know if you face any issues.\n\nBest regards,\nBilling Support Desk",
  },
  {
    id: "T-8920",
    name: "Amit Gupta",
    company: "Gupta Tech Solutions",
    subject: "Pricing query regarding widget volume discount",
    priority: "LOW",
    status: "RESOLVED",
    created: "2 days ago",
    complaint: "Do you offer bulk volume discounts for ordering over 500 meters of linen fabric?",
    resolution: "Dear Amit,\n\nYes! Bulk discounts of 10% are applied automatically for custom weaves exceeding 500 meters. The price grid has been synchronized directly to your CRM timeline.\n\nBest regards,\nOnboarding Desk",
  },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(INITIAL_TICKETS[0]);
  const [resolving, setResolving] = useState(false);
  const [feedback, setFeedback] = useState("");

  function resolveTicket(id: string) {
    setResolving(true);
    setFeedback("");
    
    setTimeout(() => {
      setResolving(false);
      setTickets(tickets.map((t) => (t.id === id ? { ...t, status: "RESOLVED" as const } : t)));
      
      // Update local state copy
      setSelectedTicket((curr) => curr ? { ...curr, status: "RESOLVED" as const } : null);
      setFeedback("Ticket resolved and notification dispatched.");
      setTimeout(() => setFeedback(""), 2000);
    }, 850);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">Support Helpdesk</h1>
          <p className="text-mute text-xs">Flag negative customer communications and resolve issues with AI replies.</p>
        </div>
        <div className="flex items-center gap-3">
          {feedback && (
            <span className="text-[10px] font-mono border border-signal/20 bg-signal/5 px-3 py-1 rounded-full text-signal animate-fade-in">
              {feedback}
            </span>
          )}
          <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute">
            OPEN TICKETS: {tickets.filter(t=>t.status === "OPEN").length}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Left: Tickets Table */}
        <div className="md:col-span-2 glass-panel rounded-lg overflow-hidden flex flex-col max-h-[600px] h-fit">
          <div className="overflow-y-auto divide-y divide-line/40">
            {tickets.length === 0 ? (
              <p className="p-6 text-center text-mute text-xs font-mono">No support tickets found.</p>
            ) : (
              tickets.map((t) => {
                const isActive = selectedTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left px-5 py-4 hover:bg-panel/30 transition-colors flex items-center justify-between text-xs ${
                      isActive ? "bg-panel border-l-2 border-signal pl-4.5" : ""
                    }`}
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-[10px] text-mute">#{t.id}</span>
                        <span className="font-semibold text-ink truncate">{t.subject}</span>
                      </div>
                      <span className="text-[10px] text-mute truncate block mt-1">{t.name} · {t.company}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-mono ${
                        t.priority === "HIGH" ? "text-red-400 border-red-950/20 bg-red-950/5" :
                        t.priority === "MEDIUM" ? "text-amber-400 border-amber-950/20 bg-amber-950/5" :
                        "text-mute border-line bg-panel"
                      }`}>
                        {t.priority}
                      </span>
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-mono ${
                        t.status === "OPEN" ? "text-signal border-signal/20 bg-signal/5" : "text-mute border-line bg-panel"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Ticket Inspector & AI Resolver */}
        <div className="glass-panel rounded-lg p-5 flex flex-col h-full max-h-[600px]">
          {selectedTicket ? (
            <div className="flex-1 flex flex-col overflow-hidden text-xs space-y-4">
              <div>
                <span className="text-[10px] text-mute block font-mono">TICKET DETAILS</span>
                <span className="text-xs font-bold text-ink block mt-0.5">#{selectedTicket.id} · {selectedTicket.subject}</span>
                <span className="text-[10px] text-mute mt-0.5 block">{selectedTicket.name} · {selectedTicket.company}</span>
              </div>

              <div>
                <span className="text-[10px] text-mute block font-mono mb-1">CUSTOMER COMPLAINT</span>
                <p className="bg-[#040605] border border-line/40 p-3 rounded text-[11px] leading-relaxed text-ink/80">
                  {selectedTicket.complaint}
                </p>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-signal block font-mono font-bold">✨ AI DRAFT RESOLUTION REPLY</span>
                  <span className="text-[9px] text-mute font-mono">EDITABLE</span>
                </div>
                <textarea
                  readOnly={selectedTicket.status === "RESOLVED"}
                  defaultValue={selectedTicket.resolution}
                  rows={4}
                  className="flex-1 w-full bg-[#040605] border border-line/60 p-3 rounded text-[11px] font-mono text-signal/90 leading-relaxed resize-none focus:outline-none focus:border-signal"
                />
              </div>

              {selectedTicket.status === "OPEN" ? (
                <button
                  onClick={() => resolveTicket(selectedTicket.id)}
                  disabled={resolving}
                  className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity text-xs"
                >
                  {resolving ? "Transmitting resolution parameters..." : "Resolve with AI Response"}
                </button>
              ) : (
                <div className="py-2 border border-line bg-panel/30 text-mute text-center font-mono text-[10px] rounded">
                  ✓ Ticket resolved & notification sent.
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-mute text-xs font-mono p-6">
              Select a customer ticket to inspect details and AI resolutions.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Sparkles, Send, Phone, Mail, Clock, Shield, Activity, HelpCircle } from "lucide-react";

interface Message {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  channel: "WHATSAPP" | "EMAIL" | "CALL";
  summary?: string;
  sentiment?: string; // positive | neutral | negative
  intent?: string;
  nextAction?: string;
  contact?: { name: string; phone?: string; email?: string };
  messages: Message[];
}

const CHANNEL_ICON: Record<string, React.ReactNode> = {
  WHATSAPP: <MessageSquare className="w-3.5 h-3.5 text-signal" />,
  EMAIL: <Mail className="w-3.5 h-3.5 text-sky-400" />,
  CALL: <Phone className="w-3.5 h-3.5 text-amber-400" />,
};

const SENTIMENT_STYLE: Record<string, string> = {
  positive: "text-signal border-signal/20 bg-signal/15",
  neutral: "text-mute border-line bg-panel",
  negative: "text-red-400 border-red-950/30 bg-red-950/20",
};

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function load(selectId?: string) {
    const res = await fetch("/api/inbox/conversations");
    const d = await res.json();
    const list = d.conversations || [];
    setConversations(list);

    if (list.length > 0) {
      const activeId = selectId || selected?.id || list[0].id;
      const found = list.find((c: Conversation) => c.id === activeId);
      setSelected(found || list[0]);
    } else {
      setSelected(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function suggestReply() {
    if (!selected || generating) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/inbox/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selected.id, action: "suggest" }),
      });
      if (res.ok) {
        const data = await res.json();
        setReplyText(data.suggestion || "");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  async function sendReply() {
    if (!selected || sending || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/inbox/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selected.id,
          text: replyText,
          action: "send",
        }),
      });
      if (res.ok) {
        setReplyText("");
        await load(selected.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="flex h-screen bg-transparent text-ink">
      {/* Sidebar List */}
      <div className="w-80 border-r border-line overflow-y-auto flex flex-col bg-panel/10 shrink-0">
        <div className="px-5 py-4 border-b border-line flex justify-between items-center bg-panel/30">
          <h1 className="text-sm font-semibold tracking-tight">Unified Inbox</h1>
          <span className="text-[10px] font-mono border border-line bg-panel px-2.5 py-0.5 rounded text-mute">
            LIVE FEED
          </span>
        </div>
        {conversations.length === 0 ? (
          <p className="text-mute text-xs px-5 py-6 leading-relaxed font-mono">
            No active timelines logged. Simulator inputs will appear here.
          </p>
        ) : (
          <div className="flex-1 divide-y divide-line/40">
            {conversations.map((c) => {
              const isActive = selected?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelected(c);
                    setReplyText("");
                  }}
                  className={`w-full text-left px-5 py-4 hover:bg-panel/30 transition-all flex gap-3 items-start ${
                    isActive ? "bg-panel border-r-2 border-signal" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-full border border-line bg-canvas/60 flex items-center justify-center font-mono text-xs font-bold text-mute shrink-0">
                    {c.contact?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-medium text-ink truncate">{c.contact?.name || "Unknown Customer"}</span>
                      <span className="shrink-0">{CHANNEL_ICON[c.channel]}</span>
                    </div>
                    <p className="text-[10px] text-mute truncate mt-1 leading-normal">
                      {c.summary || "Pending AI compilation..."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Conversation Pane */}
      <div className="flex-1 flex flex-col bg-canvas">
        {selected ? (
          <>
            {/* Conversation Header */}
            <div className="px-8 py-4 border-b border-line flex justify-between items-center bg-panel/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-signal/20 bg-signal/5 flex items-center justify-center font-mono text-xs font-bold text-signal">
                  {selected.contact?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h2 className="font-semibold text-xs leading-normal">{selected.contact?.name}</h2>
                  <p className="text-[10px] text-mute font-mono tracking-tighter mt-0.5">
                    {selected.channel === "EMAIL" ? selected.contact?.email : selected.contact?.phone}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-mono capitalize ${SENTIMENT_STYLE[selected.sentiment || "neutral"]}`}>
                  {selected.sentiment || "neutral"}
                </span>
                <span className="text-mute border border-line bg-panel/50 px-2 py-0.5 rounded-full text-[9px] font-mono">
                  intent: {selected.intent || "unknown"}
                </span>
              </div>
            </div>

            {/* AI Next Best Action alert bar */}
            {selected.nextAction && (
              <div className="mx-8 mt-4 text-[10px] text-amber border border-amber/30 bg-amber/5 rounded px-3 py-2.5 font-mono flex items-start gap-1.5 leading-relaxed">
                <Sparkles className="w-3.5 h-3.5 text-amber shrink-0 mt-0.5" />
                <span>
                  <strong>AI Recommended Next Action:</strong> {selected.nextAction}
                </span>
              </div>
            )}

            {/* Conversation Messages Timeline */}
            <div className="flex-1 overflow-y-auto px-8 py-5 space-y-4">
              {selected.messages.map((m) => {
                const isOut = m.direction === "OUTBOUND";
                return (
                  <div key={m.id} className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-2 max-w-md ${isOut ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold shrink-0 ${
                        isOut ? "bg-signal/15 border-signal/30 text-signal" : "bg-panel border-line text-mute"
                      }`}>
                        {isOut ? "B" : "C"}
                      </div>
                      <div
                        className={`rounded-lg px-3.5 py-2 text-xs leading-relaxed ${
                          isOut
                            ? "bg-signal text-canvas font-medium"
                            : "bg-panel border border-line text-ink"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Composer Panel */}
            <div className="px-8 py-4 border-t border-line bg-panel/30">
              <div className="flex flex-col gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selected.contact?.name || "customer"}...`}
                  rows={2}
                  className="w-full bg-canvas border border-line rounded-md px-3.5 py-2.5 text-xs focus:outline-none focus:border-signal text-ink placeholder-mute resize-none"
                  disabled={sending || generating}
                />
                <div className="flex justify-between items-center">
                  <button
                    onClick={suggestReply}
                    disabled={sending || generating}
                    className="px-3.5 py-1.5 border border-signal/30 text-signal bg-signal/5 hover:bg-signal/10 rounded-md text-[10px] font-mono disabled:opacity-50 transition-colors flex items-center gap-1.5"
                  >
                    {generating ? "✨ Suggesting..." : "✨ AI Suggest Reply"}
                  </button>
                  <button
                    onClick={sendReply}
                    disabled={sending || generating || !replyText.trim()}
                    className="px-4 py-1.5 bg-signal text-canvas rounded-md text-[10px] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-mute text-center p-8 max-w-sm mx-auto">
            <HelpCircle className="w-8 h-8 text-mute/50 mb-3" />
            <h3 className="text-xs font-semibold text-ink">No conversation selected</h3>
            <p className="text-[10px] text-mute leading-relaxed mt-1">
              Select a conversation in the left pane to view timeline logs, sentiment analysis, and trigger replies.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useRef, useState } from "react";
import { Sparkles, Send, Terminal, Shield, MessageSquare, ArrowRight, Play } from "lucide-react";

interface ToolTrace {
  name: string;
  args: any;
  result?: any;
}

interface ChatTurn {
  role: "user" | "assistant";
  text: string;
  tools?: ToolTrace[];
}

const CheckCircleIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const SUGGESTIONS = [
  "Find Rahul in CRM",
  "Follow up with Rahul tomorrow",
  "Show current business metrics",
  "Update opportunity Bulk Fabric Order value to 500000",
];

export default function ChatPage() {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const conversationId = useRef<string | undefined>(undefined);
  const endRef = useRef<HTMLDivElement>(null);

  function scroll() {
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  async function send(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || streaming) return;
    setInput("");
    setStreaming(true);

    setTurns((t) => [...t, { role: "user", text }, { role: "assistant", text: "", tools: [] }]);
    scroll();

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: conversationId.current, message: text }),
    });

    if (!res.body) {
      setStreaming(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const evt of events) {
        const eventLine = evt.split("\n").find((l) => l.startsWith("event:"));
        const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
        if (!eventLine || !dataLine) continue;
        const eventType = eventLine.replace("event:", "").trim();
        const data = JSON.parse(dataLine.replace("data:", "").trim());

        if (eventType === "conversation") {
          conversationId.current = data.conversationId;
        } else if (eventType === "tool_call") {
          setTurns((t) => {
            const copy = [...t];
            const last = copy[copy.length - 1];
            last.tools = [...(last.tools || []), { name: data.name, args: data.args }];
            return copy;
          });
          scroll();
        } else if (eventType === "tool_result") {
          setTurns((t) => {
            const copy = [...t];
            const last = copy[copy.length - 1];
            last.tools = (last.tools || []).map((tr) =>
              tr.name === data.name && tr.result === undefined ? { ...tr, result: data.result } : tr
            );
            return copy;
          });
          scroll();
        } else if (eventType === "token") {
          setTurns((t) => {
            const copy = [...t];
            copy[copy.length - 1].text += data;
            return copy;
          });
          scroll();
        } else if (eventType === "error") {
          setTurns((t) => {
            const copy = [...t];
            copy[copy.length - 1].text = `⚠ ${data.message}`;
            return copy;
          });
          scroll();
        }
      }
    }

    setStreaming(false);
  }

  return (
    <main className="flex flex-col h-screen bg-transparent text-ink">
      {/* Header with terminal status */}
      <div className="px-8 py-5 border-b border-line flex justify-between items-center bg-panel/30">
        <div>
          <h1 className="text-sm font-semibold tracking-tight">AI Assistant Console</h1>
          <p className="text-mute text-xs mt-0.5">Operate your business using natural language commands.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 border border-signal/20 bg-signal/5 rounded-full text-[10px] font-mono text-signal">
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-ping" />
            <span>AGENT ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 border border-line bg-panel rounded-full text-[10px] font-mono text-mute">
            <Shield className="w-3 h-3 text-mute" />
            <span>SECURE SANDBOX</span>
          </div>
        </div>
      </div>

      {/* Chat Timeline */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scroll-smooth">
        {turns.length === 0 ? (
          <div className="max-w-2xl mx-auto py-12 text-center">
            <div className="inline-block p-3 border border-signal/20 bg-signal/5 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-signal" />
            </div>
            <h2 className="text-sm font-medium mb-1">Welcome to the AI Assistant</h2>
            <p className="text-xs text-mute mb-8 max-w-sm mx-auto leading-relaxed">
              Ask the assistant to find contacts, update opportunities, send WhatsApp follow-ups, or check metrics.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => send(s)}
                  disabled={streaming}
                  className="p-3.5 border border-line bg-panel/30 hover:border-signal/30 hover:bg-panel rounded-lg text-xs transition-all flex justify-between items-center group disabled:opacity-50"
                >
                  <span className="text-mute group-hover:text-ink font-mono pr-4 truncate">{s}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-mute group-hover:text-signal shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {turns.map((turn, i) => (
              <div key={i} className={`flex flex-col ${turn.role === "user" ? "items-end" : "items-start"}`}>
                {/* Tool calls execution trail */}
                {turn.tools && turn.tools.length > 0 && (
                  <div className="mb-3 space-y-1.5 w-full max-w-xl">
                    <div className="text-[10px] text-mute font-mono uppercase tracking-wider pl-1 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-signal" />
                      <span>Execution Trace Log</span>
                    </div>
                    {turn.tools.map((tr, j) => (
                      <div
                        key={j}
                        className="border border-line bg-panel/50 rounded px-3 py-2 text-[11px] font-mono leading-relaxed"
                      >
                        <div className="flex items-center justify-between text-signal">
                          <span className="flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 rotate-90 shrink-0 fill-current" />
                            tool: {tr.name}()
                          </span>
                          {tr.result !== undefined ? (
                            <span className="text-signal flex items-center gap-1 text-[10px]">
                              <CheckCircleIcon className="w-3 h-3 shrink-0" />
                              success
                            </span>
                          ) : (
                            <span className="text-mute animate-pulse">executing…</span>
                          )}
                        </div>
                        <div className="text-mute/80 mt-1 text-[10px] pl-3.5">
                          args: {JSON.stringify(tr.args)}
                        </div>
                        {tr.result && (
                          <div className="text-mute/70 mt-1 text-[9px] bg-canvas/30 p-1.5 rounded pl-3.5 border-l border-line max-h-24 overflow-y-auto">
                            result: {JSON.stringify(tr.result)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actual dialogue bubble */}
                <div className={`flex gap-3 max-w-[85%] ${turn.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`p-2 rounded-full border shrink-0 h-8 w-8 flex items-center justify-center text-xs ${
                    turn.role === "user" ? "bg-signal/15 border-signal/30 text-signal" : "bg-panel border-line text-mute"
                  }`}>
                    {turn.role === "user" ? "U" : <Sparkles className="w-3.5 h-3.5 text-signal" />}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-3 text-xs leading-relaxed ${
                      turn.role === "user"
                        ? "bg-signal text-canvas font-medium shadow-md shadow-signal/5"
                        : "glass-panel text-ink"
                    }`}
                  >
                    {turn.text || (turn.role === "assistant" && streaming ? (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-signal">
                        <span className="animate-pulse">Analyzing context & response streaming…</span>
                      </span>
                    ) : "")}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input panel with suggestions */}
      <div className="px-8 py-5 border-t border-line bg-panel/30">
        <div className="max-w-3xl mx-auto">
          {/* Quick suggestions when conversation is active */}
          {turns.length > 0 && !streaming && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 pr-4 no-scrollbar">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => send(s)}
                  className="px-3 py-1 border border-line bg-canvas/40 hover:border-signal/30 hover:bg-panel rounded-full text-[10px] text-mute hover:text-ink font-mono shrink-0 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={streaming ? "Streaming agent response..." : "Instruct your AI agent..."}
                disabled={streaming}
                className="w-full bg-canvas border border-line rounded-lg pl-4 pr-12 py-3 text-xs focus:outline-none focus:border-signal text-ink placeholder-mute disabled:opacity-50"
              />
              <div className="absolute right-3.5 top-3 flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-mute bg-panel px-1.5 py-0.5 rounded border border-line">Enter</span>
              </div>
            </div>
            <button
              onClick={() => send()}
              disabled={streaming || !input.trim()}
              className="p-3 bg-signal text-canvas font-medium rounded-lg disabled:opacity-50 transition-opacity hover:opacity-90 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

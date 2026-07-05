"use client";

import { useState } from "react";

export default function WidgetPage() {
  const [title, setTitle] = useState("DareX Assistant");
  const [greeting, setGreeting] = useState("Hi! We offer custom B2B fulfillment. How can I help you today?");
  const [themeColor, setThemeColor] = useState("#7ef29c"); // Default Neon Green
  
  // Chat Widget Simulation States
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");

  const COLORS = [
    { name: "Neon Green", hex: "#7ef29c" },
    { name: "Cyber Blue", hex: "#009DDC" },
    { name: "Amber Gold", hex: "#F9B21D" },
  ];

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages((prev) => [...prev, { sender: "user" as const, text: userMsg }]);
    setInputValue("");

    // Simulate AI response based on custom configs
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot" as const,
          text: `[${title}]: Understood. I can compile custom volume discounts for you. Let me log your requirement in the CRM desk.`,
        },
      ]);
    }, 850);
  }

  function resetChat() {
    setMessages([]);
    setIsOpen(false);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">Web Chat Widget</h1>
          <p className="text-mute text-xs">Configure, style, and generate code to embed a floating AI Chatbot on your website.</p>
        </div>
        <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute font-bold">
          WIDGET BUILDER V1.0
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Left: Configuration Form & Code */}
        <div className="space-y-6">
          <div className="glass-panel rounded-lg p-5 space-y-4">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-signal border-b border-line/35 pb-2">
              Widget Style & Text
            </h2>
            <div className="text-xs space-y-3.5">
              <div>
                <label className="block text-mute mb-1">Widget Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal"
                />
              </div>
              <div>
                <label className="block text-mute mb-1">Welcome Greeting Message</label>
                <textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  rows={2}
                  className="w-full bg-canvas border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-signal resize-none leading-normal"
                />
              </div>
              <div>
                <label className="block text-mute mb-1.5">Theme Accent Color</label>
                <div className="flex gap-2 font-mono text-[9px]">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => { setThemeColor(c.hex); resetChat(); }}
                      style={{ borderColor: themeColor === c.hex ? themeColor : "" }}
                      className={`px-2 py-1.5 border rounded uppercase ${
                        themeColor === c.hex ? "bg-panel/40 font-bold" : "text-mute border-line hover:text-ink"
                      }`}
                    >
                      <span
                        style={{ backgroundColor: c.hex }}
                        className="inline-block w-2 h-2 rounded-full mr-1.5"
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Embed Code widget */}
          <div className="glass-panel rounded-lg p-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-signal mb-2">
              Embed Installation Code
            </h2>
            <p className="text-[10px] text-mute mb-3">Copy this snippet to embed the customized chat widget onto your website.</p>
            <pre className="bg-[#040605] border border-line/60 p-3 rounded-md text-[9px] font-mono text-signal/85 overflow-auto select-all leading-normal">
{`<script 
  src="https://cdn.darexai.com/widget.js" 
  data-title="${title}"
  data-theme="${themeColor}"
  data-tenant-id="dx_tenant_829b"
></script>`}
            </pre>
          </div>
        </div>

        {/* Right: Live Interactive Mock Web Preview Container */}
        <div className="md:col-span-2 glass-panel rounded-lg overflow-hidden flex flex-col relative h-[500px] border-line/60">
          {/* Mock Browser Header */}
          <div className="bg-panel/50 px-4 py-2 border-b border-line flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
            <div className="bg-canvas border border-line/50 rounded px-3.5 py-0.5 text-[9px] font-mono text-mute ml-4 w-64 select-none">
              https://yourcompanywebsite.in
            </div>
          </div>

          {/* Mock Home Page content */}
          <div className="flex-1 p-8 bg-canvas flex flex-col justify-center items-center text-center select-none">
            <h3 className="text-sm font-bold text-ink mb-1.5">Your Enterprise Homepage Preview</h3>
            <p className="text-[10px] text-mute max-w-sm leading-relaxed mb-4">
              This panel simulates how your clients will interact with the DareXAI chatbot widget. Try clicking the chat widget in the corner!
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 border border-line rounded text-[9px] font-mono text-mute">CRM INTEGRATED</span>
              <span className="px-3 py-1 border border-line rounded text-[9px] font-mono text-mute">AI TRIGGER ACTIVE</span>
            </div>
          </div>

          {/* Floating Widget Bubble & Chat box */}
          <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end">
            
            {/* Expanded Chat Box */}
            {isOpen && (
              <div className="glass-panel w-72 h-80 rounded-xl overflow-hidden flex flex-col border-line/80 shadow-2xl mb-3 animate-in slide-in-from-bottom duration-200">
                {/* Chat Header styled dynamically with selected themeColor */}
                <div
                  style={{ backgroundColor: `${themeColor}12`, borderColor: `${themeColor}30` }}
                  className="px-4 py-3 border-b flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-ink">{title}</h4>
                    <span className="text-[9px] text-signal font-mono">AGENT ONLINE</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-mute hover:text-ink text-[10px] font-mono font-bold"
                  >
                    CLOSE
                  </button>
                </div>

                {/* Messages feed */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-[10px] flex flex-col">
                  {/* Default welcome message */}
                  <div className="bg-panel/30 border border-line p-2 rounded-r-md rounded-bl-md text-ink/90 leading-relaxed max-w-[85%] self-start">
                    {greeting}
                  </div>

                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-md leading-relaxed max-w-[85%] ${
                        m.sender === "user"
                          ? "bg-signal text-canvas self-end font-medium rounded-l-md rounded-br-md"
                          : "bg-panel/30 border border-line text-ink/90 self-start rounded-r-md rounded-bl-md"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleSend} className="p-2 border-t border-line/40 flex gap-1.5 bg-canvas">
                  <input
                    required
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-canvas border border-line rounded px-2.5 py-1 text-[10px] text-ink focus:outline-none focus:border-signal"
                  />
                  <button
                    style={{ backgroundColor: themeColor }}
                    className="px-3 py-1 text-canvas text-[10px] font-bold rounded hover:opacity-90"
                  >
                    SEND
                  </button>
                </form>
              </div>
            )}

            {/* Bubble Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{ backgroundColor: themeColor, boxShadow: `0 0 15px ${themeColor}40` }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-canvas hover:scale-105 transition-transform shrink-0"
            >
              {isOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 12-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              )}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}

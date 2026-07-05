"use client";

import { useState } from "react";

interface KeyRecord {
  id: string;
  name: string;
  key: string;
  status: "ACTIVE" | "REVOKED";
  created: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<KeyRecord[]>([
    { id: "1", name: "Default Inbound Webhook Key", key: "dx_live_38c9a3b9d0f28e1c5a7f9a2b", status: "ACTIVE", created: "Today, 10:21 AM" },
    { id: "2", name: "Zapier Lead Form Integration", key: "dx_live_8f0a2c3d5e7f9a1b3c5d7e9f", status: "ACTIVE", created: "Yesterday" },
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "python">("curl");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  function generateKey(e: React.FormEvent) {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    
    // Generate a secure looking mock token
    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const keyString = `dx_live_${randomHex}`;
    
    const newRecord: KeyRecord = {
      id: String(keys.length + 1),
      name: newKeyName,
      key: keyString,
      status: "ACTIVE",
      created: "Just now",
    };

    setKeys([newRecord, ...keys]);
    setGeneratedKey(keyString);
    setNewKeyName("");
  }

  function revokeKey(id: string) {
    setKeys(keys.map((k) => (k.id === id ? { ...k, status: "REVOKED" as const } : k)));
  }

  function handleCopy(text: string, index: string) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">Developer API Keys</h1>
          <p className="text-mute text-xs">Generate security tokens and configure inbound webhook connections.</p>
        </div>
        <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute">
          API VERSION: V1.0
        </span>
      </div>

      {/* Main Grid split */}
      <div className="grid md:grid-cols-3 gap-6 mb-6 items-start">
        {/* Left: API Keys Manager */}
        <div className="md:col-span-2 space-y-6">
          {/* Key Generator Form */}
          <div className="glass-panel rounded-lg p-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
              Create API Access Token
            </h2>
            <form onSubmit={generateKey} className="flex gap-3 text-xs">
              <input
                required
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Production Contact Form Key"
                className="flex-1 bg-canvas border border-line rounded px-3 py-2 text-xs focus:outline-none focus:border-signal text-ink placeholder-mute"
              />
              <button className="px-4 py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 transition-opacity">
                Generate Key
              </button>
            </form>

            {generatedKey && (
              <div className="mt-4 border border-amber/30 bg-amber/5 rounded p-3.5 text-xs font-mono">
                <span className="text-amber font-bold block mb-1">⚡ API Key Generated — Copy Now!</span>
                <p className="text-[10px] text-mute mb-2">
                  Write down this token. It represents a full security authorization credentials and will not be displayed again.
                </p>
                <div className="flex gap-2 items-center bg-canvas p-2 border border-line rounded">
                  <span className="text-signal truncate select-all">{generatedKey}</span>
                  <button
                    onClick={() => handleCopy(generatedKey, "newkey")}
                    className="ml-auto px-2 py-1 border border-line text-mute hover:text-ink text-[10px] rounded shrink-0 font-mono"
                  >
                    {copiedIndex === "newkey" ? "COPIED" : "COPY"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Keys table list */}
          <div className="glass-panel rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-panel/30">
              <span className="text-[10px] font-mono text-mute uppercase tracking-widest font-bold">Active API Credentials</span>
            </div>
            <div className="divide-y divide-line/45">
              {keys.map((record) => (
                <div key={record.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-ink block">{record.name}</span>
                    <span className="text-[10px] text-mute font-mono block">
                      Token: <span className="select-all text-signal">{record.key.slice(0, 12)}••••••••{record.key.slice(-4)}</span>
                    </span>
                    <span className="text-[9px] text-mute font-mono block">Created: {record.created}</span>
                  </div>
                  <div className="flex items-center gap-3.5 justify-end">
                    <span className={`px-2 py-0.5 border rounded text-[9px] font-mono ${
                      record.status === "ACTIVE" ? "text-signal border-signal/20 bg-signal/5" : "text-mute border-line bg-panel"
                    }`}>
                      {record.status}
                    </span>
                    {record.status === "ACTIVE" && (
                      <button
                        onClick={() => revokeKey(record.id)}
                        className="text-[10px] font-mono text-red-400 hover:underline"
                      >
                        REVOKE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: cURL Code Generator docs */}
        <div className="glass-panel rounded-lg p-5 max-h-[600px] flex flex-col">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-3 text-signal">
            Integration Webhook Guides
          </h2>
          <p className="text-[11px] text-mute leading-relaxed mb-4">
            Push incoming transactions into your operations inbox using our integration endpoints.
          </p>

          {/* Tab buttons */}
          <div className="flex gap-2 border-b border-line pb-2 mb-4 text-[10px] font-mono">
            {(["curl", "node", "python"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 border rounded uppercase ${
                  activeTab === tab ? "text-signal border-signal/30 bg-signal/5 font-semibold" : "text-mute border-line hover:text-ink"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Snippet box */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-mono text-mute">SAMPLE OUTBOUND POST</span>
              <button
                onClick={() => {
                  const snippets = {
                    curl: `curl -X POST http://localhost:3000/api/simulator/ingest \\\n  -H "Content-Type: application/json" \\\n  -H "X-API-Key: dx_live_38c9a3b..." \\\n  -d '{\n    "channel": "EMAIL",\n    "contactName": "Rahul Sharma",\n    "contactEmail": "rahul@meridiantextiles.in",\n    "messageText": "Hi, do you have rates for bulk linen order?"\n  }'`,
                    node: `fetch("http://localhost:3000/api/simulator/ingest", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "X-API-Key": "dx_live_38c9a3b..."\n  },\n  body: JSON.stringify({\n    channel: "EMAIL",\n    contactName: "Rahul Sharma",\n    messageText: "Inquiry about bulk linen rates."\n  })\n});`,
                    python: `import requests\n\nurl = "http://localhost:3000/api/simulator/ingest"\nheaders = {\n    "Content-Type": "application/json",\n    "X-API-Key": "dx_live_38c9a3b..."\n}\ndata = {\n    "channel": "EMAIL",\n    "contactName": "Rahul Sharma",\n    "messageText": "Inquiry about bulk linen rates."\n}\nres = requests.post(url, json=data, headers=headers)`,
                  };
                  handleCopy(snippets[activeTab], "snippet");
                }}
                className="text-[9px] font-mono text-signal hover:underline"
              >
                {copiedIndex === "snippet" ? "COPIED" : "COPY CODE"}
              </button>
            </div>
            
            <pre className="flex-1 bg-[#040605] border border-line/60 p-3.5 rounded-md text-[9px] font-mono text-signal/90 overflow-auto whitespace-pre glow-text-signal shadow-inner leading-normal max-h-[300px]">
              {activeTab === "curl" && (
                `curl -X POST http://localhost:3000/api/simulator/ingest \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: dx_live_38c9a3b..." \\
  -d '{
    "channel": "EMAIL",
    "contactName": "Rahul Sharma",
    "contactEmail": "rahul@meridiantextiles.in",
    "messageText": "Hi, do you have rates for bulk linen order?"
  }'`
              )}

              {activeTab === "node" && (
                `fetch("http://localhost:3000/api/simulator/ingest", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "dx_live_38c9a3b..."
  },
  body: JSON.stringify({
    channel: "EMAIL",
    contactName: "Rahul Sharma",
    messageText: "Inquiry about bulk linen rates."
  })
});`
              )}

              {activeTab === "python" && (
                `import requests

url = "http://localhost:3000/api/simulator/ingest"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "dx_live_38c9a3b..."
}
data = {
    "channel": "EMAIL",
    "contactName": "Rahul Sharma",
    "messageText": "Inquiry about bulk linen rates."
}
res = requests.post(url, json=data, headers=headers)`
              )}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

interface AuditLog {
  id: string;
  action: string;
  entity?: string | null;
  metadata?: any;
  createdAt: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs() {
    try {
      const res = await fetch("/api/logs");
      if (!res.ok) throw new Error("Failed to load trace logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1 flex flex-col">
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">AI Agent Trace Logs</h1>
          <p className="text-mute text-xs">Audit trails of operational transactions and tool calls.</p>
        </div>
        <button
          onClick={() => { setLoading(true); loadLogs(); }}
          className="px-3 py-1.5 border border-line hover:border-signal text-mute hover:text-ink text-xs font-mono rounded"
        >
          Refresh Logs
        </button>
      </div>

      {loading ? (
        <div className="text-mute text-xs font-mono animate-pulse">Fetching transaction trails...</div>
      ) : error ? (
        <div className="text-xs text-red-400 font-mono">⚠ Error: {error}</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 items-start flex-1 min-h-[500px]">
          {/* Logs List Table */}
          <div className="md:col-span-2 glass-panel rounded-lg overflow-hidden flex flex-col max-h-[600px]">
            <div className="overflow-y-auto divide-y divide-line/40">
              {logs.length === 0 ? (
                <p className="p-6 text-center text-mute text-xs font-mono">
                  No trace logs logged. Ingest an event in the Simulator to construct trails.
                </p>
              ) : (
                logs.map((log) => {
                  const isActive = selectedLog?.id === log.id;
                  return (
                    <button
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`w-full text-left px-5 py-3.5 hover:bg-panel/30 transition-colors flex items-center justify-between text-xs font-mono ${
                        isActive ? "bg-panel border-l-2 border-signal pl-4.5" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-signal font-bold truncate block">{log.action}</span>
                        {log.entity && (
                          <span className="text-[10px] text-mute truncate block mt-0.5">Entity: {log.entity}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-mute shrink-0">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Log Details JSON Viewer */}
          <div className="glass-panel rounded-lg p-5 flex flex-col h-full max-h-[600px]">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[10px] font-mono text-signal uppercase tracking-wider">
                Metadata Inspector
              </h2>
              <div className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-line" />
                <span className="w-2.5 h-2.5 rounded-full bg-line" />
              </div>
            </div>
            
            {selectedLog ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-4">
                  <span className="text-[10px] text-mute block font-mono">ACTION TYPE</span>
                  <span className="text-xs font-bold font-mono text-ink mt-0.5 block">{selectedLog.action}</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <span className="text-[10px] text-mute block font-mono mb-1">PAYLOAD DETAILS</span>
                  <pre className="bg-[#040605] border border-line/60 p-4 rounded-md text-[10px] font-mono text-signal/90 overflow-x-auto whitespace-pre-wrap glow-text-signal shadow-inner leading-relaxed">
                    {selectedLog.metadata ? JSON.stringify(selectedLog.metadata, null, 2) : "{\n  \"info\": \"No details logged for this transaction\"\n}"}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-mute text-xs p-6 leading-relaxed font-mono">
                Select an operational trace row to inspect JSON parameters.
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import { useState } from "react";

interface Contact {
  name: string;
  company: string;
  deal: string;
  value: number;
}

const CRM_CONTACTS: Contact[] = [
  { name: "Rahul Sharma", company: "Meridian Textiles", deal: "Bulk Linen Supply", value: 500000 },
  { name: "Priya Nair", company: "Coastal Crafts Pvt Ltd", deal: "Annual Weave Supply", value: 1250000 },
  { name: "Amit Gupta", company: "Gupta Tech Solutions", deal: "Widget Integration Dev", value: 468000 },
];

export default function ContractsPage() {
  const [selectedContact, setSelectedContact] = useState<Contact>(CRM_CONTACTS[0]);
  const [customClause, setCustomClause] = useState("10% wholesale volume discount applied for orders exceeding 500 meters.");
  
  const [generating, setGenerating] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [contractText, setContractText] = useState<string | null>(null);

  function compileContract(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setContractText(null);
    setSigned(false);

    setTimeout(() => {
      setGenerating(false);
      setContractText(`MUTUAL SERVICES & SUPPLY AGREEMENT

This Agreement is entered into by and between DareXAI Operations Platform (the "Provider") and ${selectedContact.company} represented by representative ${selectedContact.name} (the "Client").

1. SCOPE OF SERVICES
Provider agrees to deliver B2B automation solutions and standard fulfillment services for ${selectedContact.company} regarding deal outline: "${selectedContact.deal}".

2. PAYMENT & BILLING VALUES
In consideration for the fulfillment metrics outlined, Client agrees to pay the final contract sum of ₹${selectedContact.value.toLocaleString("en-IN")} on net-30 terms from receipt of transaction invoice.

3. CUSTOM COMMITTED CLAUSES
The following custom operations clause is hereby incorporated into this legal agreement:
- "${customClause}"

4. GOVERNING LAW & SIGNATURES
This Agreement shall be governed by the laws of India. Both parties commit to digital execution.

Authorized Signatory for Client:
_________________________
Name: ${selectedContact.name}
Title: Corporate Procurement Lead
`);
    }, 1000);
  }

  function signContract() {
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
    }, 900);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">AI Contract Builder</h1>
          <p className="text-mute text-xs">Draft, compile, and execute digital B2B agreements directly from CRM deal files.</p>
        </div>
        <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute font-bold">
          SECURE SIGNATURE BOUNDARY
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Left: Settings Panel */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
            Contract Parameters
          </h2>
          <form onSubmit={compileContract} className="space-y-4 text-xs">
            <div>
              <label className="block text-mute mb-1.5 font-medium">Select CRM Deal File</label>
              <select
                value={selectedContact.name}
                onChange={(e) => {
                  const match = CRM_CONTACTS.find((c) => c.name === e.target.value);
                  if (match) {
                    setSelectedContact(match);
                    setContractText(null);
                    setSigned(false);
                  }
                }}
                className="w-full bg-canvas border border-line rounded px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-signal"
              >
                {CRM_CONTACTS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.company} ({c.deal})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-mute mb-1.5 font-medium">Agreement Value</label>
              <input
                disabled
                value={`₹${selectedContact.value.toLocaleString("en-IN")}`}
                className="w-full bg-panel border border-line rounded px-3 py-2.5 text-xs text-mute font-mono"
              />
            </div>
            <div>
              <label className="block text-mute mb-1.5 font-medium">Custom Operations Clause</label>
              <textarea
                required
                value={customClause}
                onChange={(e) => setCustomClause(e.target.value)}
                rows={3}
                className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal resize-none leading-relaxed"
              />
            </div>
            <button
              disabled={generating}
              className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {generating ? "Compiling legal draft..." : "Compile B2B Agreement"}
            </button>
          </form>
        </div>

        {/* Right: Contract Preview / Draft */}
        <div className="md:col-span-2">
          {generating ? (
            <div className="glass-panel rounded-lg p-12 text-center text-xs font-mono text-mute animate-pulse">
              ⚡ Invoking legal contract formats, structuring parameters, and compiling B2B draft...
            </div>
          ) : contractText ? (
            <div className="glass-panel rounded-lg p-6 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center border-b border-line/40 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-mute uppercase tracking-wider block">CONTRACT DRAFT</span>
                  <span className="text-xs font-bold text-ink block mt-0.5">{selectedContact.company} SLA Agreement</span>
                </div>
                <span className={`px-2.5 py-0.5 border rounded text-[9px] font-mono ${
                  signed ? "text-signal border-signal/20 bg-signal/5" : "text-amber border-amber/20 bg-amber/5 animate-pulse"
                }`}>
                  {signed ? "EXECUTED & SIGNED" : "AWAITING SIGNATURE"}
                </span>
              </div>

              {/* Text document */}
              <pre className="flex-1 bg-[#040605] border border-line/60 p-5 rounded-md text-[11px] font-mono text-signal/85 overflow-y-auto whitespace-pre-wrap leading-relaxed max-h-[300px]">
                {contractText}
              </pre>

              {/* Signature trigger button */}
              <div className="border-t border-line/40 pt-4 mt-4">
                {signed ? (
                  <div className="p-2 border border-signal/20 bg-signal/5 text-signal text-center font-mono text-[10px] rounded">
                    ✓ Contract digitally e-signed. CRM pipeline and unified timeline logs updated successfully.
                  </div>
                ) : (
                  <button
                    onClick={signContract}
                    disabled={signing}
                    className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity text-xs"
                  >
                    {signing ? "Validating cryptographic signature keys..." : "Authorize & Digitally E-Sign Contract"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-lg p-12 text-center text-xs font-mono text-mute leading-relaxed max-w-sm mx-auto">
              Configure contract parameters on the left and compile to construct B2B documents.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

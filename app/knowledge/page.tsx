"use client";

import { useState } from "react";

interface DocumentRecord {
  id: string;
  name: string;
  size: string;
  status: "INDEXED" | "TRAINING";
  uploaded: string;
}

interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  active: boolean;
}

export default function KnowledgePage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([
    { id: "1", name: "Standard_Fabric_Catalog_2026.pdf", size: "2.4 MB", status: "INDEXED", uploaded: "Today, 10:25 AM" },
    { id: "2", name: "Shipping_And_Return_Policies.docx", size: "128 KB", status: "INDEXED", uploaded: "Yesterday" },
  ]);

  const [faqs, setFaqs] = useState<FaqRecord[]>([
    { id: "1", question: "What is the delivery timeline for bulk fabric orders?", answer: "Bulk fabric orders are processed within 2 business days. Out-of-state freight shipping takes between 3 to 5 business days depending on location.", active: true },
    { id: "2", question: "Do you offer customization on fabric weaves?", answer: "Yes, customization is available for orders exceeding 1,000 meters. Contact our design desk at design@darexai.com for weave parameters.", active: true },
  ]);

  // Form states
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("450 KB");

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  function addFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const newRecord: FaqRecord = {
      id: String(faqs.length + 1),
      question: newQuestion,
      answer: newAnswer,
      active: true,
    };

    setFaqs([newRecord, ...faqs]);
    setNewQuestion("");
    setNewAnswer("");
    setFeedback("FAQ entry cataloged and compiled.");
    setTimeout(() => setFeedback(""), 2000);
  }

  function toggleFaq(id: string) {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!fileName.trim()) return;

    const newDoc: DocumentRecord = {
      id: String(docs.length + 1),
      name: fileName.replace(/\s+/g, "_") + ".pdf",
      size: fileSize,
      status: "TRAINING",
      uploaded: "Just now",
    };

    setDocs([newDoc, ...docs]);
    setFileName("");
    
    // Simulate compilation training finish
    setTimeout(() => {
      setDocs((currentDocs) =>
        currentDocs.map((d) => (d.id === newDoc.id ? { ...d, status: "INDEXED" as const } : d))
      );
      setFeedback("Document successfully tokenized and active.");
      setTimeout(() => setFeedback(""), 2000);
    }, 2500);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">AI Knowledge Base</h1>
          <p className="text-mute text-xs">Manage reference documents and FAQ context to ground the AI Agent.</p>
        </div>
        <div className="flex items-center gap-3">
          {feedback && (
            <span className="text-[10px] font-mono border border-signal/20 bg-signal/5 px-3 py-1 rounded-full text-signal">
              {feedback}
            </span>
          )}
          <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute">
            INDEX: GROUNDED ({docs.length + faqs.filter(f=>f.active).length} items)
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start mb-6">
        {/* Left column: FAQ Directory */}
        <div className="space-y-6">
          {/* Add FAQ form */}
          <div className="glass-panel rounded-lg p-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
              Add Grounding FAQ Entry
            </h2>
            <form onSubmit={addFaq} className="space-y-4 text-xs">
              <div>
                <label className="block text-mute mb-1.5 font-medium">Question</label>
                <input
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What is our refund window?"
                  className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal placeholder-mute font-medium"
                />
              </div>
              <div>
                <label className="block text-mute mb-1.5 font-medium">Answer text details</label>
                <textarea
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Provide precise details..."
                  rows={3}
                  className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal placeholder-mute leading-relaxed resize-none"
                />
              </div>
              <button className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 transition-opacity">
                Add FAQ to Knowledge Base
              </button>
            </form>
          </div>

          {/* Active FAQ List */}
          <div className="glass-panel rounded-lg p-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
              Indexed FAQ Directory
            </h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-line/40 last:border-0 pb-3 last:pb-0 text-xs">
                  <div className="flex justify-between items-start gap-3">
                    <span className="font-semibold text-ink leading-tight">{faq.question}</span>
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className={`w-9 h-4.5 rounded-full p-0.5 transition-colors shrink-0 ${faq.active ? "bg-signal" : "bg-line"}`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full bg-canvas transition-transform ${faq.active ? "translate-x-4.5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  {faq.active && (
                    <p className="text-[11px] text-mute mt-1.5 leading-relaxed pl-1.5 border-l border-line/60">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Document Uploader */}
        <div className="space-y-6">
          {/* Mock Doc uploader */}
          <div className="glass-panel rounded-lg p-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
              Index Catalog Document
            </h2>
            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div className="border border-dashed border-line/80 rounded-lg p-6 text-center cursor-pointer hover:border-signal/50 hover:bg-panel/10 transition-colors">
                <span className="text-[11px] text-mute block">PDF, TXT, or DOCX (max 10MB)</span>
                <span className="text-[10px] text-signal font-mono mt-1 block">Drag and drop file here</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-mute mb-1">Filename</label>
                  <input
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. Sales Guidelines"
                    className="w-full bg-canvas border border-line rounded px-2.5 py-2 text-xs text-ink focus:outline-none focus:border-signal"
                  />
                </div>
                <div>
                  <label className="block text-mute mb-1">File Size</label>
                  <input
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="e.g. 500 KB"
                    className="w-full bg-canvas border border-line rounded px-2.5 py-2 text-xs text-ink focus:outline-none focus:border-signal"
                  />
                </div>
              </div>
              <button
                disabled={!fileName.trim()}
                className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Upload & Tokenize Document
              </button>
            </form>
          </div>

          {/* Active documents list */}
          <div className="glass-panel rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-line bg-panel/30">
              <span className="text-[10px] font-mono text-mute uppercase tracking-widest font-bold">Indexed Documents</span>
            </div>
            <div className="divide-y divide-line/45">
              {docs.map((doc) => (
                <div key={doc.id} className="p-4 flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-ink block">{doc.name}</span>
                    <span className="text-[10px] text-mute font-mono block">
                      Size: {doc.size} · Uploaded: {doc.uploaded}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 border rounded text-[9px] font-mono ${
                    doc.status === "INDEXED" ? "text-signal border-signal/20 bg-signal/5" : "text-amber border-amber/20 bg-amber/5 animate-pulse"
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

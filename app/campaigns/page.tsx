"use client";

import { useState } from "react";

interface EmailTemplate {
  step: string;
  delay: string;
  subject: string;
  body: string;
}

const TEMPLATE_DATABASE: Record<string, Record<string, EmailTemplate[]>> = {
  Textiles: {
    Professional: [
      {
        step: "Step 1",
        delay: "Day 1 (Intro)",
        subject: "Custom Fabric Catalog & Volume Pricing — DareXAI Partner Desk",
        body: "Dear [Contact Name],\n\nThank you for reaching out regarding our B2B textile offerings. I have attached our Q3 fabric catalog detailing our customization options for linen and cotton weaves.\n\nWe provide custom volume discounts starting at 500 meters. Please let me know your production specs, and we can prepare a tailored quote.\n\nBest regards,\nOperations Team",
      },
      {
        step: "Step 2",
        delay: "Day 3 (Follow-up)",
        subject: "Custom Weaves & Fabric Specifications Review",
        body: "Hi [Contact Name],\n\nFollowing up on our catalog email, I wanted to highlight that our manufacturing desk handles custom weaves (e.g. thread-count modifications) directly at our production hub.\n\nWe'd love to jump on a brief 5-minute call next Tuesday at 10 AM to discuss your requirements. Does that fit your schedule?\n\nSincerely,\nOperations Team",
      },
      {
        step: "Step 3",
        delay: "Day 7 (Final Quote)",
        subject: "Final Volume Discount Inquiry — Partner Desk",
        body: "Hi [Contact Name],\n\nI wanted to send a final check-in regarding the bulk order specs. We are finalizing our Q3 weaving schedule this Friday, and I can lock in a 10% volume discount for your order if we confirm parameters by then.\n\nLet me know if we can schedule a quick callback to verify details.\n\nBest regards,\nOperations Team",
      },
    ],
    Urgent: [
      {
        step: "Step 1",
        delay: "Day 1 (Intro)",
        subject: "Action Required: Lock in Custom Weave Schedule",
        body: "Hi [Contact Name],\n\nOur manufacturing schedules for custom linen weaves are filling up rapidly for Q3. To ensure delivery by mid-August, we need to qualify your bulk specs today.\n\nReply with your yardage requirements, and we will lock in your slot immediately.\n\nBest,\nOperations Desk",
      },
      {
        step: "Step 2",
        delay: "Day 2 (Follow-up)",
        subject: "Reminder: Custom Weave Slot Finalizing",
        body: "Hi [Contact Name],\n\nThis is a quick reminder that our queue closes tomorrow. If we do not receive your fabric parameters by 5 PM, we will have to push your shipment date to late September.\n\nLet's get this finalized. Do you have 5 minutes to call today?\n\nBest,\nOperations Desk",
      },
    ],
  },
  "Software / SaaS": {
    Professional: [
      {
        step: "Step 1",
        delay: "Day 1 (Intro)",
        subject: "API Integration Scope & Engineering Sandbox Credentials",
        body: "Dear [Contact Name],\n\nThanks for your interest in our SaaS platform. I have generated a custom engineering sandbox for your team, active for the next 14 days.\n\nYou can access our developer docs here to review API endpoints. I would love to schedule a brief technical sync with our solutions architect to review your data flow.\n\nBest regards,\nDeveloper Relations",
      },
      {
        step: "Step 2",
        delay: "Day 3 (Follow-up)",
        subject: "API Sandbox Evaluation & SDK Review",
        body: "Hi [Contact Name],\n\nJust checking in to see if your team was able to initialize the API keys in the engineering sandbox.\n\nWe recently updated our Node.js and Python SDKs to support multi-tenant query routing. Let me know if you need any assistance setting up your webhooks.\n\nSincerely,\nDeveloper Support Desk",
      },
    ],
    Urgent: [
      {
        step: "Step 1",
        delay: "Day 1 (Intro)",
        subject: "Action Required: Trial Expiration & API Deactivation Alert",
        body: "Hi [Contact Name],\n\nYour 14-day API developer trial is scheduled to expire in 48 hours. To prevent any service interruption to your active endpoints, we need to upgrade you to the production tier.\n\nLet's coordinate a quick call today to qualify your queries quota.\n\nBest,\nSaaS Account Desk",
      },
    ],
  },
  "Digital Services": {
    Professional: [
      {
        step: "Step 1",
        delay: "Day 1 (Intro)",
        subject: "Project Audit Proposal & Scope of Work — Consultancy Desk",
        body: "Dear [Contact Name],\n\nFollowing our discussion regarding your operational workflows, I have prepared a draft Scope of Work (SOW) outlining our weekly milestones and deliverables.\n\nWe specialize in automating audit logs and business intelligence reports. Let me know if you have any feedback on the milestones list.\n\nBest regards,\nConsulting Solutions Team",
      },
      {
        step: "Step 2",
        delay: "Day 3 (Follow-up)",
        subject: "Milestones Scope Review & Kick-off Scheduling",
        body: "Hi [Contact Name],\n\nI wanted to check if you had a chance to review the audit milestones. We have availability to kick-off the discovery phase next Monday.\n\nLet me know if we can schedule a quick 10-minute check-in call tomorrow to lock in the calendar.\n\nSincerely,\nConsulting Solutions Team",
      },
    ],
    Urgent: [
      {
        step: "Step 1",
        delay: "Day 1 (Intro)",
        subject: "Urgent: Proposal Review and Resource Allocation Slot",
        body: "Hi [Contact Name],\n\nWe are finalizing our consulting team allocations for the upcoming sprint this Friday. To secure our engineering resources for your project audit, we need your signed approval on the SOW.\n\nLet's get on a call today to address any open items.\n\nBest,\nOperations Desk",
      },
    ],
  },
};

export default function CampaignsPage() {
  const [industry, setIndustry] = useState<"Textiles" | "Software / SaaS" | "Digital Services">("Textiles");
  const [goal, setGoal] = useState("Bulk Linen Catalog Follow-up");
  const [segment, setSegment] = useState("Leads with Score > 75");
  const [tone, setTone] = useState<"Professional" | "Urgent">("Professional");
  
  const [generating, setGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [generatedList, setGeneratedList] = useState<EmailTemplate[] | null>(null);

  function runGeneration(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setGeneratedList(null);

    // Simulate AI prompt generation
    setTimeout(() => {
      setGenerating(false);
      setGeneratedList(TEMPLATE_DATABASE[industry][tone]);
      setActiveStep(0);
    }, 1200);
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <main className="p-8 w-full overflow-y-auto bg-transparent text-ink flex-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-medium tracking-tight mb-1">AI Email Campaigns</h1>
          <p className="text-mute text-xs">Generate and manage automated multi-step drip email follow-ups using Gemini.</p>
        </div>
        <span className="text-[10px] font-mono border border-line bg-panel px-3 py-1 rounded-full text-mute">
          CAMPAIGN ENGINE: ACTIVE
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Left column: Configuration Panel */}
        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-xs uppercase tracking-wider font-semibold mb-4 text-signal">
            Outreach Configurations
          </h2>
          <form onSubmit={runGeneration} className="space-y-4 text-xs">
            <div>
              <label className="block text-mute mb-1.5 font-medium">Business Industry Type</label>
              <select
                value={industry}
                onChange={(e) => {
                  const ind = e.target.value as "Textiles" | "Software / SaaS" | "Digital Services";
                  setIndustry(ind);
                  // Update default goal depending on selection
                  setGoal(
                    ind === "Textiles" ? "Bulk Linen Catalog Follow-up" :
                    ind === "Software / SaaS" ? "Developer API Sandbox Evaluation" :
                    "Weekly Milestones SOW Proposal Scope"
                  );
                  setGeneratedList(null);
                }}
                className="w-full bg-canvas border border-line rounded px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-signal"
              >
                <option value="Textiles">Textiles & Manufacturing</option>
                <option value="Software / SaaS">Software & SaaS Products</option>
                <option value="Digital Services">Digital Services & Consulting</option>
              </select>
            </div>
            <div>
              <label className="block text-mute mb-1.5 font-medium">Outreach Goal</label>
              <input
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-canvas border border-line rounded px-3.5 py-2.5 text-xs text-ink focus:outline-none focus:border-signal"
              />
            </div>
            <div>
              <label className="block text-mute mb-1.5 font-medium">Target Lead Segment</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full bg-canvas border border-line rounded px-3 py-2.5 text-xs text-ink focus:outline-none focus:border-signal"
              >
                <option>Leads with Score &gt; 75</option>
                <option>Active Opportunities in NEGOTIATION</option>
                <option>All CRM Customer Contacts</option>
              </select>
            </div>
            <div>
              <label className="block text-mute mb-1.5 font-medium">Outreach Tone</label>
              <div className="flex gap-2 font-mono text-[10px]">
                {(["Professional", "Urgent"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 border rounded uppercase ${
                      tone === t ? "text-signal border-signal/30 bg-signal/5 font-bold" : "text-mute border-line hover:text-ink"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button
              disabled={generating}
              className="w-full py-2 bg-signal text-canvas font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {generating ? "Gemini composing campaign..." : "Compile Drip Sequence"}
            </button>
          </form>
        </div>

        {/* Right column: Generated Drips Panel */}
        <div className="md:col-span-2">
          {generating ? (
            <div className="glass-panel rounded-lg p-12 text-center text-xs font-mono text-mute animate-pulse">
              ⚡ Compiling email drafts, structuring follow-up parameters, and grounding templates...
            </div>
          ) : generatedList ? (
            <div className="glass-panel rounded-lg p-6 flex flex-col h-[400px]">
              {/* Step Tab selector */}
              <div className="flex gap-2 border-b border-line/40 pb-2 mb-4 text-[10px] font-mono">
                {generatedList.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`px-3 py-1.5 border rounded ${
                      activeStep === idx ? "text-signal border-signal/30 bg-signal/5 font-semibold" : "text-mute border-line hover:text-ink"
                    }`}
                  >
                    {tmpl.step} ({tmpl.delay})
                  </button>
                ))}
              </div>

              {/* Template details */}
              <div className="flex-1 flex flex-col overflow-hidden text-xs">
                <div className="flex justify-between items-center mb-3">
                  <div className="min-w-0 pr-4">
                    <span className="text-[10px] text-mute block font-mono">SUBJECT LINE</span>
                    <span className="text-xs font-bold text-ink truncate block mt-0.5">{generatedList[activeStep].subject}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(`${generatedList[activeStep].subject}\n\n${generatedList[activeStep].body}`, activeStep)}
                    className="text-[10px] font-mono text-signal hover:underline shrink-0"
                  >
                    {copiedIndex === activeStep ? "COPIED" : "COPY EMAIL"}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-[#040605] border border-line/60 p-4 rounded-md text-[11px] font-mono text-signal/90 leading-relaxed max-h-[220px]">
                  {generatedList[activeStep].body}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="glass-panel rounded-lg p-5">
                <span className="text-[10px] font-mono text-mute uppercase tracking-widest block mb-4">
                  Drip Sequence Blueprint (Awaiting Compilation)
                </span>
                
                {/* Horizontal flow connector map */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                  
                  {/* Step 1 Blueprint */}
                  <div className="border border-dashed border-line/60 rounded-lg p-4 bg-canvas/20 flex flex-col justify-between h-40">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono text-signal/40 border border-signal/15 px-2 py-0.5 rounded bg-signal/[0.02]">
                          STEP 1 (DAY 1)
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-line/40" />
                      </div>
                      {/* Skeleton lines */}
                      <div className="space-y-2 mt-2">
                        <div className="h-2.5 bg-line/30 rounded w-2/3" />
                        <div className="h-1.5 bg-line/15 rounded w-full" />
                        <div className="h-1.5 bg-line/15 rounded w-5/6" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-mute/50 mt-4 block">Awaiting goal parameters...</span>
                  </div>

                  {/* Step 2 Blueprint */}
                  <div className="border border-dashed border-line/60 rounded-lg p-4 bg-canvas/20 flex flex-col justify-between h-40">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono text-sky-400/30 border border-sky-400/15 px-2 py-0.5 rounded bg-sky-400/[0.02]">
                          STEP 2 (DAY 3)
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-line/40" />
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="h-2.5 bg-line/30 rounded w-1/2" />
                        <div className="h-1.5 bg-line/15 rounded w-full" />
                        <div className="h-1.5 bg-line/15 rounded w-3/4" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-mute/50 mt-4 block">Awaiting goal parameters...</span>
                  </div>

                  {/* Step 3 Blueprint */}
                  <div className="border border-dashed border-line/60 rounded-lg p-4 bg-canvas/20 flex flex-col justify-between h-40">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-mono text-amber/30 border border-amber/15 px-2 py-0.5 rounded bg-amber/[0.02]">
                          STEP 3 (DAY 7)
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-line/40" />
                      </div>
                      <div className="space-y-2 mt-2">
                        <div className="h-2.5 bg-line/30 rounded w-3/5" />
                        <div className="h-1.5 bg-line/15 rounded w-5/6" />
                        <div className="h-1.5 bg-line/15 rounded w-full" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-mute/50 mt-4 block">Awaiting goal parameters...</span>
                  </div>

                </div>

                <div className="text-center text-mute text-xs font-mono mt-8 border-t border-line/30 pt-4 leading-relaxed">
                  Configure the outreach goal and lead segment on the left, then click <strong className="text-signal font-semibold">Compile Drip Sequence</strong> to populate your automated outreach sequence.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

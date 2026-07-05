import { generateTurn, GeminiMessage } from "./gemini";

/**
 * Quick single-turn (non-streaming, no tools) call used to generate a next-
 * best-action suggestion for a CRM opportunity. Kept separate from the main
 * agent loop since it's a background enrichment step, not a chat turn.
 */
export async function generateNextBestAction(opts: {
  businessName: string;
  contactName: string;
  opportunityTitle: string;
  stage: string;
  value: number;
}) {
  const prompt = `Opportunity "${opts.opportunityTitle}" with ${opts.contactName} is in stage
${opts.stage}, worth ${opts.value}. Suggest the single next best action a salesperson at
"${opts.businessName}" should take right now. Respond ONLY as JSON:
{"action": "<one short imperative sentence>", "reasoning": "<one short sentence why>"}`;

  const contents: GeminiMessage[] = [{ role: "user", parts: [{ text: prompt }] }];

  try {
    const parts = await generateTurn(
      contents,
      "You are a sales strategy assistant. Always respond with strict JSON, no markdown fences.",
      []
    );
    const text = parts.find((p) => p.text)?.text || "{}";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      action: String(parsed.action || "Follow up with the contact"),
      reasoning: String(parsed.reasoning || "Keep the deal moving"),
    };
  } catch {
    // AI enrichment is best-effort — never block the core CRM write on it.
    return { action: "Follow up with the contact", reasoning: "Unable to generate AI insight right now" };
  }
}

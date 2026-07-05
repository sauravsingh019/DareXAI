import { generateTurn, GeminiMessage } from "./gemini";

export async function generateConversationInsights(transcript: string) {
  const prompt = `Here is a customer conversation transcript:
"""
${transcript}
"""
Respond ONLY as JSON: {"summary": "<1 sentence>", "sentiment": "positive|neutral|negative",
"intent": "<short label, e.g. pricing_inquiry, complaint, ready_to_buy>", "nextAction": "<1 short imperative sentence>"}`;

  try {
    const parts = await generateTurn(
      [{ role: "user", parts: [{ text: prompt }] } as GeminiMessage],
      "You analyze customer conversations for a CRM. Always respond with strict JSON, no markdown fences.",
      []
    );
    const text = parts.find((p) => p.text)?.text || "{}";
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    return {
      summary: String(parsed.summary || ""),
      sentiment: String(parsed.sentiment || "neutral"),
      intent: String(parsed.intent || "unknown"),
      nextAction: String(parsed.nextAction || ""),
    };
  } catch {
    return { summary: "", sentiment: "neutral", intent: "unknown", nextAction: "" };
  }
}

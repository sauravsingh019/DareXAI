const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY || "";
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export interface GeminiPart {
  text?: string;
  functionCall?: { name: string; args: Record<string, unknown> };
  functionResponse?: { name: string; response: Record<string, unknown> };
}

export interface GeminiMessage {
  role: "user" | "model" | "function";
  parts: GeminiPart[];
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

/**
 * One non-streaming turn — used to let the model decide whether it wants to
 * call a tool. Gemini returns tool calls as structured functionCall parts
 * rather than interleaved with streamed text, so the decide-then-stream
 * split keeps tool execution deterministic.
 */
export async function generateTurn(
  contents: GeminiMessage[],
  systemInstruction: string,
  tools: FunctionDeclaration[]
) {
  const res = await fetch(`${BASE}/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      tools: tools.length ? [{ functionDeclarations: tools }] : undefined,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${body}`);
  }
  const data = await res.json();
  const candidate = data.candidates?.[0];
  const parts: GeminiPart[] = candidate?.content?.parts || [];
  return parts;
}

/**
 * Streams the final natural-language answer token-by-token once no more
 * tool calls are needed, via Gemini's SSE streaming endpoint.
 */
export async function* streamFinalAnswer(
  contents: GeminiMessage[],
  systemInstruction: string
): AsyncGenerator<string> {
  const res = await fetch(
    `${BASE}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { role: "system", parts: [{ text: systemInstruction }] },
      }),
    }
  );

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini streaming error ${res.status}: ${body}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const jsonStr = line.slice(5).trim();
      if (!jsonStr) continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) yield text;
      } catch {
        // partial chunk, ignore — next iteration will complete it
      }
    }
  }
}

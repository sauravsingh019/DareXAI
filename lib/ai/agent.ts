import { prisma } from "@/lib/prisma";
import { GeminiMessage, generateTurn, streamFinalAnswer } from "./gemini";
import { TOOL_DECLARATIONS, executeTool } from "./tools";

const MAX_TOOL_ITERATIONS = 4;

export interface AgentEvent {
  type: "tool_call" | "tool_result" | "token" | "done" | "error";
  data: unknown;
}

async function buildSystemInstruction(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  const [contactCount, oppCount] = await Promise.all([
    prisma.contact.count({ where: { tenantId } }),
    prisma.opportunity.count({ where: { tenantId } }),
  ]);

  return `You are the AI Business Operations Assistant for "${tenant?.name}" (industry: ${
    tenant?.industry || "unspecified"
  }) inside DareXAI, a multi-tenant B2B ops platform.
The business currently has ${contactCount} contacts and ${oppCount} opportunities in its CRM.
You can call tools to look up or act on real CRM/WhatsApp data — always prefer calling a tool
over guessing. When a request implies a multi-step action (e.g. "follow up with Rahul tomorrow"),
chain the necessary tools yourself: find the contact, take the action, create a follow-up task,
and let the audit log record it — don't ask the user to do these steps manually.
After you finish, your final reply to the user must be natural, concise, and include a short
one-line explanation of WHY you took the actions you did (explainability is required for every
response).`;
}

/**
 * Runs the full agent turn: lets Gemini decide on zero or more tool calls
 * (each executed tenant-scoped), then streams the final natural-language
 * answer. Yields AgentEvents so the API route can forward them over SSE.
 */
export async function* runAgentTurn(opts: {
  tenantId: string;
  userId: string;
  conversationId: string;
  history: GeminiMessage[];
  userMessage: string;
}): AsyncGenerator<AgentEvent> {
  const systemInstruction = await buildSystemInstruction(opts.tenantId);

  const contents: GeminiMessage[] = [
    ...opts.history,
    { role: "user", parts: [{ text: opts.userMessage }] },
  ];

  await prisma.message.create({
    data: {
      conversationId: opts.conversationId,
      direction: "INBOUND",
      role: "user",
      content: opts.userMessage,
    },
  });

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    let parts;
    try {
      parts = await generateTurn(contents, systemInstruction, TOOL_DECLARATIONS);
    } catch (err) {
      yield { type: "error", data: (err as Error).message };
      return;
    }

    const functionCalls = parts.filter((p) => p.functionCall);
    if (functionCalls.length === 0) {
      // Model is ready to answer — append what it said (if any text) and
      // fall through to streaming the final answer below.
      break;
    }

    contents.push({ role: "model", parts });

    for (const part of functionCalls) {
      const call = part.functionCall!;
      yield { type: "tool_call", data: { name: call.name, args: call.args } };

      let toolResult: unknown;
      try {
        toolResult = await executeTool(call.name, call.args, {
          tenantId: opts.tenantId,
          userId: opts.userId,
        });
      } catch (err) {
        toolResult = { error: (err as Error).message };
      }

      await prisma.message.create({
        data: {
          conversationId: opts.conversationId,
          direction: "OUTBOUND",
          role: "tool",
          toolName: call.name,
          toolArgs: call.args as never,
          content: JSON.stringify(toolResult),
        },
      });

      yield { type: "tool_result", data: { name: call.name, result: toolResult } };

      contents.push({
        role: "function",
        parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }],
      });
    }
  }

  let fullText = "";
  try {
    for await (const chunk of streamFinalAnswer(contents, systemInstruction)) {
      fullText += chunk;
      yield { type: "token", data: chunk };
    }
  } catch (err) {
    yield { type: "error", data: (err as Error).message };
    return;
  }

  await prisma.message.create({
    data: {
      conversationId: opts.conversationId,
      direction: "OUTBOUND",
      role: "assistant",
      content: fullText,
    },
  });

  yield { type: "done", data: { text: fullText } };
}

import { z } from "zod";

// Prisma's parameterized queries already prevent SQL injection by
// construction, but we still validate shape/length/type on every input so
// malformed or oversized payloads never reach the query layer, and so
// free-text fields can't smuggle in script tags that would later render
// unescaped (defense in depth alongside React's default output escaping).

export const contactSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().max(30).optional(),
  email: z.string().email().max(160).optional(),
  company: z.string().max(160).optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  notes: z.string().max(2000).optional(),
});

export const opportunitySchema = z.object({
  contactId: z.string().uuid(),
  title: z.string().min(1).max(160),
  stage: z.enum(["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]).optional(),
  value: z.number().min(0).max(1_000_000_000).optional(),
});

export const chatMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1).max(4000),
});

export const onboardingSchema = z.object({
  businessName: z.string().min(1).max(160),
  industry: z.string().min(1).max(80),
});

export const whatsappWebhookSchema = z.object({
  from: z.string().min(3).max(30),
  name: z.string().max(120).optional(),
  text: z.string().min(1).max(4000),
});

export const taskSchema = z.object({
  contactId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  dueAt: z.string().datetime().optional(),
});

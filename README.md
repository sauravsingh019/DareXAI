# DareXAI — AI Business Operations Platform

A multi-tenant AI business assistant built for the DareXAI Full Stack AI Engineer internship
challenge. It's an AI agent-first ops console: converse with an AI agent that can look up
customers, update deals, send WhatsApp messages, and create follow-ups on its own — not a
traditional CRUD dashboard with a chatbot bolted on.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, API routes) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Google OAuth 2.0 with PKCE, JWT access + refresh (rotation), httpOnly cookies |
| AI | Gemini (`gemini-1.5-flash`, free tier) — function calling + SSE streaming |
| Styling | Tailwind CSS |
| Tests | Vitest + Testing Library |

## Project Structure

The project follows a standard Next.js App Router structure with Prisma database modeling and custom AI/Auth libraries:

```text
├── app/                      # Next.js App Router pages and APIs
│   ├── (console)/            # Route group sharing centralized sidebar layout
│   │   ├── dashboard/        # Operations console KPI metrics
│   │   ├── inbox/            # Unified inbox (WhatsApp/Email/Calls timeline)
│   │   ├── crm/              # B2B deal pipeline and contact list
│   │   └── ...               # Additional operational console modules
│   ├── api/                  # REST and SSE API route endpoints
│   │   ├── ai/               # AI Assistant endpoints
│   │   ├── auth/             # Login, Google OAuth, session refresh, bypass
│   │   └── ...               # CRM, logs, simulator and webhook controllers
│   ├── login/                # Authentication entrance page
│   ├── onboarding/           # Tenant metadata setup screen
│   ├── layout.tsx            # Root HTML layout structure
│   └── page.tsx              # Public landing page
├── components/               # Shared React UI components
│   ├── ConsoleLayout.tsx     # Centralized dashboard flex container with sidebar
│   ├── Sidebar.tsx           # Navigation panel for Console pages
│   └── ...                   # Custom UI components (KpiCard, DareXLogo, etc.)
├── lib/                      # Business logic modules & helpers
│   ├── ai/                   # Gemini API, tool execution, eQTL insights
│   ├── auth/                 # JWT signing, PKCE generator, secure cookies
│   └── ...                   # Prisma client, Whatsapp API, validation schemas
├── prisma/                   # Database ORM modeling
│   ├── schema.prisma         # Schema definitions (Tenant, Contact, Opportunity, etc.)
│   └── seed.ts               # Sample CRM data provisioning seed script
└── __tests__/                # Automated unit and integration tests
```

## Setup & Quick Start

Follow these steps to configure your environment and run the application locally:

### 1. Install Dependencies
Initialize package requirements:
```bash
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file from the example template:
```bash
cp .env.example .env
```
Fill in the following key parameters in `.env`:
* `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/db`)
* `GEMINI_API_KEY`: Google AI Developer Studio credential for AI features
* `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: OAuth keys (optional, fallback bypass available)
* `NEXT_PUBLIC_APP_URL`: Set to `http://localhost:3000` for local development

### 3. Initialize Database Migrations
Generate Prisma clients and run initial tables schema migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed Development Data
After signing in for the first time via the browser, populate mock B2B contacts, tasks, and opportunities:
```bash
npm run db:seed
```

### 5. Launch Development Server
Start Next.js local development process:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

*Note on Bypass Login*: If OAuth credentials are not configured, you can click **⚡ Developer Bypass Login** on the login page to instantly sign in and automatically register a test tenant workspace.


### Inbound Events & Workflows Simulator
Once logged in, navigate to the **Simulator** page (`/simulator`) to trigger operations flows with one click:
- **Lead Qualification Pipeline**: Simulates an inbound lead. Evaluates the lead's sales-readiness score, qualifies it, triggers a WhatsApp message (to the sandbox logs or live Meta API), schedules a follow-up task, and logs the entire flow in the audit trail.
- **WhatsApp, Email, and Call Ingestion**: Simulates customer messages. It triggers the webhook ingestion, computes sentiment, extracts intent, generates summaries, recommends next-best actions, and updates the Unified Inbox timeline in real time.

Run tests:

```bash
npm test
```

## Architecture

### Multi-tenancy

Every business owner who signs in for the first time gets a brand-new `Tenant` row
(`app/api/auth/callback/route.ts`). **Every** tenant-scoped Prisma query in the codebase filters
by `tenantId` pulled from the verified JWT session (`lib/auth/session.ts`) — never from a
client-supplied value. This is the entire tenant-isolation boundary, and it's enforced in one
place (`getSession()`) rather than re-implemented per route. The AI agent's tools
(`lib/ai/tools.ts`) go through the exact same `tenantId` filter, so a compromised or malicious
prompt cannot make the agent read or mutate another tenant's data — see
`__tests__/ai-tools-tenant-isolation.test.ts` for the automated proof (e.g.
`update_opportunity` refuses to touch an opportunity that doesn't resolve under the caller's
`tenantId`).

### Auth: Google OAuth PKCE + JWT rotation

- `/api/auth/google` generates a PKCE `code_verifier`/`code_challenge` pair and redirects to
  Google (`lib/auth/pkce.ts`).
- `/api/auth/callback` exchanges the code, verifies `state`, upserts the user/tenant, and issues
  a short-lived (15 min) access token + a 30-day refresh token, both in **httpOnly, secure,
  sameSite=lax** cookies — never exposed to client JS, closing the primary XSS-to-token-theft
  path.
- Refresh tokens are stored **hashed** (SHA-256) in `RefreshToken`, never in plaintext.
- **Rotation**: every call to `/api/auth/refresh` revokes the presented token and issues a new
  one in the same rotation `family`. If a *revoked* token is ever presented again — a strong
  signal of token theft/replay — the entire family is revoked immediately, logging the user out
  everywhere.

### AI Agent (`lib/ai/agent.ts`, `lib/ai/gemini.ts`, `lib/ai/tools.ts`)

The agent loop:
1. Build a system prompt with live business context (tenant name, industry, contact/opportunity
   counts) — this is what makes responses business-context-aware rather than generic.
2. Ask Gemini (`generateContent`, non-streaming) whether it wants to call a tool. Gemini returns
   structured `functionCall` parts rather than interleaving them with prose, so tool-calling and
   text streaming are handled as two distinct phases.
3. Execute each requested tool tenant-scoped, persist the call + result to the conversation, and
   log it to the audit trail.
4. Loop (max 4 iterations) until the model has what it needs, then stream the final answer
   token-by-token over SSE (`streamGenerateContent?alt=sse`) so the UI shows live output.
5. Every response includes a one-line "why" per the system prompt's explainability requirement.

The whole turn — user message, tool calls, tool results, and the final answer — is persisted as
`Message` rows so conversation history survives page reloads and feeds back into future turns.

### Unified Inbox & WhatsApp

WhatsApp, email, and call-log messages all live in the same `Conversation`/`Message` tables,
distinguished by `channel`. `/api/inbox/webhook/whatsapp` is a real Meta webhook handler
(handles the `hub.challenge` verification GET) that also doubles as the sandbox simulator when
no Meta credentials are set — `lib/whatsapp.ts` transparently switches between live Meta Cloud
API calls and sandbox mode based on whether `WHATSAPP_META_TOKEN`/`WHATSAPP_META_PHONE_ID` are
present, so going to production is an env-var change, not a code change. On every inbound
message, `lib/ai/conversation-insights.ts` regenerates AI summary, sentiment, intent, and
recommended next action for the thread.

**Design note on multi-tenant webhooks:** in sandbox mode the simulator identifies the tenant by
`tenantSlug` in the request body. A real Meta webhook payload instead carries the destination
`phone_number_id` — production wiring would resolve tenant via a `phoneNumberId → tenantId`
lookup, which needs a real Meta Business Account to fully exercise and is the one piece left as
a documented extension point rather than built blind.

### Workflow Automation (`/api/workflow/lead`)

Implements the suggested flow end-to-end: **New Lead → AI Qualification → (if score > 80) →
WhatsApp Follow-up → Task Creation → Audit Log.** Each stage writes its own audit entry so a
partial failure is still fully traceable, not just the final outcome.

### Security

- **Input validation**: every write endpoint validates its body with Zod (`lib/validation.ts`)
  before it touches Prisma — rejects oversized/malformed input at the boundary.
- **SQL injection**: Prisma's query builder parameterizes everything by construction; there is
  no raw string-interpolated SQL anywhere in the codebase.
- **XSS**: React escapes all rendered content by default; free-text fields are additionally
  length-capped by Zod.
- **CORS**: `lib/api-utils.ts` + `middleware.ts` restrict cross-origin API calls to
  `ALLOWED_ORIGINS`.
- **Secrets**: all credentials live in `.env` (see `.env.example`), never committed or hardcoded.
- **Audit logs**: every AI tool call, CRM mutation, and workflow stage writes to `AuditLog`
  (`lib/audit.ts`), scoped by tenant.
- **Rate limiting**: a lightweight in-memory sliding-window limiter guards the chat endpoint
  (`lib/api-utils.ts`) — noted in code as swap-for-Redis in a multi-instance deployment.

### Data model

`Tenant`, `User`, `RefreshToken`, `Contact`, `Opportunity`, `Conversation`, `Message`, `Task`,
`AuditLog` — see `prisma/schema.prisma`. `Message` is shared by WhatsApp/email/call timelines
*and* the AI chat (`channel: AI_CHAT`), with `role`/`toolName`/`toolArgs` columns used only by
the AI-chat case — one table instead of two nearly-identical ones, since both are fundamentally
"a directional message in a thread."

## What's stubbed vs. real

- **Google OAuth, Gemini, WhatsApp Cloud API**: all real integrations, wired to env vars — no
  mocked responses in the code path itself.
- **Email and Call Log ingestion**: modeled in the schema and rendered in the unified inbox UI,
  but there's no inbound connector (no email provider webhook, no telephony integration) — out
  of scope for 48 hours without those credentials. `Conversation.channel` already supports them,
  so wiring a provider is additive, not a schema change.
- **WhatsApp**: real Meta Cloud API when credentials are set; sandbox mode (stores + logs
  messages, same code path) otherwise, per the "sandbox acceptable" note in the brief.

## Testing

- `__tests__/auth-jwt.test.ts` — access/refresh token sign+verify, tamper rejection, refresh
  rotation family propagation.
- `__tests__/ai-tools-tenant-isolation.test.ts` — proves AI tool calls are tenant-scoped and
  every call is audit-logged.
- `__tests__/KpiCard.test.tsx` — frontend component test.

# 🚀 DareXAI — AI Business Operations Platform

> **An Enterprise-Grade AI Business Assistant for CRM Automation, Workflow Orchestration, and Intelligent Customer Engagement**
---
## 🌐 Live Demo : https://drive.google.com/file/d/1gFLVvACmLF1HtNkm75viSYgfDCGGSOPE/view?usp=sharing

## 📖 Overview

DareXAI is a modern **AI-powered Business Operations Platform** designed to help organizations automate customer interactions, CRM management, workflow execution, and business communication through an intelligent AI Agent.

Unlike traditional CRM systems where users manually navigate dashboards, DareXAI follows an **AI Agent-first architecture**. Users interact naturally with an AI assistant capable of understanding business context, retrieving customer information, updating opportunities, sending WhatsApp messages, creating follow-up tasks, and maintaining complete audit logs autonomously.

The platform combines **Generative AI**, **Multi-Tenant SaaS Architecture**, **Secure Authentication**, and **Workflow Automation** to deliver an enterprise-ready operations console.

---

# ✨ Key Features

### 🤖 AI Business Assistant

* Context-aware conversational AI
* Gemini Function Calling
* Business-aware responses
* Real-time streaming responses (SSE)
* Autonomous tool execution

---

### 📊 CRM Management

* Customer Management
* Contact Management
* Opportunity Tracking
* Deal Pipeline Management
* Activity History

---

### ⚡ Workflow Automation

Automates complete business workflows including:

* AI Lead Qualification
* Customer Scoring
* WhatsApp Follow-ups
* Task Creation
* CRM Updates
* Audit Logging

---

### 📥 Unified Communication Inbox

Single dashboard for managing:

* WhatsApp Conversations
* Email Threads
* Call Logs
* AI Conversations

---

### 🏢 Multi-Tenant SaaS Architecture

Every organization gets:

* Dedicated Workspace
* Secure Data Isolation
* Independent CRM
* Business-specific AI Context

---

### 🔐 Enterprise Security

* Google OAuth Authentication
* JWT Authentication
* Refresh Token Rotation
* HttpOnly Cookies
* Tenant Isolation
* Zod Input Validation
* Audit Logging
* Secure Prisma ORM Queries

---

# 🛠 Tech Stack

| Category       | Technology               |
| -------------- | ------------------------ |
| Frontend       | Next.js 14, React        |
| Styling        | Tailwind CSS             |
| Backend        | Next.js API Routes       |
| Database       | PostgreSQL               |
| ORM            | Prisma                   |
| Authentication | Google OAuth 2.0, JWT    |
| AI             | Gemini 1.5 Flash         |
| Validation     | Zod                      |
| Real-Time      | Server Sent Events (SSE) |
| Testing        | Vitest + Testing Library |

---

# 🏗 System Architecture

```text
                     User
                       │
                       ▼
             Next.js Frontend (React)
                       │
                       ▼
         Google OAuth Authentication
                       │
                       ▼
             JWT Session Verification
                       │
                       ▼
               AI Business Agent
                       │
      ┌────────────────┼────────────────┐
      ▼                ▼                ▼
 CRM Operations   WhatsApp Service   Workflow Engine
      │                │                │
      └────────────┬───┴────────────────┘
                   ▼
              Prisma ORM
                   │
                   ▼
            PostgreSQL Database
```

---

# 🔄 Complete Application Workflow

## 1. User Authentication

```text
User
   │
   ▼
Google OAuth Login
   │
   ▼
JWT Token Generated
   │
   ▼
Session Created
   │
   ▼
Tenant Identified
```

---

## 2. AI Conversation Flow

```text
User Prompt
     │
     ▼
AI Agent Receives Request
     │
     ▼
Load Business Context
     │
     ▼
Gemini Analysis
     │
     ▼
Function Calling Decision
```

---

## 3. Tool Execution Workflow

```text
User Request
      │
      ▼
Gemini Determines Tool
      │
      ▼
Execute Backend Function
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL
      │
      ▼
Return Result
      │
      ▼
Generate AI Response
      │
      ▼
Stream Response to User
```

---

## 4. Lead Qualification Workflow

```text
New Lead
    │
    ▼
Store in Database
    │
    ▼
Gemini Qualification
    │
    ▼
Lead Score Generated
    │
    ▼
Score > 80 ?
    │
 ┌──┴───────────────┐
 │                  │
No                 Yes
 │                  │
 ▼                  ▼
Store Lead    Send WhatsApp
                  │
                  ▼
          Create Follow-up Task
                  │
                  ▼
             Update CRM
                  │
                  ▼
            Create Audit Log
                  │
                  ▼
             Notify User
```

---

## 5. WhatsApp Communication Flow

```text
Customer Message
       │
       ▼
Webhook Triggered
       │
       ▼
AI Sentiment Analysis
       │
       ▼
Intent Detection
       │
       ▼
Conversation Summary
       │
       ▼
Next Best Action
       │
       ▼
Unified Inbox Updated
```

---

## 6. AI Agent Execution Flow

```text
User Query
      │
      ▼
Gemini AI
      │
Need Tool?
      │
     Yes
      │
      ▼
Execute Function
      │
      ▼
Database
      │
      ▼
Tool Result
      │
      ▼
Gemini Final Response
      │
      ▼
SSE Streaming
      │
      ▼
Frontend
```

---

# 🗄 Database Flow

```text
Frontend
     │
     ▼
API Routes
     │
     ▼
Zod Validation
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL
     │
     ▼
Response
```

---

# 🔒 Security Architecture

* Google OAuth Authentication
* JWT Access & Refresh Tokens
* Refresh Token Rotation
* HttpOnly Secure Cookies
* Tenant-based Authorization
* Zod Request Validation
* SQL Injection Protection via Prisma
* XSS Protection
* Audit Logging
* Environment Variable Based Secrets

---

# 📂 Project Structure

```text
app/
 ├── dashboard/
 ├── crm/
 ├── inbox/
 ├── simulator/
 ├── api/
 └── onboarding/

components/
 ├── Sidebar
 ├── ConsoleLayout
 ├── KPI Cards

lib/
 ├── ai/
 ├── auth/
 ├── validation/
 ├── whatsapp/
 ├── audit/

prisma/
 ├── schema.prisma
 └── seed.ts

tests/
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone <repository-url>
cd darexai
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

```bash
cp .env.example .env
```

Update your environment variables:

```env
DATABASE_URL=
GEMINI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=
```

---

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

---

## Start Development Server

```bash
npm run dev
```

---

# 🧪 Testing

```bash
npm test
```

---

# 🎯 Highlights

* AI Agent-first Architecture
* Multi-Tenant SaaS Design
* Secure JWT Authentication
* Google OAuth Integration
* Gemini Function Calling
* Workflow Automation
* WhatsApp Integration
* Unified Communication Inbox
* Real-time AI Streaming (SSE)
* Enterprise Security
* Audit Logging
* PostgreSQL + Prisma ORM

---

# 📈 Future Enhancements

* Email Provider Integration
* Telephony API Integration
* Redis-based Rate Limiting
* Role-Based Access Control (RBAC)
* Analytics Dashboard
* Multi-language AI Support
* Calendar Integration
* AI Workflow Builder

---



## 📌 Project Summary

DareXAI demonstrates how modern enterprises can leverage **Generative AI, intelligent automation, secure multi-tenant architecture, and real-time communication** to streamline business operations. By combining AI-driven decision-making with CRM workflows, secure authentication, and workflow orchestration, the platform serves as a production-ready foundation for next-generation AI business applications.

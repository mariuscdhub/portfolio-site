---
trigger: always_on
---


Goal: Build a production-ready, senior-level data dashboard web app that is calm, clear, and fast. This is a tool interface, not a marketing page.
Required Tech Stack (Opinionated)
Use this stack unless impossible:
Framework: Next.js 16 (App Router) + React 19 + TypeScript. (Leveraging the stable React Compiler).
AI Orchestration: Vercel AI SDK. (Essential for streaming LLM responses, tool calling, and handling UI states for AI).
Styling: Tailwind CSS v4.0. (Using the high-performance Oxide engine and native container queries).
Component System: shadcn/ui (Radix UI Primitives).
Data Layer: TanStack Query v5 (Client-side sync) + Next.js use cache (Server-side caching).
Data Grid: TanStack Table v8. (For complex logs, user lists, and analytics).
Validation & Forms: Zod + React Hook Form. (Unified validation for client inputs and Server Actions).
Database/ORM: Drizzle ORM. (Lighter and more "Edge-ready" than Prisma for 2025 serverless environments).
Authentication: Clerk or Auth.js v5. (Clerk for rapid RBAC deployment; Auth.js for self-hosted control).
Security: OWASP Top 10 (2025) + Rate Limiting (via Upstash/Redis for AI endpoints).
We will integrate the datasource from supabase
App Architecture Requirements
Use a single source of truth for data (API/database). The UI reads from query cache, not random component state.
Separate:
Server state (TanStack Query)
UI state (local component state)
Form state (React Hook Form)
Use Next.js App Router patterns for layout:
/app/(dashboard)/layout.tsx with persistent sidebar
route-level loading/error boundaries
server components for initial data where appropriate, client components for interactivity. Next.js+2Next.js+2
Design Frameworks to Apply (Non-negotiable)
Information Architecture (IA): Organize by user goals/decisions, not by features.
Cognitive Load Reduction: Reduce visual noise; make scanning effortless.
Progressive Disclosure: Default view is simple; advanced controls appear only when needed.
Perceived Performance: UI should feel instant via optimistic updates, skeletons, and non-blocking interactions.
UI/UX Specifications (Senior Bar)
1) Layout & Hierarchy
Strict grid; consistent spacing scale.
Main content dominates; navigation is visually quiet.
No oversized logos/banners. This is a tool.
2) Color & Token System
Neutral base + one accent used only for primary actions/highlights.
System colors:
red = error/destructive
green = success
Contrast must be readable. Never use color as the only indicator.
3) Navigation
Persistent left sidebar:
grouped links
clear active state
settings/logout at bottom
Top bar only for global page actions + global search (optional).
4) Tables (Core Dashboard Utility)
Use TanStack Table features:
Search + filters + sort
Pagination (client or server)
Row selection with bulk actions (selection reveals contextual toolbar)
Column visibility + responsive columns tanstack.com+1
5) Charts (Keep them Functional)
Only line and bar charts.
Always include axes, labels, values, gridlines.
Tooltips on hover.
Choose chart approach:
Use Recharts for simple “business dashboards”
Use ECharts if dataset is large/high-frequency updates
 (Prefer functional clarity over fancy visuals.) LogRocket Blog+2strapi.io+2
6) Interaction Patterns (Radix-backed)
Popover for small, non-blocking actions (display options, quick filters). radix-ui.com
Dialog/Modal for complex or blocking flows (create/edit item). radix-ui.com
Toast notifications for success/error/warning.
Optimistic UI for common mutations:
immediate UI update, rollback on failure
use TanStack Query optimistic updates or React’s useOptimistic pattern tanstack.com+1
7) States & Trust (Must be designed)
For every data region/component, implement:
Loading (skeletons)
Empty state (clear CTA)
Error state (recoverable, retry)
Success confirmation (toasts)
 Users should never wonder “did that work?”
Data Layer Requirements (Be Explicit)
Define:
Data entities (e.g., Users, Projects, Links, Events, Metrics)
Which endpoints power which cards/tables/charts
Refresh strategy:
polling vs websocket vs manual refresh
Caching rules:
stale time, refetch on focus, invalidation on mutation (TanStack Query)
Security & “Responsible App” Defaults
Enforce RBAC/permissions server-side (not just UI hiding).
Validate all inputs with Zod on server.
Avoid exposing secrets to client.
Add basic audit logging hooks for key actions (create/update/delete).
Follow OWASP Top 10 mindset: secure defaults, least privilege, safe error handling. OWASP+1
Deliverables (What you must output)
A working Next.js dashboard app scaffold:
routes, layout, sidebar, top actions
One “Dashboard Overview” page with:
KPI cards
a table with filtering/sorting/selection + bulk actions
a line chart + bar chart
A “Create/Edit” flow:
modal dialog form with validation + toast + optimistic update
Fully implemented loading/empty/error states
Clean, consistent component patterns and tokens
Final Quality Gate
Understandable in <10 seconds
Calm, professional, data-first
Accessible keyboard navigation (Radix primitives help here) radix-ui.com+1
Fast-feeling interactions (optimistic updates + good loading UX)

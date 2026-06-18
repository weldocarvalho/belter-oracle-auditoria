# Architectural Decision Record: Frontend Framework Selection

## Status
ACCEPTED

## Context
We need to select a primary frontend technology stack for our micro-SaaS client application. The platform requires a highly interactive, fast onboarding flow (including camera access and real-time canvas overlays) alongside optimized, public-facing marketing landers and educational content for the Brazilian market.

---

## Decision
We chose **Next.js (App Router, TypeScript, TailwindCSS, Shadcn/UI)** as the core frontend stack.

---

## Justification & Core Principle Mapping

### 1. Financial Optimization (Principle 4: Low Operational Costs)
*   **Static Assets & Edge Caching:** Marketing and landing pages can be fully pre-rendered and cached at the CDN edge (e.g., Cloudflare, Vercel). This reduces compute demands on our servers to practically zero for non-authenticated traffic.
*   **Zero-Cost Hosting Scale:** The initial product deployment fits entirely within standard edge computing free tiers before needing commercial scaling.

### 2. Market and Engineering Standards (Principles 2 & 3)
*   **Ecosystem Dominance:** Next.js is the enterprise and startup standard for React applications. Utilizing TypeScript alongside modern state management guarantees structured, professional engineering patterns.
*   **Design Velocity:** The combination of TailwindCSS and Shadcn/UI allows us to build an incredibly polished, accessible, premium aesthetic interface rapidly without wasting time writing custom utility CSS components.

### 3. AI Coprocessing Velocity (Principle 5: AI-Friendly)
*   **Convention Over Configuration:** Next.js App Router enforces explicit folder and file structure standards (`page.tsx`, `layout.tsx`, `loading.tsx`). AI development assistants understand these paradigms deeply, translating into rapid, high-quality feature generation with minimized prompt context.

---

## UX Implications for Phase 1 (AI Photo-Scoring)

Next.js provides seamless integration with client-side Web APIs critical for our onboarding:
*   **`HTML5 MediaDevices API`:** Low-latency native camera access right inside React components.
*   **Responsive Dynamic States:** Native handling of real-time multi-step onboarding forms, loading screen state micro-interactions, and instant client-side cropping interfaces.

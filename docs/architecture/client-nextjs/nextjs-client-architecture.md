# Repository Guide: Next.js Client Architecture & Configuration

## Status
ACCEPTED

## Context
We need to establish a highly structured, scalable, and AI-friendly Next.js layout using the App Router. The goal is to maximize performance, enable seamless component generation via AI coding assistants, and cleanly handle protected application routes vs public marketing surfaces.

---

## 1. Directory Blueprint (Feature-Driven Architecture)

Instead of grouping files by generic types (like putting all components in one massive folder), group them by **Domain Features**. This approach is highly logical and dramatically increases AI generation accuracy because all contextual code lives together.

```text
src/
├── app/                      # Next.js App Router (Routing Layer Only)
│   ├── (marketing)/          # Unauthenticated Group (Landing, Pricing)
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── (auth)/               # Authentication Layout (Login, Consent)
│   │   └── login/page.tsx
│   └── (dashboard)/          # Protected Functional Workspace
│       ├── onboarding/       # Multi-step survey and camera flow
│       │   └── page.tsx
│       └── tracking/         # Skin results history dashboard
│           └── page.tsx
├── components/               # Global Shared UI Components (Design System)
│   ├── ui/                   # Shadcn/ui atomic raw primitives (Button, Dialog)
│   └── shared/               # Cross-cutting UI components (Navbar, Sidebar)
├── features/                 # Domain-Driven Core Modules (Business Logic)
│   ├── photo-scoring/        # Isolated AI Photo-Scoring Module
│   │   ├── components/       # Feature-specific items (CameraCapture.tsx)
│   │   ├── hooks/            # useCamera.ts, useWebSocketAnalysis.ts
│   │   ├── services/         # api.ts (handles R2 presigned calls)
│   │   └── types.ts          # Feature data contracts
│   └── treatment-plan/       # Isolated Protocol Module
└── lib/                      # Core Shared Utilities (Fetch clients, formatting)
```

---

## 2. Core Architecture Rules

### Rule A: The 80/20 Server vs. Client Component Rule
*   **Server Components (Default):** Use for layout shells, public marketing pages, and content data fetching. This eliminates heavy JavaScript bundles from reaching the user's browser, maximizing performance and loading speed.
*   **Client Components (`"use client"`):** Use strictly at the **leaf nodes** of your component tree where user interaction is mandatory (e.g., camera streams, canvas drawing masks, interactive graphs, forms). Keep client states isolated to prevent broad component re-rendering cycles.

### Rule B: Clean BFF Data Integration Patterns
Next.js should never talk directly to your PostgreSQL database to protect system isolation layers. Data flows exclusively via two explicit patterns:

1.  **Server-Side Fetching (Read Actions):** Use standard native `fetch()` calls inside Next.js Server Components directly to your NestJS BFF. Take advantage of Next.js fetch caching mechanisms to offload request pressure from the NestJS server.
2.  **Client-Side Actions (Interactive Actions):** Use lightweight client-side API calls (via `fetch` or `axios`) inside components to push mutations (such as requesting a secure R2 presigned upload URL or updating settings) to the NestJS API.

---

## 3. Configuration & Optimization Matrix

### Tailwind & Shadcn/UI (Design Speed)
*   Initialize using standard configuration structures.
*   Enforce a strict CSS variable color system. This makes it trivial for AI tools to generate new application layouts that instantly match your brand look without hardcoding individual hexadecimal values.

### ESLint & TypeScript Formatter (Engineering Standards)
Enforce strict TypeScript verification configurations within your `tsconfig.json` to guarantee production safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "target": "ES2022"
  }
}
```

### Low-Cost Deployment Strategy
*   **Option 1 (Zero Config):** Deploy on **Vercel** or **Netlify** using their free hobby tiers for rapid development tracking.
*   **Option 2 (Lowest long-term scale cost):** Compile the project utilizing standalone outputs (`output: 'standalone'` inside `next.config.js`). This bundles the client into a highly optimized, ultra-light Docker container ready to run on any cheap VPS node alongside your NestJS API and RabbitMQ instance.

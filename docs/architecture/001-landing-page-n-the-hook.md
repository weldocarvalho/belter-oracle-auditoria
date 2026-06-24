## Architectural Decision Record & Technical Specification
Document ID: docs/architecture/01-phase-1-hook.md
Status: DRAFT
Context: Phase 1: O "Gancho" (The Hook) Implementation
Domain: Frontend (Next.js BFF), Backend (NestJS), Data Architecture
------------------------------
## 1. Context & Business Drivers
Phase 1 represents the initial top-of-funnel conversion layer for the Brazilian aesthetics market. Because medical-aesthetic and cellulite treatments carry high psychological friction and trust boundaries, this phase enforces a zero-friction onboarding policy.
## Core Drivers

* Low Friction: No photos, deep diagnostics, or payment requests are permitted during this phase.
* High Performance: Mobile-first optimization tailored for Instagram/TikTok in-app browsers (WebView).
* Low Operational Cost: Minimize database and compute overhead using lightweight authentication mechanisms and stateless tracking before data amplification occurs in Phase 2.

------------------------------
## 2. Visual Token Architecture
The user interface implements a premium, clinical-grade aesthetic. The following color tokens must be mapped into tailwind.config.js and exposed via CSS custom variables inside the Shadcn/UI theme configuration. [1] 

:root {
  /* Core Brand Palette */
  --background: 40 30% 98%;       /* #FDFBF7 - Soft Cream */
  --foreground: 140 10% 15%;      /* Dark Sage Charcoal for readability */
  
  --primary: 133 16% 85%;         /* #D1E0D4 - Soft Sage Green (Dermatological Trust) */
  --primary-foreground: 140 10% 10%;
  
  --accent: 6 43% 83%;            /* #E8C5C1 - Pastel Rose Gold (Premium Commercial CTA) */
  --accent-foreground: 6 40% 20%;
  
  --muted: 42 28% 87%;            /* #EAE3D2 - Sand Neutral (Cards & Background Fills) */
  --muted-foreground: 42 10% 40%;
  
  --info: 189 44% 89%;             /* #D4EDF1 - Aqua Blue (Hydration & Tech Indicators) */
}

------------------------------
## 3. System Architecture & Data Flow

[Mobile Client (Next.js)] ──(POST /api/v1/auth/register)──> [BFF (NestJS)]
         │                                                      │
         │ (Sets Stateless Session JWT)                        ├──(Write)──> [PostgreSQL]
         ▼                                                      │
[Redirect to Phase 2 Quiz] <───────────────────────────────────└──(Cache)──> [Redis]

## Protocol Steps

   1. Request Ingestion: Next.js handles Google/Apple OAuth initialization or captures a raw email format.
   2. BFF Processing: NestJS sanitizes the input, performs rate-limiting checks, passes creation commands to PostgreSQL, and provisions a lightweight session footprint inside Redis.
   3. State Transition: The client receives an authorization token cookie and immediately pivots to Phase 2 (/onboarding/diagnostic) without standard system page reloads.

------------------------------
## 4. Interface Contracts (API Specification) [2] ## 4.1 Authentication & Lead Registration

* Endpoint: POST /api/v1/auth/register
* Rate Limit: Max 5 requests per 60 seconds per IP address.
* Payload (JSON):

{
  "email": "user@domain.com.br",
  "authProvider": "magic-link", 
  "utmSource": "instagram_ads",
  "utmCampaign": "cellulite_protocol_01"
}


* Success Response (201 Created):

{
  "userId": "d3b07384-d113-4c4e-9c8e-cfc49bf670d4",
  "onboardingStatus": "initialized",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "redirectTo": "/onboarding/diagnostic"
}

------------------------------
## 5. Database Schema (PostgreSQL DDL)
To maintain structural clarity and data tracking capabilities, the users table tracks lead origins from Phase 1.

CREATE TYPE onboarding_stage AS ENUM ('initialized', 'quiz_completed', 'paid', 'active');CREATE TYPE auth_provider_type AS ENUM ('magic-link', 'google', 'apple');
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    provider auth_provider_type NOT NULL DEFAULT 'magic-link',
    status onboarding_stage NOT NULL DEFAULT 'initialized',
    
    -- AI/Analytics Context Tracking
    utm_source VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);CREATE INDEX idx_users_status ON users(status);

------------------------------
## 6. Engineering Decisions & Constraints## 6.1 Authentication Method

* Decision: Leverage a unified passwordless sign-up flow (Magic Link) alongside OAuth hooks (Google/Apple).
* Rationale: Eliminates password creation screens, preventing conversion drops on mobile web views where password managers may fail to trigger correctly.

## 6.2 Cache Optimization (Redis)

* Decision: Active Phase 1 user sessions must be cached in Redis with a Time-To-Live (TTL) of 24 hours.
* Rationale: Protects PostgreSQL from read-heavy verification requests during rapid page flips as the user transitions directly into the interactive quiz in Phase 2.

## 6.3 AI-Friendly Logging Hook

* Decision: Every landing page initialization triggers an anonymized structured entry in the system logs.
* Rationale: Allows downstream analytics tools or local data models to automatically map out traffic drops between registration and the submission of the first quiz question.

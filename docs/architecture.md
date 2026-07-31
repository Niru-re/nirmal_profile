# Project Architecture

> 🏗️ System context, request lifecycle, data flow, and component hierarchy for the Nirmaan Portfolio platform.

---

## 1. System Context (C4 Level 1)

```
                          ┌──────────────────────────────────────┐
                          │             Portfolio Users           │
                          │   (Recruiters, Clients, Visitors)    │
                          │   Browsers, Mobile, Search Engines   │
                          └──────────────────┬───────────────────┘
                                             │
                               HTTPS / TLS 1.3 · HSTS
                                             │
                          ┌──────────────────▼───────────────────┐
                          │           Vercel Global Edge         │
                          │  CDN · Edge Runtime · DDoS Shield    │
                          │  Image Optimization · Caching Layer  │
                          └──────────────────┬───────────────────┘
                                             │
                          ┌──────────────────▼───────────────────┐
                          │         Next.js 16 App Router        │
                          │  (Server Components + Client CC)     │
                          └──┬───────────────────┬───────────────┘
                             │                   │
                    Server-side          Client-side
                    supabase/ssr        @supabase/supabase-js
                     (cookies)           (events + storage)
                          └──────────────────┬───────────────────┘
                                             │
                          ┌──────────────────▼───────────────────┐
                          │          Supabase Cloud BaaS         │
                          │ ┌──────────┬───────────┬──────────┐  │
                          │ │PostgreSQL│  Storage  │   Auth   │  │
                          │ └──────────┴───────────┴──────────┘  │
                          └──┬───────────────────────┬───────────┘
                             │                       │
              Analytics Telemetry          (Future) Edge Functions
                             │                       │
             ┌───────────────▼───────────────────────▼─────────┐
             │   Microsoft Clarity  ·  Google Analytics 4      │
             │   (Session Replay, Heatmaps, Traffic)           │
             └─────────────────────────────────────────────────┘
```

---

## 2. Layered Architecture (C4 Level 3 — Container)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                            │
│  Next.js App Router · Layouts · Pages · Client Components              │
│  ┌────────┐ ┌──────────┐ ┌───────────┐ ┌────────┐ ┌─────────────────┐  │
│  │ Layout │ │  Pages   │ │  Nav/Foot │ │  Hero  │ │ ProjectCard / … │  │
│  └────┬───┘ └────┬─────┘ └─────┬─────┘ └────┬───┘ └────────┬────────┘  │
│       │         │              │             │              │            │
│       └─────────┴──────────────┴─────────────┴──────────────┘            │
│                    Design Tokens (globals.css · Tailwind v4)             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ use / import
┌────────────────────────────────────▼────────────────────────────────────┐
│                           COMPOSITION LAYER                             │
│  Shared components · Providers · Animation primitives · UX patterns     │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────────────┐   │
│  │  GlassCard +   │  │  Analytics (CC)  │  │   Framer Motion Variants│   │
│  │  Reveal / Rvl  │  │  SmoothScroll    │  │   (fadeInUp, blurRvl…)  │   │
│  └────────┬───────┘  └────────┬─────────┘  └────────────┬────────────┘   │
│           │                   │                          │                 │
└───────────┴───────────────────┴──────────────────────────┴─────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                           DOMAIN / DATA LAYER                           │
│  Typed collections · Queries · Interfaces · Validators                  │
│  ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌───────────────────┐  │
│  │ projects   │ │ categories │ │ certificates │ │ experience/stats  │  │
│  └─────┬──────┘ └─────┬──────┘ └──────┬───────┘ └────────┬──────────┘  │
│        │              │                │                   │             │
│  ┌─────▼──────┐ ┌─────▼──────┐ ┌──────▼───────┐ ┌────────▼──────────┐  │
│  │ getBySlug  │ │ getBySlug  │ │  array[T]    │ │  skills / educat. │  │
│  │ featured() │ │  …etc      │ │              │ │                   │  │
│  └────────────┘ └────────────┘ └──────────────┘ └───────────────────┘  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                           INFRASTRUCTURE LAYER                          │
│  SDK wrappers · Utils · Environment · 3rd-party integrations            │
│  ┌───────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │  Supabase (SSR)   │  │     Utils (lib/*)    │  │  Constants       │  │
│  │  client.ts +      │  │  cn, formatDate,     │  │  SITE_CONFIG,    │  │
│  │  server.ts        │  │  formatCurrency      │  │  NAV_LINKS       │  │
│  └───────────────────┘  └──────────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Request Execution Flow

```
  USER OPENS https://nirmaan.dev/projects/enterprise-analytics-platform
                               │
                               ▼
 1.  VERCEL EDGE
     ├─ DNS resolves to nearest Vercel POP
     ├─ TLS handshake, HSTS enforced
     ├─ CDN cache check (ISR / static assets)
     └─ Edge Middleware (if present) — auth, A/B, redirects
                               │
                               ▼
 2.  NEXT.JS APP ROUTER — ROUTE MATCHING
     ├─ Matches file-tree route: src/app/projects/[slug]/page.tsx
     ├─ Parses params: { slug: "enterprise-analytics-platform" }
     ├─ Checks `generateStaticParams()` (optional pre-render)
     └─ Applies Metadata (metadata export on layout + page)
                               │
                               ▼
 3.  ROOT LAYOUT  (src/app/layout.tsx)  ← ALWAYS RUNS FIRST
     ├─ <html lang="en"> with font variables (Geist, Space Grotesk)
     ├─ <body> + SmoothScroll Lenis wrapper
     ├─ BackgroundGradient decorative layer
     ├─ Navbar (Client Component: "use client")
     ├─ <main> — placeholder for nested page ←───────────┐
     ├─ Footer (Client Component)                         │
     └─ AnalyticsProvider (CC: Clarity + GA4 lazy load)   │
                               │                           │
                               ▼                           │
 4.  NESTED LAYOUTS (if any — none here in v1)            │
                               │                           │
                               ▼                           │
 5.  PAGE COMPONENT  (Server Component by default)        │
     ├─ Calls getProjectBySlug(slug)                       │
     ├─ Data is in-memory → no I/O wait                    │
     ├─ (Future) Supabase server call via lib/supabase/    │
     ├─ Builds the JSX tree, using:                        │
     │   ├─ SectionHeader, Reveal, GlassCard               │
     │   ├─ UI primitives: Badge, Button                   │
     │   └─ Screenshot gallery w/ Image                    │
     └─ Result → RSC payload (JSON + streamed HTML) ──────┘
                               │
                               ▼
 6.  RSC STREAMING + HYDRATION
     ├─ Server streams rendered HTML in Flush chunks
     ├─ Client receives HTML (FCP)
     ├─ Interleaved RSC payload patches DOM
     └─ "use client" boundary components hydrate
                               │
                               ▼
 7.  CLIENT COMPONENTS ACTIVATE
     ├─ Framer Motion: Reveal animations register IntersectionObserver
     ├─ Navbar: scroll listener → glass effect
     ├─ ProjectCard: 3D tilt mouse listeners
     ├─ Lenis smooth scroll takes over wheel events
     ├─ AnalyticsProvider: lazy-loads Clarity / GA4 snippets
     └─ (If form) React Hook Form + Zod schema activate on first input
                               │
                               ▼
 8.  USER INTERACTION LOOP
     ├─ Click / Scroll / Hover → Client Component handlers
     ├─ Client navigation via <Link> → RSC fetch of next page data
     ├─ (If contact submit) → fetch POST /api/contact
     │   └─ Route Handler → Supabase insert → toast UI
     └─ Clarity / GA4 events fire (page_view, click, scroll depth)
```

---

## 4. Data Flow (Write Path: Contact Submission — extensible path)

```
   USER
    │ fills out contact form on /contact
    ▼
 ┌─ ContactForm (Client Component) ─────────────────────────────────────┐
 │  1. onChange → React state / RHF                                      │
 │  2. onSubmit → Zod validates {name, email, subject, message}          │
 │     ├─ ✅ Pass  → continue                                            │
 │     └─ ❌ Fail  → inline field errors, return                         │
 │  3. UI: Button → loading spinner (aria-busy=true)                     │
 │  4. fetch('/api/contact', { method: 'POST', body: JSON.stringify(…) })│
 └───────────────────────────────┬──────────────────────────────────────┘
                                 │ fetch
                                 ▼
 ┌─ /api/contact/route.ts  (Route Handler — runs server-side) ──────────┐
 │  5. Validates again (never trust the client)                          │
 │  6. Rate-limiting check (Upstash / custom)                            │
 │  7. createClient() → server-side Supabase                             │
 │  8. supabase.from('contact_submissions').insert(payload)              │
 │  9. (Optional) Resend / SMTP email to hello@nirmaan.dev               │
 └───────────────────────────────┬──────────────────────────────────────┘
                                 │ Response JSON { ok: true, id }
                                 ▼
 ┌─ ContactForm (Client Component) ─────────────────────────────────────┐
 │  10. Await resolves                                                    │
 │  11. ✅ Success → Toast: "Message sent! I'll reply within 24h."        │
 │           └─ Reset form, scroll to top of card                        │
 │  12. ❌ Fail    → Toast: "Something went wrong. Try emailing directly."│
 │           └─ Keep form values, allow retry                             │
 └───────────────────────────────┬──────────────────────────────────────┘
                                 │ state change
                                 ▼
                          UI re-render with result
```

---

## 5. Component Hierarchy (Composition Tree)

```
                        ┌──────────────────────┐
                        │    Root Layout.tsx   │
                        │   (Server Default)   │
                        └──────────┬───────────┘
          ┌────────────────────────┼─────────────────────────┐
          │                        │                         │
          ▼                        ▼                         ▼
 ┌──────────────────┐   ┌───────────────────┐   ┌─────────────────────────┐
 │ SmoothScroll (C) │   │ BackgroundGradient│   │    AnalyticsProvider    │
 │  (Lenis wrapper) │   │  (decorative CC)  │   │  (Clarity + GA4 CC)     │
 └──────────────────┘   └───────────────────┘   └─────────────────────────┘
          │
          ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │ ┌─────────────────────────┐         ┌───────────────────────────┐   │
 │ │ Navbar ("use client")   │         │ Footer ("use client")     │   │
 │ │  ├ Logo / Home Link     │         │  ├ Brand + tagline        │   │
 │ │  ├ Desktop NAV_LINKS    │         │  ├ Navigation columns     │   │
 │ │  ├ Mobile Menu (Dialog) │         │  └ Social links + © year  │   │
 │ │  └ Search Dialog trigger│         └───────────────────────────┘   │
 │ └─────────────────────────┘                                         │
 │                                 │                                   │
 │                                 ▼                                   │
 │                   ┌───────────────────────────┐                     │
 │                   │   <main> → Page (per route)│                     │
 │                   └─────────────┬─────────────┘                     │
 │                                 │                                   │
 │       ┌───────────────┬─────────┴─────────┬──────────────────┐     │
 │       ▼               ▼                   ▼                  ▼     │
 │  / Home         / Projects           / About             / Contact │
 │  ├ Hero          ├ Filters + Grid    ├ Bio               ├ Form    │
 │  ├ Stats         └ [slug] Detail     ├ Skills            └ Toast   │
 │  ├ FeaturedProj    ├ Screenshots     ├ Education                   │
 │  ├ Services CTA    ├ Tech chips      └ Resume CTA                  │
 │  └ Contact CTA     ├ Features + Arch                                 │
 └─────────────────────└ Challenges / Links ───────────────────────────┘
```

> **Legend:**
> - `(Server Default)` — No "use client" directive — rendered on the server by default.
> - `(CC)` — Marked `"use client"`: has event handlers, state, hooks, animation libraries.
> - Indentation = parent → child composition.

---

## 6. Frontend ↔ API ↔ Supabase ↔ DB ↔ Storage ↔ Auth ↔ Analytics ↔ Deployment

This section follows the numbered stack requested in the architecture prompt.

```
 1. FRONTEND
    │ Browser, Mobile, Crawler
    │ HTML/CSS/JS + React 19
    │ Semantic tags, ARIA, SEO metadata
    ▼
 2. NEXT.JS 16 (Presentation + Routing + Edge)
    │ App Router, RSC/CC split
    │ Layouts, Metadata, Font Optimization, Image Optimization
    │ ISR / SSR / Static generation per-route
    ▼
 3. API (Route Handlers + Server Actions — extensible)
    │ /api/* route.ts files
    │ Server-only validation, rate limiting, CORS
    │ ↕️ Async communication to/from Supabase
    ▼
 4. SUPABASE (Backend-as-a-Service Platform)
    │ Single project reference, one REST endpoint
    │ PostgREST → Postgres, Storage API → S3-compatible bucket, GoTrue → JWTs
    ▼
 5. DATABASE  (PostgreSQL 15+)
    │ Tables: contact_submissions, projects, categories, certificates, …
    │ Row Level Security (RLS) policies on user-scoped rows
    │ Views, Materialized views for analytics
    ▼
 6. STORAGE (Supabase Storage — S3-compatible)
    │ Public bucket: project screenshots, video thumbnails, cert images
    │ Private bucket: (Future) admin uploads, resumes
    │ Signed URLs for time-limited access
    ▼
 7. AUTHENTICATION (Supabase GoTrue — reserved for v2 Admin)
    │ Email/Password, OAuth (GitHub, Google)
    │ JWT sessions, RLS integration
    │ Middleware-level session verification for /admin routes
    ▼
 8. ANALYTICS (Client-side lazy-loaded providers)
    │ Microsoft Clarity: Session Replay + Heatmaps + Dead clicks
    │ Google Analytics 4: Page views, Events, Audiences
    │ Vercel Web Analytics + Speed Insights (optional toggle)
    ▼
 9. DEPLOYMENT (Vercel Platform)
    │ Git-based Deploy Hooks
    │ Preview Deployments per PR
    │ Production / Staging environments
    │ Custom domain, Automatic HTTPS, Edge Caching, ISR Revalidation
    │ Analytics + Speed Insights natively integrated
```

---

## 7. Technology Justification (Why this stack?)

| Component | Why this choice, not X? |
|-----------|-------------------------|
| **Next.js 16** | Full-stack SSR/ISR/RSC built-in. App Router + native streaming + Edge. Vercel-native → zero-config deploy. Avoided plain React SPA because of poor SEO; avoided Remix/Nuxt because Supabase + Vercel + Next combo has the richest production ecosystem. |
| **React 19** | Ships with `use` hook, Server Actions, Actions (form primitives), and improves RSC model. Required by Next 16. |
| **TypeScript Strict** | Catches bugs before they reach production. Refactors safely. IntelliSense for data layer (especially typed Project/Category interfaces). |
| **Tailwind CSS 4** | Zero-JS-config. Design tokens via `@theme inline` → variables live in globals.css and are accessible to both Tailwind utilities AND arbitrary CSS. Avoids style-specific build pipeline. Faster than v3 in Next 16 + Turbopack. |
| **Framer Motion** | Declarative, interruptible animations. `whileInView` + variants = perfect for reveal-on-scroll portfolio. Avoided plain CSS keyframes because motion needs IntersectionObserver + orchestration. |
| **GSAP** | Loaded for micro-interactions where FM's React-centric model is less ergonomic (scroll-based scrubbing, timeline sequences). Kept lean via `optimizePackageImports`. |
| **Lenis** | Smooth scroll wrapper that preserves native scroll behavior (critical for accessibility). Replaces deprecated locomotive-scroll. |
| **Supabase** | Postgres + Auth + Storage in one box. Row Level Security. Free tier generous for portfolio. Avoided Firebase because SQL is more portable and portfolio data is relational by nature. |
| **Radix UI Primitives** | WCAG-compliant unstyled primitives (Dialog, Button-Slot, Label, etc.). Used underneath custom `components/ui/`. Design freedom + accessibility baked in. Avoided Material/Ant Design because they carry opinionated CSS and are hard to make look premium. |
| **Lucide** | MIT-licensed, consistent, tree-shakeable. One icon = one component. Avoided Heroicons because Lucide set covers more edge cases. |

---

*Architecture doc version: 1.0 · Updated: 2025-07-31*

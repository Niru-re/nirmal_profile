# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025-07-31

### ✨ Added

- **Initial public release** of the Nirmaan Portfolio platform
- Next.js 16 App Router with Server Components & Client Components
- Premium dark-mode design system with glassmorphism & gradient accents
- Typography stack: Geist Sans + Geist Mono + Space Grotesk (via `next/font`)
- **Pages:**
  - Home (`/`) — Hero, Stats, Featured Projects, Services CTA, Contact CTA
  - About (`/about`) — Bio, Skills, Education
  - Projects (`/projects`) — filterable grid with detail page (`/projects/[slug]`)
  - Categories (`/categories`) — taxonomy index + per-category page (`/categories/[slug]`)
  - Videos (`/videos`) — product demo video showcase
  - Certificates (`/certificates`) — credential gallery with verification links
  - Experience (`/experience`) — career timeline + skills matrix
  - Services (`/services`) — offering cards, pricing, feature lists
  - Contact (`/contact`) — contact form (validation-ready, Supabase-extensible)
  - Custom 404 (`/not-found`)
- **Animations & UX:**
  - Framer Motion reveal-on-scroll (`fadeInUp`, `blurReveal`, `scaleIn`, etc.)
  - 3D tilt effect on project cards
  - Smooth momentum scrolling via Lenis
  - Magnetic micro-interactions on primary CTAs
  - GSAP-compatible architecture for future timeline animations
- **Component libraries:**
  - `components/ui/` — shadcn-style primitives: Button, Card, Badge, Input, Textarea
  - `components/shared/` — Reusable: GlassCard, Reveal, GradientText, MagneticButton, SectionHeader, ProjectCard, SearchDialog
  - Feature-specific: Home, Services, Experience, Certificates, Videos, Contact, Layout
- **Typed data layer** (`src/data/*.ts`):
  - Projects, Categories, Certificates, Videos, Experience, Services
  - Helper queries (`getProjectBySlug`, `getFeaturedProjects`, `getProjectsByCategory`, etc.)
- **SEO & Metadata:**
  - Root layout metadata + per-page metadata patterns
  - OpenGraph + Twitter Card tags
  - Auto-generated `sitemap.xml` (all routes + projects + categories)
  - `robots.txt` with sitemap directive
- **Backend integration:**
  - Supabase SSR browser client (`@supabase/ssr`)
  - Supabase SSR async server client with cookie handling
- **Analytics:**
  - Conditional loading for Microsoft Clarity (`NEXT_PUBLIC_CLARITY_ID`)
  - Conditional loading for Google Analytics 4 (`NEXT_PUBLIC_GA_ID`)
- **Security & performance:**
  - Optimized Next.js config (security headers, image formats, package import optimization)
  - Font self-hosting, responsive `<Image>` usage patterns
  - Radix UI accessibility primitives
- **DX & Build:**
  - Strict TypeScript (`strict: true` in tsconfig)
  - ESLint 9 flat config with Next.js Core Web Vitals + TypeScript presets
  - Tailwind CSS 4 via PostCSS with design-token system
  - Path alias `@/*` → `src/*`
  - npm scripts: `dev`, `build`, `start`, `lint`, `lint:fix`, `typecheck`, `clean`
- **Documentation:**
  - Full premium README with badges, screenshots, roadmap, FAQ
  - Community files: CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY
  - `docs/` handbook: architecture, folder structure, components, API, deployment, Vercel, GitHub, maintenance

### 🛡️ Security

- No `console.log` statements in source code
- All `.env*` files ignored by default except `.env.example`
- Service-role Supabase key marked as server-only (not prefixed with `NEXT_PUBLIC_`)
- Security headers configured in `next.config.ts` (X-Content-Type-Options, X-Frame-Options, Permissions-Policy, etc.)

### 📝 Documentation

- README includes badges, tech stack, architecture ASCII diagram, folder tree, screenshots, roadmap, FAQ, acknowledgements
- 9 x specialized docs under `docs/`

---

## Versioning Strategy

| Code Status                          | Git Branch         | Version Tag |
|--------------------------------------|--------------------|-------------|
| Unstable, in-progress development    | `main` / feature   | `x.y.z-dev` |
| Release candidate (feature freeze)   | `release/x.y.z`    | `x.y.z-rc.N`|
| Production release                   | `main` (tagged)    | `x.y.z`     |
| Hotfix on production                 | `hotfix/issue-N`   | `x.y.(z+1)` |

### Types of Changes

Sections used in each release entry:

- **Added** — new features, pages, components, dependencies
- **Changed** — breaking or non-breaking behavior changes to existing features
- **Deprecated** — features flagged for removal in a future release
- **Removed** — features, dependencies, or files removed
- **Fixed** — bug fixes, regression patches
- **Security** — vulnerability patches, security hardening
- **Performance** — latency, bundle size, or memory improvements
- **Documentation** — README, guides, code comments

<div align="center">

![Nirmaan Portfolio](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20premium%20portfolio%20banner%20with%20purple%20cyan%20blue%20gradient%20glow%20geometric%20shapes%20and%20letter%20N%20logo%20minimalist%20enterprise%20aesthetic&image_size=landscape_16_9)

# Nirmaan — Portfolio Website

[![Next.js](https://img.shields.io/badge/Next.js-16.2.12-black?logo=next.js&logoColor=white&style=for-the-badge)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white&style=for-the-badge)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?logo=vercel&logoColor=white&style=for-the-badge)](https://vercel.com)
[![License](https://img.shields.io/github/license/Niru-re/nirmal_profile?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-purple?style=for-the-badge)](#)
[![Stars](https://img.shields.io/github/stars/Niru-re/nirmal_profile?style=for-the-badge&logo=github)](#)

**Enterprise-grade portfolio website built with Next.js 16, featuring projects, services, certificates, and a premium dark-mode aesthetic.**

[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Getting Started](#-getting-started) •
[Documentation](#-documentation) •
[Deploy](#-deployment) •
[Live Demo](https://nirmaan.dev)

</div>

---

## 👋 Introduction

**Nirmaan Portfolio** is a production-ready, open-source portfolio platform built for developers, designers, and engineers who demand a premium, enterprise-quality digital presence. The codebase follows a clean, feature-based architecture with strict TypeScript type safety, Framer Motion animations, and a glassmorphism dark-mode design system.

This project is designed to be **forkable, customizable, and maintainable** — the documentation below reflects how a senior engineering team at a top technology company would document, ship, and maintain an open-source repository.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⚡ **Next.js 16 App Router** | Server Components, streaming, edge-ready routing, Turbopack |
| 🎨 **Premium Design System** | Glassmorphism, gradient accents, Space Grotesk + Geist typography |
| 🌗 **Dark Mode First** | Optimized dark palette with purple → blue → cyan gradient system |
| 🎬 **Buttery Animations** | Framer Motion reveal effects, 3D tilt cards, Lenis smooth scroll |
| 📁 **Project Showcase** | Filterable projects with dynamic detail pages, categories, tech stacks |
| 🎥 **Video Showcase** | Embedded product demos with thumbnails and metadata |
| 🏆 **Certificates Gallery** | Credential display with verifications, issuers, and skill tags |
| 📈 **Experience Timeline** | Interactive career timeline with achievements & responsibilities |
| 💼 **Services Pricing** | Service cards with pricing, features, and technology breakdowns |
| 📬 **Contact Form** | Form with validation, Supabase-backed persistence (extensible) |
| 🔍 **Global Search** | Command palette search across projects and categories |
| 📊 **SEO Optimized** | Dynamic metadata, OpenGraph tags, sitemap.xml, robots.txt |
| 🔒 **Type Safe** | Strict TypeScript, Zod-ready validation patterns, Radix primitives |
| 📱 **Fully Responsive** | Mobile-first layouts, touch-optimized interactions, desktop polish |
| 🚀 **Vercel Ready** | One-click deploy, optimized headers, image AVIF/WebP formats |
| 📈 **Analytics Built-in** | Microsoft Clarity + Google Analytics 4 conditional loading |

---

## 🛠️ Tech Stack

### Core Framework

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 16.2.12 | Full-stack React meta-framework (App Router, RSC, Edge) |
| **UI Library** | React | 19.2.4 | Component model & rendering runtime |
| **Language** | TypeScript | ^5 | Static type checking & developer tooling |
| **Styling** | Tailwind CSS | ^4 | Utility-first CSS with design token system |
| **CSS Engine** | PostCSS | — | Tailwind processing & CSS variable pipeline |

### UI & Components

| Package | Purpose |
|---------|---------|
| **Radix UI** (Dialog, Accordion, Select, etc.) | Accessible, unstyled primitive components |
| **class-variance-authority** | Variant type system for reusable components (e.g., Button variants) |
| **clsx + tailwind-merge** | `cn()` utility for conflict-free conditional classnames |
| **lucide-react** | Consistent, tree-shakeable icon set (1.28+) |
| **next-themes** | Theme persistence & system preference detection |

### Animations & UX

| Package | Purpose |
|---------|---------|
| **Framer Motion** (^12.43) | Declarative scroll animations, reveal effects, layout changes |
| **GSAP** (^3.15) | High-precision scroll-triggered, timeline-based micro-interactions |
| **Lenis** (^1.3.25) | Smooth momentum scrolling wrapper with native scroll restoration |

### Backend & Data

| Package | Purpose |
|---------|---------|
| **@supabase/ssr** (^0.12.4) | Server-side Supabase client (App Router cookie integration) |
| **@supabase/supabase-js** (^2.111) | Client-side Supabase SDK for DB, Auth, Storage |

### Development

| Package | Purpose |
|---------|---------|
| **ESLint 9 + eslint-config-next** | Core Web Vitals + TypeScript lint rules |
| **@types/node, @types/react, @types/react-dom** | Runtime type definitions |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                        USER / BROWSER                             │
│  (Chrome, Safari, Firefox, Mobile — HTTP/S + DNS)                │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS Request
┌───────────────────────────────────────────────────────────────────┐
│                          VERCEL EDGE                              │
│  CDN, Edge Runtime, Middleware, Image Optimization, Caching      │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Route Matching
┌───────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 16 APP ROUTER                      │
│  ┌─────────────┐   ┌─────────────┐   ┌────────────────────────┐  │
│  │   Routing   │──▶│  Middleware │──▶│ Server Components (RSC) │  │
│  └─────────────┘   └─────────────┘   └────────────────────────┘  │
│                         │                                         │
│                         ▼                                         │
│               ┌───────────────────────┐                           │
│               │ Client Components (CC)│◀─── Hydration + Events    │
│               └───────────────────────┘                           │
└───────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴─────────────────┐
              ▼                                 ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│   SUPABASE SSR (Server Side)  │   │ SUPABASE JS (Client Side)    │
│  ┌─────────────────────────┐  │   │  ┌─────────────────────────┐ │
│  │ Server Client (cookies) │  │   │  │ Browser Client (events) │ │
│  └─────────────────────────┘  │   │  └─────────────────────────┘ │
└───────────────────────────────┘   └───────────────────────────────┘
              │
              ▼
┌───────────────────────────────────────────────────────────────────┐
│                          SUPABASE CLOUD                           │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐  ┌──────────┐  │
│  │ PostgreSQL │◀─▶│  Storage   │◀─▶│    Auth    │◀─▶│ Edge Fn  │  │
│  └────────────┘   └────────────┘   └────────────┘  └──────────┘  │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Event / Telemetry
┌───────────────────────────────────────────────────────────────────┐
│                          ANALYTICS                                │
│  Microsoft Clarity (Session Replay, Heatmaps) + GA4 (Traffic)    │
└───────────────────────────────────────────────────────────────────┘
```

> 💡 **See [docs/architecture.md](docs/architecture.md)** for the full architecture narrative, request flow, data flow, and component hierarchy.

---

## 📂 Folder Structure

```
profile/
├── src/
│   ├── app/                        # Next.js App Router (routes, layouts)
│   │   ├── about/                  # /about — Bio, skills, education
│   │   ├── categories/             # /categories — Browse + [slug] details
│   │   ├── certificates/           # /certificates — Credentials gallery
│   │   ├── contact/                # /contact — Contact form page
│   │   ├── experience/             # /experience — Career timeline
│   │   ├── projects/               # /projects — Grid + [slug] detail
│   │   ├── services/               # /services — Offerings & pricing
│   │   ├── videos/                 # /videos — Demo video showcase
│   │   ├── favicon.ico             # Site icon
│   │   ├── globals.css             # Tailwind entry, design tokens
│   │   ├── layout.tsx              # Root layout: Navbar, Footer, SEO
│   │   ├── not-found.tsx           # Custom 404 page
│   │   ├── page.tsx                # / — Home: Hero, Stats, Featured
│   │   ├── robots.ts               # /robots.txt generator
│   │   └── sitemap.ts              # /sitemap.xml generator
│   │
│   ├── components/                 # All React components
│   │   ├── contact/                # ContactForm (validation, UX)
│   │   ├── certificates/           # CertificateGallery grid
│   │   ├── experience/             # Timeline, experience cards
│   │   ├── home/                   # Hero, FeaturedProjects, Stats, BG
│   │   ├── layout/                 # Navbar, Footer, SmoothScroll
│   │   ├── providers/              # AnalyticsProvider (GA, Clarity)
│   │   ├── services/               # ServiceCard list
│   │   ├── shared/                 # Reusable patterns (GlassCard, Reveal, …)
│   │   ├── ui/                     # shadcn-style primitives (Button, Card, …)
│   │   └── videos/                 # VideoShowcase player
│   │
│   ├── data/                       # Static typed data collections
│   │   ├── categories.ts           # Category definitions + slug helpers
│   │   ├── certificates.ts         # Certificates dataset + interface
│   │   ├── experience.ts           # Experience, Education, Skills, Stats
│   │   ├── projects.ts             # Project type + query functions
│   │   ├── services.ts             # Service catalog w/ pricing & features
│   │   └── videos.ts               # Demo videos metadata
│   │
│   └── lib/                        # Non-React utilities & SDK wrappers
│       ├── animations.ts           # Framer Motion variant presets
│       ├── constants.ts            # SITE_CONFIG, NAV_LINKS, branding
│       ├── supabase/               # typed client & server factories
│       │   ├── client.ts           # createClient() for "use client"
│       │   └── server.ts           # createClient() async cookie-wrapped
│       └── utils.ts                # cn(), formatDate(), formatCurrency()
│
├── public/                         # Static assets (files, OG images, media)
├── supabase/                       # Optional: migrations & seed SQL
│
├── .env.example                    # Documented env variable template
├── .gitignore                      # Comprehensive Next.js + IDE ignores
├── eslint.config.mjs               # ESLint 9 flat config (Next.js rules)
├── next.config.ts                  # Next.js config (headers, images, cache)
├── package.json                    # Scripts, deps, version, metadata
├── postcss.config.mjs              # Tailwind 4 PostCSS pipeline
├── tsconfig.json                   # Strict TS + path aliases (@/* → src/*)
│
└── docs/                           # 👇 Comprehensive documentation
    ├── architecture.md
    ├── api.md
    ├── components.md
    ├── deployment.md
    ├── developer-handbook.md
    ├── folder-structure.md
    ├── github.md
    ├── maintenance.md
    └── vercel.md
```

> 💡 **See [docs/folder-structure.md](docs/folder-structure.md)** for every folder's purpose, naming conventions, and what belongs where.

---

## 🖼️ Screenshots

<div align="center">

| Home — Hero | Projects Grid | Project Detail |
|:-----------:|:-------------:|:--------------:|
| [![Hero](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20premium%20portfolio%20hero%20section%20purple%20cyan%20gradient%20title%20with%20N%20logo%20buttons%20glassmorphism%20minimalist&image_size=landscape_16_9)](https://nirmaan.dev) | [![Projects](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20portfolio%20projects%20grid%20glass%20cards%20purple%20blue%20accent%20tilt%20effect%20tech%20tags%20minimalist&image_size=landscape_16_9)](https://nirmaan.dev/projects) | [![Detail](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20portfolio%20project%20detail%20page%20screenshots%20carousel%20tech%20stack%20features%20list%20gradient%20accents&image_size=landscape_16_9)](https://nirmaan.dev/projects/enterprise-analytics-platform) |

| Services | Experience Timeline | Certificates |
|:--------:|:-------------------:|:------------:|
| [![Services](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20portfolio%20services%20page%20pricing%20cards%20gradient%20borders%20feature%20lists%20minimalist&image_size=landscape_16_9)](https://nirmaan.dev/services) | [![Experience](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20portfolio%20experience%20timeline%20vertical%20gradient%20line%20company%20cards%20achievements%20minimalist&image_size=landscape_16_9)](https://nirmaan.dev/experience) | [![Certificates](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20portfolio%20certificates%20gallery%20grid%20credential%20cards%20badges%20issuer%20logos%20minimalist&image_size=landscape_16_9)](https://nirmaan.dev/certificates) |

</div>

---

## 🎯 Live Demo

**🌐 Production:** [https://nirmaan.dev](https://nirmaan.dev)

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version | Check |
|------|-----------------|-------|
| **Node.js** | 18.17 (LTS) | `node -v` |
| **npm** (comes with Node) | 9.x | `npm -v` |
| **Git** | 2.40+ | `git --version` |

> 💡 Recommend Node.js 20+ or 22+ for best Turbopack performance.

### 1. Clone the Repository

```bash
git clone https://github.com/Niru-re/nirmal_profile.git
cd nirmal_profile
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the template and edit the values:

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in your credentials. See [Environment Variables](#-environment-variables).

### 4. Run the Development Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser. Edit files in `src/app/` or `src/components/` — the page auto-updates via Fast Refresh.

### 5. Build for Production

```bash
npm run build       # Type-check + optimize bundle → .next/
npm run start       # Serve the production build locally
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Turbopack by default in Next 16) |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the built app (run *after* build) |
| `npm run lint` | Run ESLint (Next.js Core Web Vitals + TS rules) |
| `npm run lint:fix` | Auto-fix lintable issues |
| `npm run typecheck` | Run TypeScript compiler in `--noEmit` mode |
| `npm run clean` | Remove `.next/` and `out/` cache directories |

---

## 🔐 Environment Variables

> Full documented template: [`.env.example`](.env.example)

| Variable | Required | Purpose | Where to Get |
|----------|:--------:|---------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | REST endpoint for your Supabase project | [supabase.com](https://supabase.com) → Project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public client key (safe in browser) | Same as above — "anon public" key |
| `NEXT_PUBLIC_CLARITY_ID` | 🟡 | Microsoft Clarity session analytics | [clarity.microsoft.com](https://clarity.microsoft.com) |
| `NEXT_PUBLIC_GA_ID` | 🟡 | Google Analytics 4 Measurement ID | [analytics.google.com](https://analytics.google.com) (format `G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_SITE_URL` | 🟡 | Canonical URL for metadata/sitemap (overrides `SITE_CONFIG.url`) | Your production domain, e.g. `https://nirmaan.dev` |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔮 | Server-only admin key (future admin/API use) | Supabase → Settings → API → service_role — **never expose client-side** |

---

## 📝 Documentation

Every major aspect of the project is documented in the `docs/` directory:

| File | For Whom | What You'll Learn |
|------|----------|-------------------|
| [docs/architecture.md](docs/architecture.md) | Architects, Seniors | System context, request lifecycle, data flow, component hierarchy |
| [docs/folder-structure.md](docs/folder-structure.md) | All Devs | Every folder's purpose, naming rules, what belongs where |
| [docs/components.md](docs/components.md) | Frontend Devs | Component catalog: props, variants, composition patterns, UX guidelines |
| [docs/api.md](docs/api.md) | Full-stack Devs | Route Handlers, Supabase schema, data-access functions, validation |
| [docs/developer-handbook.md](docs/developer-handbook.md) | Contributors | Coding standards, patterns, TypeScript rules, testing strategies |
| [docs/maintenance.md](docs/maintenance.md) | Maintainers | Adding projects, categories, certificates, videos, changing colors, deploy/rollback |
| [docs/deployment.md](docs/deployment.md) | DevOps | General production deployment best practices & checklists |
| [docs/vercel.md](docs/vercel.md) | DevOps, Devs | Step-by-step Vercel deploy (CLI + dashboard), domains, env vars, analytics |
| [docs/github.md](docs/github.md) | Maintainers | Git commands, push flow, release management, tags |

---

## 🌐 Deployment

### Recommended — Vercel (One Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNiru-re%2Fnirmal_profile&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_CLARITY_ID,NEXT_PUBLIC_GA_ID&project-name=nirmaan-portfolio&repository-name=nirmaan-portfolio)

### Full Vercel Guide

See **[docs/vercel.md](docs/vercel.md)** for step-by-step instructions covering:

- Vercel CLI installation & authentication
- Project linking
- Preview / Production deploys
- Custom domain & SSL
- Environment variables UI
- Analytics & Speed Insights
- Rollback strategies

### General Deployment (Docker, Self-Hosted, etc.)

See **[docs/deployment.md](docs/deployment.md)**.

---

## 🔄 Project Roadmap

### ✅ v1.0.0 — CURRENT (Released)
- [x] Premium dark-mode design system & token architecture
- [x] Home, About, Projects (grid + detail), Categories, Videos, Certificates, Experience, Services, Contact pages
- [x] Framer Motion reveal animations, 3D tilt cards, smooth scroll
- [x] Sitemap, robots, OpenGraph / Twitter Card metadata
- [x] Supabase client + server SDK integration
- [x] Microsoft Clarity + GA4 conditional loading
- [x] Full TypeScript strict mode, typed data layer

### 🚧 v2.0.0 — Upcoming
- [ ] 🤖 AI Chatbot — embedded assistant trained on portfolio content
- [ ] 📝 Blog system — MDX posts, RSS feed, searchable archive
- [ ] 📚 Headless CMS integration (Sanity / Payload / Directus)
- [ ] ⭐ Testimonials carousel with rating + company logos
- [ ] 📊 Analytics dashboard (traffic, engagement, project views)
- [ ] 🔧 Admin Panel improvements — RLS-protected CRUD for content

### 🔮 v3.0.0 — Long-term
- [ ] 🌐 Multi-language (i18n) — English + regional languages
- [ ] 📱 PWA — offline support, installable, service worker
- [ ] 🔔 Notifications system (contact form replies, project updates)
- [ ] 👥 Client Dashboard — dedicated portal for customers/projects

---

## 🤝 Contributing

We love contributions of every kind — bug fixes, docs, design tweaks, new features.

**Quick start:**

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone git@github.com:YOUR_USERNAME/nirmal_profile.git
cd nirmal_profile

# 2. Create a feature branch
git checkout -b feature/amazing-thing

# 3. Make your changes + run checks
npm run lint
npm run typecheck
npm run build

# 4. Commit, push, and open a pull request
git add .
git commit -m "feat: add amazing thing"
git push origin feature/amazing-thing
```

Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full process, coding standards, and PR requirements.

---

## ❓ FAQ

<details>
<summary><strong>Can I use this portfolio template for my own site?</strong></summary>

Absolutely — that's one of the main goals! This project is MIT-licensed. Change the branding in `src/lib/constants.ts` (name, URLs, social links), swap data in `src/data/*.ts`, and deploy. See [docs/maintenance.md](docs/maintenance.md) for a step-by-step rebrand guide.
</details>

<details>
<summary><strong>Do I need Supabase to run this?</strong></summary>

No. The core portfolio pages (Home, About, Projects, etc.) are fully static and read from typed data files in `src/data/`. Supabase is only required if you want the contact form submissions to be stored, or if you plan to enable the future admin CMS. In that case, set the two `NEXT_PUBLIC_SUPABASE_*` env vars.
</details>

<details>
<summary><strong>How do I change the color palette / gradient?</strong></summary>

Edit the CSS custom properties in [`src/app/globals.css`](src/app/globals.css) — specifically `--accent-purple`, `--accent-blue`, `--accent-cyan`. Everything else (buttons, borders, gradient text) derives from those tokens. See [docs/maintenance.md → Changing Colors](docs/maintenance.md#changing-colors-and-theme) for full details.
</details>

<details>
<summary><strong>How do I add a new project?</strong></summary>

Add a new object to the `projects` array in [`src/data/projects.ts`](src/data/projects.ts). Include the required `Project` interface fields (`slug`, `title`, `description`, `category`, etc.). Run the project and you'll see it on `/projects`. See [docs/maintenance.md → Adding a Project](docs/maintenance.md#adding-a-new-project).
</details>

<details>
<summary><strong>Is this template optimized for SEO?</strong></summary>

Yes. Every route has dynamic metadata (OpenGraph + Twitter Cards), a canonical `sitemap.xml`, and a crawl-friendly `robots.txt`. HTML is semantic, heading order is preserved, images use `<Image>` for optimized format + lazy load, and fonts are self-hosted with next/font.
</details>

<details>
<summary><strong>What Node versions are supported?</strong></summary>

Next.js 16 requires Node 18.17+. We recommend Node 20 LTS or 22 LTS for production deployments.
</details>

---

## 💬 Support

If you found a bug or have a feature request:

- 🐛 **Open an issue** → [GitHub Issues](https://github.com/Niru-re/nirmal_profile/issues)
- 💬 **Discussions** → [GitHub Discussions](https://github.com/Niru-re/nirmal_profile/discussions)
- 📧 **Email** → [hello@nirmaan.dev](mailto:hello@nirmaan.dev)

Please **search existing issues first** before opening a new one.

---

## 📧 Contact

For business inquiries, freelance availability, or full-time opportunities:

- **Website:** [nirmaan.dev](https://nirmaan.dev)
- **Email:** [hello@nirmaan.dev](mailto:hello@nirmaan.dev)
- **GitHub:** [@nirmaan](https://github.com/nirmaan)
- **LinkedIn:** [linkedin.com/in/nirmaan](https://linkedin.com/in/nirmaan)
- **Twitter / X:** [@nirmaan](https://twitter.com/nirmaan)

---

## 🙏 Acknowledgements

This project stands on the shoulders of giants:

| Project | Why We Love It |
|---------|---------------|
| **Vercel** | Next.js, Edge Runtime, one-click deploy happiness |
| **Supabase** | Firebase-quality OSS backend on top of Postgres |
| **Framer** | Framer Motion — the gold standard for React animation |
| **Radix UI** | Truly accessible component primitives, unstyled by design |
| **Tailwind Labs** | Tailwind CSS 4 — productivity without compromising design |
| **Lenis / Studio Freight** | Native-feeling smooth scroll without jank |
| **shadcn/ui** | The component patterns this codebase's `ui/` folder follows |
| **Lucide** | Beautiful, consistent, tree-shakeable icons |

---

## ⭐ Star the Project

If this template helped you ship your portfolio, consider giving it a **GitHub Star** — it helps other developers discover the project.

[![Star History Chart](https://api.star-history.com/svg?repos=Niru-re/nirmal_profile&type=Date)](https://star-history.com/#Niru-re/nirmal_profile)

---

## 📄 License

MIT © 2025 Nirmaan. See [LICENSE](LICENSE) for full terms.

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and way too much coffee.**

[⬆ Back to Top](#nirmaan--portfolio-website)

</div>

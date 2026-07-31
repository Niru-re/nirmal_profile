# Vercel Deployment Guide

> ⚡ Step-by-step: Vercel CLI + Dashboard, custom domains, env vars, analytics, rollbacks.

Vercel is the **recommended deployment platform** for this project — Next.js 16 is a Vercel product and every feature (RSC streaming, ISR, Edge Runtime, Font optimization, Image Optimization) is production-tested there first.

---

## Contents

1. [Three Ways to Deploy](#1-three-ways-to-deploy)
2. [Prerequisites](#2-prerequisites)
3. [Method A — Vercel Dashboard (Click Ops)](#3-method-a--vercel-dashboard-click-ops)
4. [Method B — Vercel CLI (Terminal)](#4-method-b--vercel-cli-terminal)
5. [Method C — One-Click Deploy Button](#5-method-c--one-click-deploy-button)
6. [Environment Variables in Vercel](#6-environment-variables-in-vercel)
7. [Project Configuration (vercel.json)](#7-project-configuration-verceljson)
8. [Custom Domain & SSL](#8-custom-domain--ssl)
9. [Preview Deployments](#9-preview-deployments)
10. [Vercel Analytics & Speed Insights](#10-vercel-analytics--speed-insights)
11. [Web Analytics Integrations (Clarity + GA4)](#11-web-analytics-integrations-clarity--ga4)
12. [Monitoring & Logs](#12-monitoring--logs)
13. [Production Deployment Workflow](#13-production-deployment-workflow)
14. [Rolling Back](#14-rolling-back)
15. [Troubleshooting](#15-troubleshooting)
16. [Pricing Tiers (Notes)](#16-pricing-tiers-notes)

---

## 1. Three Ways to Deploy

1. **Dashboard import** → fastest if you already use GitHub + Vercel.
2. **Vercel CLI** → recommended for maintainers who live in the terminal.
3. **One-click button** → README badge for fork & ship by end-users.

All three produce the same result. Choose one.

---

## 2. Prerequisites

| Item | Required |
|------|:--------:|
| Vercel account (free is fine) | ✅ |
| Git repo pushed to GitHub / GitLab / Bitbucket | ✅ (for dashboard import) |
| Node.js ≥ 18.17 locally (for CLI method) | CLI only |
| Env values (Supabase URLs, optional GA/Clarity) | ✅ |
| Owned domain (for custom domain) | 🟡 Recommended but not required |

---

## 3. Method A — Vercel Dashboard (Click Ops)

> 5 minutes. Best for one-time setup or less technical users.

### 3.1 Import the Project

1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. **Add Git Provider** if not already → authorize GitHub/GitLab.
3. Search for `nirmal_profile` repo → click **Import**.
4. Configure Project:
   - **Framework Preset** → automatically detected as **Next.js** ✅.
   - **Root Directory** → leave `/` (if repo has `package.json` at root).
   - **Build Command** → `next build` (leave default; Vercel detects).
   - **Install Command** → `npm install` (auto).
   - **Output Directory** → `.next` (auto).
5. **Environment Variables** section (see §6) — paste each:

| Key | Value | Environments |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR.supabase.co` | Production + Preview + Dev |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiI…` | Production + Preview + Dev |
| `NEXT_PUBLIC_CLARITY_ID` | `abcdef1234` | Production only |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Production only |
| `NEXT_PUBLIC_SITE_URL` | `https://nirmaan.dev` | Production only |

6. Click **Deploy**. ⏱️ ~1–2 minutes for initial build.
7. Celebrate — your site is live at `https://nirmal-profile-*.vercel.app`.

### 3.2 Configure Post-Deploy Settings (do once)

Project → Settings:

- **General → Node.js Version → 20.x** (recommended for Next 16).
- **Git → Production Branch → `main`** (matches convention).
- **Git → Ignored Build Step:** leave default. (Optional — skip for doc-only PRs with a script.)
- **Security → Password Protection:** off for public portfolio.

---

## 4. Method B — Vercel CLI (Terminal)

Maintainers will prefer this long-term. Install once, link project forever after.

### 4.1 Install CLI

```bash
npm install -g vercel
# or: pnpm add -g vercel
# or via npx one-off: npx vercel
```

Verify:

```bash
vercel --version
# → 37.x+ (at time of writing)
```

### 4.2 Login

```bash
vercel login
# → prompts to authenticate via browser
# Choose: Continue with GitHub / email
vercel whoami   # confirms login
```

### 4.3 Link Project (one-time)

From the root of your checked-out repo:

```bash
vercel link
```

Answer prompts:

```text
? Set up and deploy "C:\Users\You\profile"?  Y
? Which scope do you want to deploy to?    <your username or team>
? Link to existing project?                n (first time)
? What's your project's name?              nirmaan-portfolio
? In which directory is your code located? ./
```

Creates `.vercel/project.json` (gitignored; safe to keep locally).

### 4.4 Upload Env Vars via CLI

```bash
# Required
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Optional — production only
vercel env add NEXT_PUBLIC_CLARITY_ID        # choose: Production
vercel env add NEXT_PUBLIC_GA_ID             # choose: Production
vercel env add NEXT_PUBLIC_SITE_URL          # choose: Production
```

Alternatively, batch-upload using `.env.production`:

```bash
vercel env add plain NEXT_PUBLIC_SUPABASE_URL < production.env
# (see `vercel env --help` for full format)
```

### 4.5 First Deploy (Preview)

```bash
vercel
# → builds & deploys to a unique preview URL (e.g. profile-yourname.vercel.app)
# → takes 1–2 min
# Open the printed URL; run smoke tests from deployment.md §14.
```

### 4.6 Deploy to Production

```bash
vercel --prod
# → Promotes the preview you just built into production
# → URL: the official *.vercel.app domain or your custom domain
```

### 4.7 Useful CLI Commands

| Command | What |
|---------|------|
| `vercel dev` | Run `next dev` through Vercel dev (mirrors production env & redirects) |
| `vercel build` | Build production bundle locally (same as cloud build) |
| `vercel inspect <url>` | Print details: build time, status, env snapshot hash |
| `vercel logs` | Stream runtime logs for current deployment |
| `vercel env ls` | List env vars per environment |
| `vercel env rm <name>` | Remove a var |
| `vercel rollback` | Interactive pick of previous deployment → promote to prod |
| `vercel domains ls` | List domains for project |

---

## 5. Method C — One-Click Deploy Button

Perfect for users who fork the template repo and want it live in < 3 min. The button is already embedded in the **README** top section.

Markdown source:

```md
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNiru-re%2Fnirmal_profile&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_CLARITY_ID,NEXT_PUBLIC_GA_ID&project-name=nirmaan-portfolio&repository-name=nirmaan-portfolio)
```

When a user clicks it, Vercel:
1. Forks the repo into their account automatically.
2. Prompts for the 4 env vars listed in `env=`.
3. Builds and assigns a production domain.

---

## 6. Environment Variables in Vercel

**Best practices, Vercel edition:**

1. **Scope correctly.** For example, `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe in **Production + Preview + Development**. `NEXT_PUBLIC_GA_ID` → **Production only** (keep preview analytics clean).
2. **Secrets vs client vars.** Anything server-only (future `SUPABASE_SERVICE_ROLE_KEY`) → set it **only** in Production and make sure it does NOT begin with `NEXT_PUBLIC_`.
3. **Decryption.** You cannot read env vars back via `vercel env ls` (intentionally, for security). If you lose a value, re-issue it at the source (Supabase).
4. **Changes require a redeploy.** Changing an env var in Vercel UI does NOT retroactively apply to running deploys. Click **Redeploy** or run `vercel --prod` again.

### Project-level vs Team-level

- Secrets shared across many projects (e.g., a global Supabase key): set them in **Vercel Team → Settings → Environment Variables**.
- Portfolio-specific keys: keep them project-level.

---

## 7. Project Configuration (`vercel.json`)

`next.config.ts` handles most Next.js specifics. Add a `vercel.json` when you need Vercel-specific behavior:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm ci",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "regions": ["bom1", "iad1"],
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true },
    { "source": "/portfolio", "destination": "/projects", "permanent": true }
  ],
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

When to use vs `next.config.ts` headers?
- Use `next.config.ts` for **application-level** headers (X-Frame-Options, CSP, etc. — already set).
- Use `vercel.json` only for Vercel-edge-level redirects / rewrites the framework config can't express.

---

## 8. Custom Domain & SSL

Skip if you're happy with `*.vercel.app`.

### 8.1 Add Domain

Dashboard: Project → **Settings → Domains** → **Add**:
1. Enter: `nirmaan.dev` → **Add**.
2. Vercel suggests two ways to verify:
   - **Apex domain (nirmaan.dev)** → add `A` record to Vercel's anycast IPs.
   - **Subdomain (www.nirmaan.dev)** → add a `CNAME` → `cname.vercel-dns.com`.

### 8.2 DNS Records (example for Cloudflare / Namecheap)

| Type | Host | Value | TTL |
|------|------|-------|-----|
| `A` | `@` | `76.76.21.21` (Vercel anycast; check dashboard for current IPs) | Auto |
| `CNAME` | `www` | `cname.vercel-dns.com` | Auto |
| (Optional) `CAA` | `@` | `0 issue "letsencrypt.org"` | Auto |

### 8.3 SSL & Redirects

- **HTTPS automatic** — Vercel provisions and renews LetsEncrypt certs zero-touch.
- **Set up domain redirects:** In Domains → **Add redirect**: `www.nirmaan.dev` → `https://nirmaan.dev` **Permanent (308)**.
- **HSTS:** Enabled by default once you enable it in Project → Settings → Security (recommended — 6 months max-age first → 2 years after confirming no breakage).

### 8.4 (Optional) Email for Custom Domain

- Use a transactional provider: **Resend**, **Postmark**, **Mailgun**, **Sendgrid**.
- Set SPF + DKIM + DMARC DNS records provided by your email provider so contact form replies land in inboxes, not spam.

---

## 9. Preview Deployments

Every:
- PR against `main`,
- push to a feature branch,

…gets its own unique preview URL like `profile-git-feature-ai-chat-nirmaan.vercel.app`.

**Magic for maintainers:**
1. Review PR code on GitHub.
2. Click **Visit Preview** in the Vercel comment that appears on the PR.
3. Run smoke tests (deployment.md §14).
4. ✅ Approve; or ❌ comment with screenshots → "please fix".

### Configure Preview branch prefixes

In `vercel.json` (optional):

```json
{
  "github": {
    "silent": false,
    "autoAlias": true
  }
}
```

---

## 10. Vercel Analytics & Speed Insights

Project → **Analytics** tab → **Enable** (turn on both):

| Product | Purpose | Cost (2025) |
|---------|---------|-------------|
| **Web Analytics** | Page views, unique visitors, top pages, referrers, countries | 10K events/mo free, paid tiers after |
| **Speed Insights** | Real-user p75/p95 for LCP, CLS, INP, TTFB — by route | Limited free, paid per GB |

These complement, but don't replace, Clarity/GA4 because they capture **server timing** data you can't get from client JS.

---

## 11. Web Analytics Integrations (Clarity + GA4)

The project already ships with `<Analytics>` provider in `components/providers/analytics.tsx`. It **lazy-loads** the vendor snippets **only if the env vars are present** at render time.

**To enable on a Vercel deploy:**

1. Add the env vars in Vercel project settings:
   - `NEXT_PUBLIC_CLARITY_ID` (from [clarity.microsoft.com](https://clarity.microsoft.com) → Project → Settings → Setup)
   - `NEXT_PUBLIC_GA_ID` (from [GA4](https://analytics.google.com) → Admin → Property → Measurement ID, format `G-…`)
2. **Redeploy** (Vercel → Deployments → ⋯ → Redeploy, or `vercel --prod`).
3. Verify:
   - Clarity: 10 minutes later → Clarity dashboard shows sessions.
   - GA4: Admin → DebugView → Real-time events show `page_view`.

Both are non-blocking (`strategy="lazyOnload"` in AnalyticsProvider) — analytics never delays first paint.

---

## 12. Monitoring & Logs

### Runtime Logs

Vercel Dashboard → Project → **Logs**.
- Use search bar: `500` `ERROR` `Supabase` etc.
- Click a log line → view full request/response + traceback.
- 1 hour of logs on free tier; 7 days on Pro; longer retention on Enterprise.

### Alerts

Dashboard → **Alerts** → Add:
1. **Error Rate** (> 1% over 5 min → Slack/email).
2. **Invocation** (unexpected function usage spike).
3. **Bandwidth** (catch traffic spike).
4. **Build Failure** (every main-branch build fail → maintainer chat).

### 3rd-party Uptime + Lighthouse

Plug into BetterStack/UptimeRobot for pings; use Vercel's own cron to run Lighthouse on a schedule or use **PageSpeed Insights API** + Slack webhook.

---

## 13. Production Deployment Workflow (Maintainer Flow)

```bash
# 1. You just merged a PR to main, CI is green.
cd profile
git pull origin main

# 2. Build preview first, sanity check
vercel
# → opens https://profile-<preview>.vercel.app
# → run smoke tests (see deployment.md §14)

# 3. Everything good? Promote to production
vercel --prod

# 4. Post-deploy: monitor logs 10 minutes
vercel logs nirmaan-portfolio --tail
```

---

## 14. Rolling Back

**The most important Vercel skill. Practice it.**

### From dashboard (fastest)

Project → **Deployments**:
1. Find the last **✓ Ready** deployment *before* the current one.
2. Click `⋯` menu → **Promote to Production**.
3. Confirm dialog. Traffic flips instantly.
4. Redeploy times are ~0s because the build artifact is still cached.

### From CLI

```bash
vercel rollback
# → interactive pick → which deployment to revert to
```

**Target MTTR:** Under **2 minutes**.

After rollback:
- Open an incident issue explaining what went wrong.
- Revert the offending commit(s) in git to avoid re-introducing the bug next deploy.
- Post-mortem in 48 hours: root cause, 1 action item to prevent recurrence, 1 action item to improve detection.

---

## 15. Troubleshooting

| Symptom | Most Likely Cause | Fix |
|---------|-------------------|-----|
| Build fails → "Missing env NEXT_PUBLIC_SUPABASE_URL" | Env var not set in Vercel | Project → Env → paste; Redeploy |
| "Route returned 500" — Vercel logs show env-var undefined in route handler | Server-only var missing OR used in CC without NEXT_PUBLIC prefix | 1) Add it. 2) Decide: does the browser actually need it? If yes → rename to `NEXT_PUBLIC_*`. If no → keep server-only and only access inside Server Components / Route Handlers. |
| Fonts not loading (404 /_next/font/) | Static asset mismatch, cache busted | Clear CDN cache / Redeploy |
| OG image not showing in social shares | URL in `metadataBase` doesn't match actual domain OR image missing | Fix `SITE_CONFIG.url`; ensure `og-image.png` exists in `/public` |
| Images loaded from external domain → 403 | `remotePatterns` missing in next.config.ts | Add the hostname; the current config is very permissive (`**`) so this is unlikely |
| Preview works, production broken | Env var set for Preview only, not Production | Vercel Env UI → check "Production" checkbox |
| "Node incompatibility" during build | Project set to Node 16 or 18 | Settings → General → Node.js Version → 20.x+ |
| i18n subpaths (future multi-lang) | Vercel treats rewrites differently than self-hosted | Use Next.js built-in `i18n` routing; avoid custom `vercel.json` unless necessary |

---

## 16. Pricing Tiers (Notes)

| Tier | Portfolio Project Fit |
|------|----------------------|
| **Hobby** (free) | ✅ Perfect for personal / side portfolio. 100 GB bandwidth, 6000 build minutes/month. |
| **Pro** (~$20/mo) | When traffic grows or you need preview deployments for more than 1 contributor team. 1 TB bandwidth. |
| **Enterprise** | Negotiated. SSO, dedicated support, SLAs. |

Portfolio traffic usually lives comfortably on Hobby. Move to Pro if: you share an org with multiple deployers, or if media bandwidth (videos, lots of project images) exceeds 100 GB/month.

---

*Vercel guide version: 1.0 · Updated: 2025-07-31*

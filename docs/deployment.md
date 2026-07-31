# Deployment Guide

> 🚢 General production deployment best practices, build process, environment setup, scaling, and pre-flight checklists.

For Vercel-specific instructions (CLI, dashboard, domains) see **[vercel.md](vercel.md)**.

---

## Contents

1. [Overview of Deployment Targets](#1-overview-of-deployment-targets)
2. [Pre-Flight Checklist](#2-pre-flight-checklist-mandatory)
3. [General Deployment Workflow](#3-general-deployment-workflow)
4. [Environment Variables in Production](#4-environment-variables-in-production)
5. [Self-Hosted (Node.js Runtime)](#5-self-hosted-nodejs-runtime)
6. [Docker Deployment](#6-docker-deployment)
7. [Netlify, Cloudflare Pages, AWS, Fly.io](#7-netlify-cloudflare-pages-aws-flyio)
8. [CDN Strategy](#8-cdn-strategy)
9. [Build Caching](#9-build-caching)
10. [Zero-Downtime Deploys](#10-zero-downtime-deploys)
11. [Rollback Strategy](#11-rollback-strategy)
12. [Monitoring & Alerting](#12-monitoring--alerting)
13. [SSL/TLS & Security Hardening](#13-ssltls--security-hardening)
14. [Post-Deploy Smoke Tests](#14-post-deploy-smoke-tests)

---

## 1. Overview of Deployment Targets

| Target | Recommended For | Pros | Cons |
|--------|----------------|------|------|
| **Vercel** ✅ | *Everyone* | Zero-config; Edge; ISR; preview per PR; analytics | Vendor lock-in; advanced config needs `vercel.json` |
| Self-hosted Node | Enterprises, on-prem | Full control | You own infra, upgrades, uptime |
| Docker (ECS, Kubernetes, Fly.io) | Teams with container infra | Portable | More moving parts |
| Netlify / Cloudflare Pages | Hobbyists (CF Pages great for static) | Fast CDN | Next App Router + ISR workarounds sometimes needed |
| AWS (S3 static + Lambda) | Mature AWS teams | Pay-per-use, scales | Complexity; Lambda cold-start latency for SSR |

**Recommendation for this project:** **Vercel** is the path of least resistance (Next.js 16 is developed by Vercel; all features are first-class). Use the other options if you have explicit vendor requirements.

---

## 2. Pre-Flight Checklist (MANDATORY)

Before ANY production deploy, check all boxes:

### Build & Quality

- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run typecheck` passes (no TS errors)
- [ ] `npm run build` completes (production bundle)
- [ ] `.next/` output size is sane (total HTML per route typically < 200 KB)

### Environment

- [ ] Every `NEXT_PUBLIC_*` env var referenced in code exists in the deploy env.
- [ ] Server-only env vars (e.g. `SUPABASE_SERVICE_ROLE_KEY`) are marked "server only" in the target platform.
- [ ] `.env.example` matches the actually-required set (no phantom variables).

### Secrets

- [ ] No `.env.local`, `.env`, `.pem`, `id_rsa` committed to git (double-check with a quick `git log -p -S SUPABASE_SERVICE_ROLE_KEY`).
- [ ] Supabase anon key rotated if it has ever been committed by mistake.

### Site URL & SEO

- [ ] `SITE_CONFIG.url` in `src/lib/constants.ts` → production domain (no `localhost:3000`).
- [ ] `sitemap.xml` references real URLs.
- [ ] `robots.txt` allows `/` (not `Disallow: /`).
- [ ] Production domain added to Google Search Console + Bing Webmaster Tools.

### Security Headers

- [ ] `next.config.ts` `headers()` section present (already in v1 — see `next.config.ts`).
- [ ] Run [securityheaders.com](https://securityheaders.com/) against production URL → aim for A or B.

### Manual Smoke Test on `npm run start` (local simulate)

- [ ] Home → About → Projects → Project detail → Categories → Contact: all open
- [ ] 404 works (visit `/this-does-not-exist`)
- [ ] Responsive: ≤ 480px looks OK
- [ ] Contact form validates (if API route is live)
- [ ] Clarity / GA4 page_view fires (DevTools → Network → `collect` or `/c/`)
- [ ] Lighthouse → Performance ≥ 90, Accessibility ≥ 95, SEO = 100

---

## 3. General Deployment Workflow

```
  1. Create release branch / bump version
           │
           ▼
  2. Merge to main  ───────▶  GitHub Actions CI: lint + typecheck + build
           │
           ▼
  3. Git tag release v1.x.y  ──▶  GitHub Release + CHANGELOG entry
           │
           ▼
  4. Deploy platform hook triggers (Vercel / Netlify / self-hosted pull & rebuild)
           │
           ▼
  5. Invalidate CDN caches (for static assets) if platform doesn't automatically
           │
           ▼
  6. Smoke tests against production URL (§14)
           │
           ▼
  7. Monitor: errors, latency, analytics events for 30 minutes
           │
           ▼
  8. Rollback if issues detected (§11)
```

---

## 4. Environment Variables in Production

**Golden rules:**

1. **Client-safe env vars must start with `NEXT_PUBLIC_`.**
   - Anything without the prefix is stripped from client bundles. This is enforced by Next.js at build time.
2. **Never print env vars to stdout in build logs.** Accidents happen; `console.log(process.env)` in a build step leaks.
3. **Never check them into git.** Even in a private repo.

### Required / Optional Reference

| Variable | Required | Client? | Where to set |
|----------|:--------:|:-------:|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | All environments |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | All environments |
| `NEXT_PUBLIC_CLARITY_ID` | 🟡 | ✅ | Production only recommended |
| `NEXT_PUBLIC_GA_ID` | 🟡 | ✅ | Production only recommended |
| `NEXT_PUBLIC_SITE_URL` | 🟡 | ✅ | Production (overrides SITE_CONFIG.url) |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔮 | ❌ NEVER | Server-side only |
| `NODE_ENV` | Derived | ❌ | Platform sets automatically to `production` |

### Setting env vars across platforms

| Platform | UI | CLI equivalent |
|----------|-----|----------------|
| **Vercel** | Project → Settings → Environment Variables | `vercel env add SECRET production` |
| **Fly.io** | `fly secrets set` | `fly secrets set SUPABASE_SERVICE_ROLE_KEY=…` |
| **Docker / Node** | shell or orchestrator | `-e KEY=…` in `docker run` / env files for compose |
| **AWS** | Parameter Store / Secrets Manager | Injected at runtime via container |

---

## 5. Self-Hosted (Node.js Runtime)

Use if: on-prem deployment or full control needed.

### 5.1 Systemd Unit

```ini
# /etc/systemd/system/portfolio.service
[Unit]
Description=Nirmaan Portfolio (Next.js standalone)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/portfolio
Environment=NODE_ENV=production
# Pull env vars from a restricted file:
EnvironmentFile=/etc/portfolio/.env
ExecStart=/usr/bin/node /opt/portfolio/server.js
Restart=on-failure
RestartSec=3
# Hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/opt/portfolio/.next

[Install]
WantedBy=multi-user.target
```

### 5.2 Standalone output (recommended)

In `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // ...
};
```

Running `next build` produces `.next/standalone/` — a minimal production Node server (~80 MB vs 1+ GB with dev deps) you can `COPY` in Docker or ship to a VPS.

Copy `public/` and `.next/static/` next to it per [Next.js standalone docs](https://nextjs.org/docs/app/api-reference/next-config-js/output).

### 5.3 Reverse Proxy (nginx / Caddy) in front of Node

Serve static assets directly from nginx for max throughput:

```nginx
server {
  listen 443 ssl http2;
  server_name nirmaan.dev;

  ssl_certificate     /etc/letsencrypt/live/nirmaan.dev/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/nirmaan.dev/privkey.pem;

  # Serve static files directly — fastest path
  location /_next/static/ {
    alias /opt/portfolio/.next/static/;
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
  }
  location /public/ { alias /opt/portfolio/public/; }

  # Everything else → Next Node
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

---

## 6. Docker Deployment

### Dockerfile (multi-stage, output: "standalone")

```dockerfile
# ---- Deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# ---- Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time NEXT_PUBLIC_* values injected here if needed
RUN npm run build

# ---- Runtime (smallest final layer) ----
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

# Minimal standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### .dockerignore

```
node_modules
.next
.git
.env
.env.*
README.md
CHANGELOG.md
docs
```

### Run locally

```bash
docker build -t nirmaan-portfolio:v1.0.0 .
docker run -p 3000:3000 --env-file ./.env.production nirmaan-portfolio:v1.0.0
```

---

## 7. Netlify, Cloudflare Pages, AWS, Fly.io

| Platform | Notes |
|----------|-------|
| **Netlify** | `@netlify/plugin-nextjs` → handles serverless rendering. May need to pin plugin version for Next 16 immediately after release. |
| **Cloudflare Pages** | `@cloudflare/next-on-pages` adapter. Static routes run at edge; SSR on Cloudflare Workers. Double-check Edge Runtime compatibility. |
| **AWS Amplify** | Supports Next.js SSR/ISR natively. Good if you already use AWS + Cognito for auth. |
| **Fly.io** | Deploy the Dockerfile above + `fly launch`. Fast cold starts on Fly Machines. |
| **Kubernetes (EKS/GKE)** | `Deployment` with 2+ replicas, `HPA`, `Ingress` (Nginx / ALB), `livenessProbe: httpGet /healthz`. Add an external status health route (§12). |

---

## 8. CDN Strategy

Next.js ISR + incremental adoption of CDN:

| Content | Cache Strategy | TTL |
|---------|---------------|-----|
| Static assets `/_next/static/`, fonts, images | Immutable | 1 year |
| Static pages (/about, /services, /projects) | ISR `revalidate: 86400` (1 day) or forever until deploy | 1 day → 30 days warm |
| Dynamic project slugs | ISR `revalidate: 3600` + on-demand revalidation webhook | 1 hour |
| Contact API (POST) | Bypass cache | — |
| `sitemap.xml`, `robots.txt` | Short TTL, revalidated on deploy | 1 hour |

Always use platform-idiomatic cache control rather than rolling your own; Vercel/Cloudflare handle cache keys and `Vary` headers correctly.

---

## 9. Build Caching

Caching `node_modules` and `.next/cache` cuts build times 50–80%.

| CI / Platform | How |
|---------------|-----|
| **GitHub Actions** | `actions/cache@v4` → key: `node-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}` + restore key prefix |
| **Vercel** | Automatic |
| **Docker** | Layer ordering: copy package.json first, `npm ci` before `COPY . .` |
| **Self-hosted** | Persist `$HOME/.npm` + `.next/cache` between builds |

---

## 10. Zero-Downtime Deploys

Strategies in rough order of complexity:

1. **Vercel / Netlify** → automatic. Deploys go "Ready" before traffic flips.
2. **Kubernetes rolling update** — `strategy: RollingUpdate` with `maxSurge: 25%, maxUnavailable: 0`.
3. **Blue/Green on single VM (systemd)** — two dirs: `/opt/portfolio-blue`, `/opt/portfolio-green`. Swap symlink, reload nginx.
4. **Load-balanced VMs** — drain one node at a time out of the upstream pool.

---

## 11. Rollback Strategy

If post-deploy smoke tests fail, roll back BEFORE debugging the cause.

| Platform | Rollback command |
|----------|------------------|
| **Vercel** | Dashboard → Deployments → select previous green deployment → **Promote to Production** (1-click). CLI: `vercel rollback`. |
| **Fly.io** | `fly releases --image` or `fly deploy -i previous-image:tag` |
| **Kubernetes** | `kubectl rollout undo deployment portfolio` |
| **Docker VM** | Re-tag container image:vPrev as :latest and restart. |
| **Git-based** | `git revert <bad-commit>` → PR → hotfix deploy pipeline. |

**Rule of thumb:** Mean time to rollback < 2 minutes for Vercel; < 5 minutes for K8s/self-hosted. Practice it once before you need it.

---

## 12. Monitoring & Alerting

Minimal monitoring stack (all free tiers available):

| Signal | Tool | Threshold to alert |
|--------|------|--------------------|
| Uptime / TLS expiry | BetterStack, UptimeRobot, StatusCake | Down for 2 minutes or TLS < 7 days |
| Build failures | GitHub Actions / Vercel Slack webhook | Any failure on main |
| Runtime errors | Sentry (`@sentry/nextjs`) | Uncaught JS exceptions, spike in 5xx |
| Performance | Vercel Speed Insights, Lighthouse CI in schedule | P75 INP > 200 ms, LCP > 2.5 s |
| Analytics anomaly | GA4 alerts | 50% drop in page views |
| Resource usage | Node exporter + Prometheus/Grafana or host | Memory > 85%, CPU > 80% sustained |

### Add `/api/healthz` for monitoring

```ts
// src/app/api/healthz/route.ts
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  // Optional: ping supabase, check disk, memory thresholds
  return NextResponse.json({
    ok: true,
    version: process.env.npm_package_version ?? "unknown",
    uptime: process.uptime(),
  });
}
```

---

## 13. SSL/TLS & Security Hardening

- **HTTP → HTTPS redirect.** Enable HSTS with 6+ months max-age; submit to HSTS preload list once stable.
- **TLS 1.3 minimum** (disable 1.0/1.1). Vercel does this by default.
- **CAA DNS record** to restrict which CAs can issue certs (letsencrypt.org; or ZeroSSL).
- **Cookies** (future auth): Set `Secure`, `HttpOnly`, `SameSite=Lax` or `Strict`.
- **Content Security Policy** — CSP Level 3 report-only at first → enforce once no violations reported. See `next.config.ts` headers and tighten as needed.
- **DNSSEC** if your registrar supports it.
- **DMARC/SPF/DKIM** on any sending domain used for contact email replies.

---

## 14. Post-Deploy Smoke Tests

Run these against the live URL. 10 minutes of work, catches 80% of regressions.

| # | Test | Pass if… |
|---|------|---------|
| 1 | Home page loads — `curl -I https://nirmaan.dev` | HTTP 200, content-type HTML |
| 2 | `/sitemap.xml` | 200, valid XML, production URLs present |
| 3 | `/robots.txt` | 200, references sitemap |
| 4 | `/projects/enterprise-analytics-platform` | 200, HTML has `<title>` with the project name |
| 5 | Known 404: `/this-does-not-exist-xyz` | 404 status + custom 404 copy rendered (not generic Vercel) |
| 6 | API route (if exists) POST `/api/contact` with invalid body | 400 with `ok:false` shape |
| 7 | OpenGraph card in [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) | Image, title, desc all correct |
| 8 | Mobile viewport on real phone (not just devtools) | No horizontal scroll, tap targets ≥ 44px |
| 9 | 4 major browsers: Chrome, Firefox, Safari, Edge latest | No layout breakage |
| 10 | Lighthouse run against production URL | Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 90, SEO = 100 |

---

## 15. Deploy Rollout Cadence (Suggested)

| Cadence | Type of change | Pipeline |
|---------|---------------|----------|
| As needed | Docs, typo fixes, README | Merge to main → auto deploy |
| Weekly | Minor features, content updates | Feature PR → preview deploy → review → merge |
| Monthly | Major version bumps (v1 → v2), database migrations | Release branch `release/v1.1.0` → staging 48h → tag + production |

---

*Deployment guide version: 1.0 · Updated: 2025-07-31*

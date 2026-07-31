# Developer Handbook

> 📘 Internal coding standards, architectural decision records (ADRs), and day-to-day engineering guidance for contributors.

---

## Contents

1. [Prerequisites](#1-prerequisites)
2. [Clone, Install, Run](#2-clone-install-run)
3. [NPM Scripts Reference](#3-npm-scripts-reference)
4. [Coding Standards](#4-coding-standards)
5. [TypeScript Rules](#5-typescript-rules)
6. [React / Next.js Patterns](#6-react--nextjs-patterns)
7. [Styling: Tailwind CSS v4 + Design Tokens](#7-styling-tailwind-css-v4--design-tokens)
8. [Accessibility (a11y) Checklist](#8-accessibility-a11y-checklist)
9. [Performance Playbook](#9-performance-playbook)
10. [Testing Strategy](#10-testing-strategy)
11. [Debugging Tips](#11-debugging-tips)
12. [Architectural Decision Records](#12-architectural-decision-records-adrs)
13. [Git & Branch Hygiene](#13-git--branch-hygiene)
14. [Code Review Etiquette](#14-code-review-etiquette)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Prerequisites

| Tool | Minimum | Preferred | Why |
|------|---------|-----------|-----|
| Node.js | 18.17 LTS | 22 LTS | Next.js 16 requirement; 22 has better Turbopack performance. |
| npm | 9.x | Shipped with Node | Lockfile is `package-lock.json`. Use `npm ci` in CI. |
| Git | 2.40 | Latest | Signed commits encouraged. |
| VS Code (recommended) | Latest | Latest | Tailwind IntelliSense, ESLint, TypeScript and error lens extensions. |

Optional but nice:
- `direnv` or `nvm` + `.nvmrc` (create one: `echo "20" > .nvmrc`)
- [Tailwind CSS IntelliSense extension](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- ESLint + Prettier (if added) extensions

---

## 2. Clone, Install, Run

```bash
# 1. Clone (your fork — see CONTRIBUTING.md)
git clone git@github.com:YOUR_USERNAME/nirmal_profile.git
cd nirmal_profile

# 2. Install
npm install

# 3. Env file (Supabase required only for write APIs; default pages work without)
cp .env.example .env.local
# Edit .env.local — optional: fill in Supabase URL + anon key

# 4. Run
npm run dev
# → http://localhost:3000
```

First page load might take ~10s while Turbopack warms up. Subsequent navigations are near-instant.

---

## 3. NPM Scripts Reference

| Script | What it does | When to run |
|--------|-------------|-------------|
| `npm run dev` | Start Next.js dev server with Turbopack, on port 3000 | Daily driver |
| `npm run build` | Type-checks? No — run typecheck separately. Produces `.next/` production bundle. | Before pushing a PR, before deploy. |
| `npm run start` | Serves the last `build` on port 3000 in production mode. | Simulate production locally. |
| `npm run lint` | Runs ESLint 9 flat config. Prints issues. | Before every PR. |
| `npm run lint:fix` | Same, plus `--fix` — auto-fixable rules. | When lint fails. |
| `npm run typecheck` | `tsc --noEmit` across the whole repo. | Before every PR (CI blocks on errors). |
| `npm run clean` | Removes `.next/` and `out/`. | When you see weird stale-cache errors. |

---

## 4. Coding Standards

### 4.1 File Headers

No boilerplate copyright banners on every file. The repo-level LICENSE covers it.

### 4.2 Comments

- **Comments explain WHY, not WHAT.**
  - ✅ Good: `// Cap at 1s to prevent visible lag on item-heavy grids.`
  - ❌ Bad: `// Loop through items`
- **Production comments only** — no "TODO: fixme later" without an issue link. If you leave it, commit to resolving it.
- Doc comments on exported utilities / hooks / component props:

```tsx
/**
 * Reveal-on-scroll wrapper using Framer Motion IntersectionObserver.
 *
 * @param delay     Seconds to delay after entering viewport (stagger children).
 * @param y         Initial offset px before animating to 0. Default 24.
 * @param blur      True to use blur() reveal instead of translate.
 * @param once      Animate only once (default true). False replays on every scroll.
 */
export function Reveal({ … }: RevealProps) { … }
```

### 4.3 No Console Log In Source

Project grep found zero — let's keep it that way. Use a real logger if needed (or in dev, remove before committing).

### 4.4 Single Responsibility Principle

- One file = one main export.
- If a component grows past ~200 lines, split into sub-components colocated in the same folder.
- If a utility file grows past ~150 lines, split by domain.

---

## 5. TypeScript Rules

| Rule | Enforcement |
|------|-------------|
| Strict mode (`strict: true`) | tsconfig — cannot disable |
| No `any` | CI review gate. If absolutely necessary, use `unknown` + narrow, or comment-justified `as unknown as X`. |
| No `@ts-ignore` / `@ts-expect-error` | Same — 1 line comment if you must use one. |
| Prefer `type` or `interface` appropriately | Interfaces for React props & DB records. Types for unions, literals, functions, tuples, maps. |
| Discriminated unions over booleans flags | `{ variant: 'paid' } \| { variant: 'free' }` — NOT `isFree: boolean, isPaid: boolean`. |
| Always import-type for types | `import type { Project } from "@/data/projects"` — avoids bundling runtime unused code. |
| Generic return types inferred when possible | Don't re-annotate. Hover + check is better than explicit signature staleness. |

### Path alias

```ts
import { Button } from "@/components/ui/button";  // ✅ — src/components/ui/button
```

`@/*` resolves to `src/*` (see `tsconfig.json → compilerOptions.paths`). Never use `../../../../` relative imports.

---

## 6. React / Next.js Patterns

### 6.1 Server Components (DEFAULT) — no directive

- **Use when:** Rendering content, reading data, passing props.
- **Can do:** async/await, read files, call DB/supabase server-client, render JSX.
- **Cannot do:** `useState`, `useEffect`, event handlers (`onClick`), browser APIs.
- Performance benefit: smaller client JS bundle, streamed HTML, better SEO.

### 6.2 Client Components — `"use client"` at TOP of file

- **Use when:** state, effects, event handlers, Framer Motion, browser APIs, 3rd-party libs that touch DOM.
- Keep them as small and leafy as possible. The heavy work stays server-side.
- Keep the directive on line 1, before imports.

### 6.3 Data fetching

- **In pages:** Call helper directly in the async Server Component.
- **Don't** `useEffect( () => fetch(…), [])` — that's anti-pattern in Next 13+. Use server fetch + pass down as props to child CCs that need interactivity.

### 6.4 Composition over prop drilling

Pass JSX through children. 3 levels of prop-drill is fine. More → consider composition or a narrowly-scoped context.

### 6.5 Dynamic imports for heavy client code

Anything > ~30 kB that isn't visible above the fold → dynamic:

```tsx
const HeavySearchDialog = dynamic(
  () => import("@/components/shared/search-dialog").then(m => m.SearchDialog),
  { ssr: false, loading: () => <p style={{ visibility: "hidden" }}>…</p> }
);
```

---

## 7. Styling: Tailwind CSS v4 + Design Tokens

### 7.1 Design tokens live in ONE place: `src/app/globals.css`

```css
:root {
  --background: #050505;
  --accent-purple: #8b5cf6;
  --accent-blue:   #3b82f6;
  --accent-cyan:   #06b6d4;
  --radius: 0.75rem;
}
@theme inline {
  --color-background:   var(--background);
  --color-accent-purple: var(--accent-purple);
  --font-display: var(--font-space-grotesk);
  --font-sans: var(--font-geist-sans);
}
```

**Never hardcode hex values in Tailwind utilities.** Use `bg-accent-purple`, not `bg-[#8b5cf6]`. (Exception: genuinely one-off animation dynamic values.)

### 7.2 Spacing & sizing scale

Use Tailwind's 4px scale: `p-2`=8px, `p-6`=24px, etc. Don't use arbitrary `p-[27px]` — pick the closest scale step or add a new token if recurring.

### 7.3 `cn()` utility

```ts
import { cn } from "@/lib/utils";
const merged = cn("px-4 py-2", open && "bg-white/5", className);
```

Always merge user-provided `className` through `cn()` (it uses `tailwind-merge` so `px-4 px-6` resolves to `px-6` correctly).

---

## 8. Accessibility (a11y) Checklist

Per PR that touches UI:

- [ ] All content semantic: `<h1>` one per page; heading order h1/h2/h3 never skipped.
- [ ] All interactive elements: reachable by Tab + activates with Enter/Space.
- [ ] Icon-only buttons have `aria-label`.
- [ ] Form controls have `<label>` (use Radix Label + `htmlFor`).
- [ ] `img` has `alt` (empty `alt=""` for decoration).
- [ ] Dialogs: Esc-to-close, focus-trapped, focus restored to trigger on close. (Radix Dialog gives this for free → use it.)
- [ ] No `outline: none` without a replacement focus ring.
- [ ] Color passes contrast ≥ 4.5:1 body, ≥ 3:1 large text.
- [ ] Motion disabled if `prefers-reduced-motion: reduce`.
- [ ] All content visible with keyboard-only navigation test (you try it).

---

## 9. Performance Playbook

Target: **Lighthouse 95+** on all 4 metrics across all templates.

| Concern | Technique |
|---------|-----------|
| **LCP** | Hero text in HTML on the server (no client-only mount); largest image preload via `next/image priority`; fonts preloaded by `next/font` (already automatic). |
| **CLS** | All images/videos/iframes have explicit aspect ratio containers (`aspect-video`, `aspect-[16/9]`, etc.). No layout shift. |
| **INP** | Event handlers < 50ms; debounce heavy handlers; throttle scroll (Lenis is rAF-aligned). Never do heavy work in `onMouseMove` without rAF. |
| **Bundle size** | `optimizePackageImports` (next.config.ts) → lucide, framer-motion, supabase-js. Ship only what you import. |
| **Caching** | Static routes fully cached by Vercel Edge. ISR for CMS-backed pages when they ship (`revalidate`). |
| **Images** | Always `<Image>` from `next/image` — AVIF + WebP formats, lazy-sizes, responsive srcsets auto-generated. |
| **Scripts** | Analytics via `next/script` with `strategy="lazyOnload"` or after-interactive. Never raw `<script async>` in head. |
| **CSS** | Tailwind v4 generates tiny CSS by only emitting the utilities you actually used. No CSS files > 50 KB target. |

---

## 10. Testing Strategy

Testing is optional for v1 portfolio static content, but required the moment you add:
- Route Handlers (POST /api/contact, etc.)
- Form validation logic
- Analytics instrumentation logic
- CMS data-migration scripts

**Stack recommendation (when the time comes):**

| Layer | Tool |
|-------|------|
| Unit (utils, queries) | `vitest` — fast, ESM-native, in-source tests OK |
| Component (renders + interactions) | `@testing-library/react` |
| E2E (happy-path flows) | `playwright` — login, submit form, view project detail |
| Visual regression | `playwright screenshot` or `chromatic` |
| a11y | `axe-core` + `@axe-core/playwright` on E2E runs |

Smoke test to run locally before every PR:

```bash
npm run lint && npm run typecheck && npm run build
```

---

## 11. Debugging Tips

| Symptom | What to try first |
|---------|-------------------|
| Blank page on dev server | Dev console → check for hydration mismatch. Common cause: `"use client"` missing on a component that uses `useState`. |
| Hydration mismatch text " differs between server and client " | Ensure dates/currency formatted on server match client. Use `next/dynamic ssr:false` for truly client-only widgets. |
| `TypeError: Cannot read properties of undefined` on a server page | Data lookup `getProjectBySlug(slug)` returned `undefined`. Add `notFound()` handler. |
| Tailwind class not applying | Restart dev server? No v4 JIT cache clear needed. Typo? Check `@theme inline` has the token. |
| Build works locally but fails on Vercel | Vercel's Node version might mismatch — set `engines.node` in package.json, or set Node version in Vercel project settings. |
| Image not loading | `next.config.ts` → `remotePatterns` includes the domain? Image component has valid `src` (absolute or `/` relative). |
| Supabase returning empty array | RLS policy blocked it. Check table has RLS enabled + policy matches. |

---

## 12. Architectural Decision Records (ADRs)

ADRs record why we chose what. Add new ADRs here as you introduce new tech.

### ADR-001: Next.js App Router over Pages Router
**Date:** 2025-07-31 · **Status:** Accepted
- Server Components by default shrink client bundles.
- File-system layouts naturally produce the Nav/Foot shell.
- Colocation of route segments with metadata APIs.

### ADR-002: Tailwind v4 CSS-first tokens over JS config
- Single source of truth in globals.css — accessible to both Tailwind `@theme` and vanilla CSS selectors.
- No JS recompile when you tweak a brand color.
- Zero PostCSS plugin config (autoprefixer built-in).

### ADR-003: TS static data over Supabase in v1
- Zero-config onboarding for contributors.
- No DB migration/seed required to run locally.
- Easy swap-over path: helpers become async.

### ADR-004: Radix UI + shadcn pattern over a component library
- No bundled CSS overrides.
- WCAG compliance baked in at the primitive level.
- Design freedom for the premium glass/gradient aesthetic.

### ADR-005: Framer Motion + GSAP coexist
- FM for declarative scroll-reveal (most of the site).
- GSAP loaded for complex timeline scrubbing (planned hero v2).
- Both are in `optimizePackageImports` to avoid full-library bundle.

---

## 13. Git & Branch Hygiene

- **Atomic commits.** One feature = one commit or a clear chain. Squash PR merges keep `main` history linear.
- **Conventional commit messages.** See `CONTRIBUTING.md`.
- **Rebase feature branches** onto latest upstream/main before opening a PR.
- **Never force-push `main` or shared branches.** Feature branches OK, but avoid during active review so comment threads aren't broken.
- Commit messages under 72 chars; include `Closes #123` in PR description (not commit messages) for issue auto-linking.

---

## 14. Code Review Etiquette

**As the author:**
- Keep PRs < ~400 lines when you can. Bigger = split into stacked PRs.
- Fill in the PR checklist.
- Self-review before submitting: read the diff once line-by-line. 50% of bugs you'll catch yourself.

**As the reviewer:**
- Assume positive intent. Ask questions, don't command.
- Distinguish severity: `blocker:` (MUST change), `nit:` (optional), `question:` (curious).
- Acknowledge what's well-done. Silent approval is demotivating.
- Within ~48h on weekdays, respond. If swamped, hand off.

---

## 15. Troubleshooting

### `npm install` fails on optional deps / native modules

```bash
npm run clean
rm -rf node_modules package-lock.json
npm install
```

### Dev server won't start — port 3000 taken

```bash
# Windows PowerShell
netstat -ano | Select-String 3000
# Kill the listed PID:
Stop-Process -Id <PID> -Force

# Or:
npm run dev -- --port 3001
```

### Weird state / stale .next cache

```bash
npm run clean
npm run dev
```

### Build works in dev, fails in production

Check the obvious first:
- `.env.local` values are present in the deploy environment.
- `NEXT_PUBLIC_*` vars — any env var accessed by client components must be prefixed.
- `NODE_ENV=production` causes different dead-code elimination paths. A component conditional on `NODE_ENV === 'development'` disappears.

---

*Handbook version: 1.0 · Updated: 2025-07-31*

*"Simplicity is the ultimate sophistication." — Leonardo da Vinci (also good advice for component design)*

# Maintenance Guide

> 🛠️ Day-to-day operations for maintainers and future-self.

"Adding projects, certificates, videos; changing the homepage, colors, animations; deploying updates & rolling back." — the 80% of what you actually do after the initial ship.

---

## Contents

1. [Maintenance Mindset](#1-maintenance-mindset)
2. [Brand & Identity (single source of truth)](#2-brand--identity)
3. [Adding a New Project](#3-adding-a-new-project)
4. [Adding a Certificate](#4-adding-a-certificate)
5. [Uploading a Video (Product Demo)](#5-uploading-a-video-product-demo)
6. [Creating or Editing a Category](#6-creating-or-editing-a-category)
7. [Changing the Homepage Layout & Content](#7-changing-the-homepage-layout--content)
8. [Changing Colors / Theme / Typography](#8-changing-colors--theme--typography)
9. [Editing Animations](#9-editing-animations)
10. [Editing Services, Pricing, Experience Items](#10-editing-services-pricing-experience-items)
11. [Updating the About Page](#11-updating-the-about-page)
12. [Contact Form Behavior](#12-contact-form-behavior)
13. [SEO Tweaks](#13-seo-tweaks)
14. [Deploying an Update](#14-deploying-an-update)
15. [Rolling Back a Deploy](#15-rolling-back-a-deploy)
16. [Updating Dependencies (Safe Cadence)](#16-updating-dependencies-safe-cadence)
17. [Rebranding the Template for a Different Person](#17-rebranding-the-template-for-a-different-person)

---

## 1. Maintenance Mindset

**Four maxims:**

1. **Make changes in data files first, code files second.** Most content changes never need to touch a component.
2. **One concern per commit.** `chore(content): add 2025 AWS cert` is better than `misc updates`.
3. **Open PR + preview deploy for anything beyond a typo.** Vercel's previews catch "oh the image didn't upload"-type mistakes before production.
4. **Future-self writes the docs.** If you think "I'll remember this quirk" — you won't. Leave a one-line comment or update the appropriate doc.

---

## 2. Brand & Identity

Single source of truth: **[`src/lib/constants.ts`](../src/lib/constants.ts)** → `SITE_CONFIG` + `NAV_LINKS`

```ts
export const SITE_CONFIG = {
  name: "Nirmaan",
  title: "Nirmaan — Full-Stack Developer & Product Engineer",
  description: "Building enterprise-quality digital products…",
  url: "https://nirmaan.dev",
  email: "hello@nirmaan.dev",
  location: "India",
  availability: "Available for freelance & full-time",
  github: "https://github.com/nirmaan",
  linkedin: "https://linkedin.com/in/nirmaan",
  twitter: "https://twitter.com/nirmaan",
  resumeUrl: "/resume.pdf",
};
```

**Change ANY of the following ONLY here:** Name, tagline, meta-description, social links, email, resume path. Do NOT duplicate these strings elsewhere — grep for the hardcoded name and clean it up if you find one.

**Navigation menu** is derived from `NAV_LINKS`. To add/remove/hide/reorder a page:

```ts
export const NAV_LINKS = [
  { href: "/",           label: "Home" },
  { href: "/about",      label: "About" },
  { href: "/projects",   label: "Projects" },
  { href: "/categories", label: "Categories" },
  { href: "/videos",     label: "Videos" },
  { href: "/certificates", label: "Certificates" },
  { href: "/experience", label: "Experience" },
  { href: "/services",   label: "Services" },
  { href: "/contact",    label: "Contact" },
];
```

Navbar shows first 6 items inline on `lg:` breakpoints (you can change `NAV_LINKS.slice(0, 6)` in navbar.tsx); Footer splits into two columns.

---

## 3. Adding a New Project

Projects data file: [`src/data/projects.ts`](../src/data/projects.ts)

### 3.1 Steps

1. **Prepare assets** → drop into `public/projects/`:
   - Cover image: `my-new-project-cover.webp` (recommended 1600×900, WebP format, ~200KB max)
   - Screenshots: `my-new-project-1.webp`, `my-new-project-2.webp`, … (1280×800)
   - Optional demo video: `my-new-project-demo.mp4` in `public/videos/`
2. **Append a new object** to the `projects: Project[]` array in `projects.ts`. Copy an existing entry and change the fields.
3. **Assign a category slug** that matches one in [`src/data/categories.ts`](../src/data/categories.ts) (or create a new category first — see §6).
4. **Mark `featured: true`** if you want it on the homepage. Keep ≤ 3 featured to avoid hero clutter.
5. **Run locally** → `npm run dev`. Open `/projects` and `/projects/your-new-slug`.
6. Verify:
   - Cover image loads (no 404).
   - Tech chips render.
   - Long description wraps cleanly on mobile.
   - `liveUrl` / `githubUrl` links work.
7. **Commit.** Example commit:

   ```bash
   git add -A
   git commit -m "feat(content): add customer-360-power-bi project"
   ```

### 3.2 `Project` interface cheat-sheet

| Field | Type | Notes |
|-------|------|-------|
| `slug` | string | **UNIQUE** URL segment: `customer-360-power-bi` |
| `title` | string | H1 for detail page + card |
| `description` | string | 1-liner; shown on card and OG tags |
| `longDescription` | string | Detail page body paragraph |
| `category` | string | Match a `categories[*].slug` exactly |
| `featured` | boolean | Shown on home FeaturedProjects section |
| `coverImage` | string | `/projects/cover.webp` absolute path |
| `demoVideo?` | string | Optional; `/videos/demo.mp4` |
| `screenshots` | string[] | Array of image paths |
| `features` | string[] | Bullet list on detail page |
| `technologies` | string[] | Tags/chips |
| `duration` | string | "3 months", "6 weeks", etc. |
| `architecture` | string | Long-form paragraph |
| `challenges` | string[] | Bullet list of wins |
| `liveUrl?` | string | External URL (optional) |
| `githubUrl?` | string | Repo URL (optional) |
| `year` | number | 2024 / 2025 / etc. |

---

## 4. Adding a Certificate

Data file: [`src/data/certificates.ts`](../src/data/certificates.ts)

1. Save the certificate image → `public/certificates/aws-saa-2025.jpg`.
2. Add object to `certificates` array.
3. For `verificationUrl` + `credentialId`, copy from the issuer's email / badge dashboard. This lets visitors verify authenticity in 1 click.
4. Commit: `feat(content): add 2025 AWS Solutions Architect cert`.

Fields: `id`, `title`, `issuer`, `issueDate` (YYYY-MM), `expiryDate?`, `imageUrl`, `verificationUrl?`, `credentialId?`, `skills[]`.

---

## 5. Uploading a Video (Product Demo)

Video metadata file: [`src/data/videos.ts`](../src/data/videos.ts)

1. Export from Premiere/DaVinci at **1280×720 or 1920×1080 MP4 H.264**. Target **bitrate ≤ 4 Mbps** so it streams on slow mobile; or dual-encode and provide `.webm` too.
2. Create a thumbnail (JPEG, 1280×720, same frame as first frame of video) → `public/videos/my-demo-thumb.jpg`.
3. Drop video → `public/videos/my-demo.mp4`.
4. Add an entry to `videos.ts`:

   | Field | Example |
   |-------|---------|
   | `id` | `"7"` |
   | `title` | `"Customer 360 Dashboard — Walkthrough"` |
   | `description` | One sentence |
   | `thumbnail` | `/videos/my-demo-thumb.jpg` |
   | `videoUrl` | `/videos/my-demo.mp4` |
   | `duration` | `"2:48"` |
   | `technologies` | `["Power BI", "DAX", "SQL Server"]` |
   | `projectSlug?` | `"customer-360-power-bi"` (links it to the project) |

5. Commit. Run dev → visit `/videos`.
6. Bandwidth note: if you accumulate >5 videos, consider offloading videos to a dedicated CDN (Cloudflare Stream, Bunny.net, Mux) and embedding them — Vercel bandwidth is cheaper than S3 but not free forever.

---

## 6. Creating or Editing a Category

Data file: [`src/data/categories.ts`](../src/data/categories.ts)

### 6.1 Create a new category

1. Think about the slug first (permanent, short, lowercase, URL-safe). Examples: `web-development`, `power-bi`, `ui-ux-design`.
2. Fill in `name`, `description`, `icon` (pick a Lucide icon name — the component imports it dynamically; any valid Lucide export works).
3. Pick a `gradient` from the list or invent a new pair: `"from-<color>-500/20 to-<color>-500/20"`. Keep it subtle — `/20` opacity is the pattern.
4. `projectCount` is an informational chip displayed on the card. Update it manually to reflect how many projects actually live in that category.
5. **Important** — make sure some project(s) in `projects.ts` use `category: "<your-slug>"`, or the category page will be empty-looking.

### 6.2 Edit an existing category

Just edit the fields. Safe; nothing cascades (projects reference by slug, not by index).

### 6.3 Delete a category

1. Move its projects somewhere else (reassign `category` field in `projects.ts`).
2. Remove the object from `categories.ts`.
3. Regenerate sitemap: next build auto-does it.
4. Add a redirect to `next.config.ts` or `vercel.json` if the category was ever indexed (404 → 301 to `/categories`).

---

## 7. Changing the Homepage Layout & Content

Home page file: [`src/app/page.tsx`](../src/app/page.tsx)

Sections it composes (in order):

| Order | Component | File | Editable? |
|-------|-----------|------|-----------|
| 1 | `<Hero />` | `components/home/hero.tsx` | ✅ Title, subtitle, CTA links, background graphic |
| 2 | `<StatsSection />` | `components/home/stats.tsx` | ✅ Data lives in `src/data/experience.ts → stats[]` |
| 3 | `<FeaturedProjects />` | `components/home/featured-projects.tsx` | ✅ Uses `getFeaturedProjects()` automatically |
| 4 | Services-CTA section (inline in page.tsx) | `page.tsx` line 29 | ✅ 3-card array |
| 5 | Final Contact CTA | `page.tsx` line 54 | ✅ Heading + 1 CTA button |

### Common edits:

- **Replace hero headline wording** → edit `Hero.tsx`. Keep it short (3 lines max on mobile).
- **Swap stats** → `src/data/experience.ts → stats: [{ label, value }]`
- **Change number of featured projects shown** → FeaturedProjects.tsx `getFeaturedProjects().slice(0, N)`.
- **Add a section** → Paste a new `<section>` between existing ones. Pattern:
  ```tsx
  <section className="relative px-4 py-24 sm:px-6">
    <div className="mx-auto max-w-6xl">
      {/* content */}
    </div>
  </section>
  ```
  Wrap cards in `<Reveal>` (import from shared/reveal) for scroll-in animation.
- **Remove a section** → delete its JSX block. Nothing else breaks.

---

## 8. Changing Colors / Theme / Typography

Design tokens live in ONE file: **[`src/app/globals.css`](../src/app/globals.css)**.

### 8.1 Colors

```css
:root {
  --background: #050505;          /* page background (almost black) */
  --foreground: #fafafa;          /* default text */
  --muted: #a1a1aa;               /* secondary text */
  --card: #0b0b0b;                /* card surfaces */
  --border: rgba(255, 255, 255, 0.06);   /* default borders */

  /* THE THREE ACCENTS — edit these to rebrand the whole site in 30 seconds */
  --accent-purple: #8b5cf6;   /* primary gradient start — buttons, hero word */
  --accent-blue:   #3b82f6;   /* primary gradient middle */
  --accent-cyan:   #06b6d4;   /* primary gradient end */
}
```

Edit `--accent-purple/--accent-blue/--accent-cyan`. Everything else inherits:
- Gradient buttons (purple → blue)
- Gradient text (purple → blue → cyan)
- Badge variants
- Navbar active-link backgrounds
- Card shadows (purple tint)

For a warm-themed rebrand try e.g. `#f59e0b` (amber) → `#ef4444` (red) → `#ec4899` (pink).

### 8.2 Dark → Light Mode (adding a second theme)

The foundation is ready; all colors use CSS variables (which is why `@theme inline` maps Tailwind colors to them). To add "light":

1. Add a media-query or `.light` overrides block in globals.css:
   ```css
   :root.light { --background:#fafafa; --foreground:#050505; … }
   ```
2. Introduce `next-themes` (already a dep!) provider in `app/layout.tsx` between html/body or in a providers wrapper.
3. Add theme toggle to navbar. (This is a `v2` feature — see roadmap.)

### 8.3 Typography

Fonts are declared in `app/layout.tsx`:
- Geist Sans → sans (`--font-sans`, body copy)
- Geist Mono → mono (`--font-mono`, code / data displays)
- Space Grotesk → display (`--font-display`, headings: Hero, Section titles)

To swap headings to Inter (or anything):

```tsx
// in layout.tsx
const interHeading = Inter({ subsets: ["latin"], variable: "--font-display" });
// append to html className variable list
```

Don't forget to keep at most **3 font families** (performance).

---

## 9. Editing Animations

Animation is layered in three systems.

### 9.1 Framer Motion variants — `src/lib/animations.ts`

Most used patterns: `fadeInUp`, `blurReveal`, `scaleIn`, `staggerContainer`, `slideInLeft`.

**Want a slower overall reveal?** Tweak `duration: 0.6 → 0.8`.
**Want snappier?** `0.4`, but `0.22, 1, 0.36, 1` cubic-bezier is the signature "premium" easing; keep it unless you explicitly want a different feel.

### 9.2 Scroll-Reveal wrapper — `<Reveal>` component in `components/shared/reveal.tsx`

Takes `delay`, `y`, `blur` props. Wrapping a card in `<Reveal delay={i * 0.1}>` gives 100 ms stagger per grid item — this is the 80% case.

### 9.3 3D ProjectCard tilt — `components/shared/project-card.tsx`

Tilt math is inline:
```ts
setRotateX((y - centerY) / centerY * -4);  // 4° max tilt
```
Change `* -4` → `* -2` for subtle; `* -8` for dramatic.

### 9.4 Lenis smooth scroll settings — `components/layout/smooth-scroll.tsx`

Tweak `duration`, `easing`, `smoothWheel` there. Always respect `prefers-reduced-motion` in any custom animation code.

### 9.5 CSS keyframes in globals.css

`@keyframes float`, `pulse-glow`, `gradient-shift` — used via `animate-float` / `animate-pulse-glow` / `animate-gradient` classes. Safe to add more here.

---

## 10. Editing Services, Pricing, Experience Items

All data files, no code changes needed:

| What | File | Structure |
|------|------|-----------|
| Services + Pricing | `src/data/services.ts` | `Service { title, description, icon, duration, startingPrice, currency, technologies, features }` |
| Experience timeline | `src/data/experience.ts` | `Experience { company, role, duration, start/endDate, description, responsibilities[], technologies[], achievements[] }` |
| Education | Same file, `education[]` | |
| Skills matrix | Same file, `skills[]` | |
| Stats strip (Home) | Same file, `stats[]` | |

Edit → save → refresh. Done.

### Prices across currencies

`services.ts` exports `CURRENCY_RATES: Record<string, number>` (USD=1, EUR=0.92, GBP=0.79, INR=83.5). When a future currency picker UI is added, format prices using:
```ts
formatCurrency(service.startingPrice * rate, currency)
```
(`formatCurrency` lives in `src/lib/utils.ts`).

---

## 11. Updating the About Page

Page file: `src/app/about/page.tsx` + content data in `experience.ts` (education, skills). The bio copy is currently inline in `about/page.tsx` — you can move it to a string in `constants.ts` if you change it often.

---

## 12. Contact Form Behavior

UI: `src/components/contact/contact-form.tsx`

v1 renders the form UI. To wire actual submission, see `docs/api.md → §3 Planned Routes`:

1. Create `src/app/api/contact/route.ts` (POST).
2. Add Zod schema validation.
3. Insert into Supabase `contact_submissions` table.
4. (Optional) Email hello@nirmaan.dev via Resend/SMTP.
5. Wire button to call `fetch("/api/contact", { method: "POST", body: JSON.stringify(form) })`.
6. Show toast on success ("I'll reply within 24h") + reset form.

This is the canonical first feature for v2.

---

## 13. SEO Tweaks

| Concern | Where |
|---------|-------|
| `<title>` template + default meta | `app/layout.tsx → export const metadata` |
| Per-page title / description | Individual `page.tsx → export const metadata` |
| Canonical site URL | `SITE_CONFIG.url` (used by `metadataBase`) |
| Sitemap | `app/sitemap.ts` — autogen from NAV_LINKS + projects + categories. |
| Robots allow/disallow | `app/robots.ts` |
| OG image | Drop `/public/og-image.png` (1200×630) |
| Twitter card | Already set to `summary_large_image` in layout metadata. |

**Rule of thumb for each project:**
- The first sentence of `description` = the first sentence of its OG card description. Keep it punchy. 155 chars max.

---

## 14. Deploying an Update

For Vercel deployments (recommended):

```bash
# 1. Verify local
npm run lint && npm run typecheck && npm run build

# 2. Commit + push
git status
git add .
git commit -m "feat(content): add 3 projects + 2 certs"
git push origin main

# 3. Vercel auto-triggers deploy on push to main.
#    Alternatively, from the CLI:
vercel            # preview URL first; sanity check
vercel --prod     # promote to production once smoke-tested
```

For **every deploy:**
- Open `/` → `/projects` → `/projects/newest-slug` → `/contact`.
- Check for 404 images (happens if you forgot to `git add` an asset).
- Check mobile on a real phone.
- Monitor Vercel logs for 10 minutes; if error rate > 1% → rollback.

---

## 15. Rolling Back a Deploy

The most important operation. Practice monthly.

**Vercel Dashboard (2 clicks, 30 seconds):**
1. Deployments → pick the last green deployment before current → `⋯` → **Promote to Production**.
2. Confirm. Traffic flips instantly.

**Vercel CLI:**
```bash
vercel rollback   # interactive selection
```

**Git rollback (for the history):**
```bash
git revert <SHA-of-bad-commit>
# Opens commit message in editor, then:
git push origin main
```
The revert commit triggers a fresh deploy of the good code. Good because it keeps history honest.

Then:
- Open an issue to investigate the root cause.
- Fix on a hotfix branch → PR → preview → merge.

---

## 16. Updating Dependencies (Safe Cadence)

**Weekly:** Dependabot (`.github/dependabot.yml`) opens grouped PRs:
- nextjs group
- react group
- tailwind group
- supabase group
- radix group
- animations group (framer-motion, gsap, lenis)

Review grouped PRs:
1. Check CHANGELOG/release notes for each item in the group.
2. Check CI green.
3. Smoke-test preview deploy for 2 minutes.
4. Squash merge.

**Monthly — manually:**
- `npm outdated` for anything Dependabot doesn't catch.
- **Major version bumps** (e.g. Next 16 → 17, React 19 → 20):
  1. Read the upgrade guide IN FULL.
  2. Make a dedicated release branch `chore/upgrade-next-17`.
  3. Resolve deprecations, run codemods.
  4. Full manual QA of every page before merge.

**Emergency — security advisory:**
- Dependabot alerts → auto PR → merge quickly; if CI is red, investigate same-day.
- Supabase key rotation: rotate keys → paste new into Vercel env → redeploy.

---

## 17. Rebranding the Template for a Different Person

Suppose your friend "Aarav Mehta" wants the same template for himself. Do this checklist in **< 30 minutes**:

1. **`src/lib/constants.ts`**
   - `name`, `title`, `description`, `url`, `email`, `location`, `github`, `linkedin`, `twitter`, `resumeUrl`.
2. **`src/data/projects.ts`** → replace with Aarav's projects.
3. **`src/data/categories.ts`** → keep or remove unused.
4. **`src/data/certificates.ts`, `videos.ts`, `experience.ts`, `services.ts`** → replace content.
5. **`src/app/globals.css`** → `--accent-*` tokens if he wants a different color.
6. **`public/favicon.ico`**, **`public/og-image.png`** → re-export for his brand.
7. **Package metadata** — `package.json` name, description, author, repository, homepage. Optional: `README.md` badge URLs, GitHub repo link.
8. Commit → `feat: initial branding for Aarav Mehta` → push → deploy. Done. ✅

---

*Maintenance guide version: 1.0 · Updated: 2025-07-31*

*"The bitter taste of poor quality remains long after the sweet taste of low price is forgotten."* — keep maintenance standards high.

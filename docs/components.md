# Component Documentation

> 🧩 Complete catalog of every React component: purpose, props, variants, composition rules, and UX guidelines.

---

## 0. How To Use This Doc

```
Component Name           — the PascalCase function name
  File                   — path from repo root
  Kind                   | UI primitive | Shared | Layout | Feature | Provider
  "use client"?          | ✅ Yes (Client Component) | ❌ No (Server Component by default)
  Props                  — interface with defaults
  Variants               — CVA combinations (variant × size)
  When to use it         — UX rule of thumb
  When NOT to use it     — avoid anti-patterns
  Example                — copy-pasteable snippet
```

---

## 1. UI Primitives (`components/ui/*`)

Low-level primitives. No domain vocabulary. Wraps Radix UI + Tailwind + CVA.

---

### `<Button />`

- **File:** `src/components/ui/button.tsx`
- **Kind:** UI primitive
- **"use client":** ❌ No (safe for both — no hooks; Radix Slot is used with `asChild`)

**Props**

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"default" \| "secondary" \| "ghost" \| "outline" \| "link"` | `"default"` | CVA variant |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"default"` | CVA size |
| `asChild` | `boolean` | `false` | Render as the child you pass (for `<Link>` / `<a>`) |
| `className` | `string` | — | Merged safely via `cn()` |
| `disabled` | `boolean` | — | |
| `onClick` | `MouseEventHandler` | — | |
| `ref` | forwarded to `<button>` or Slot | — | |

**Visual Variants**

| Variant | Use it for |
|---------|-----------|
| `default` | Primary action: Start a Conversation, View Project. Purple→Blue gradient, shadow, hover-scale. |
| `secondary` | Secondary CTAs that share a row with a primary: Explore All Services |
| `ghost` | Icon buttons in Nav (search, menu). Low-saturation clickable. |
| `outline` | Cancel / tertiary in a 3-button row. Border + transparent bg. |
| `link` | Inline links that should visually match anchor tags. |

**Sizes**

| Size | Height | Padding | Use case |
|------|--------|---------|----------|
| `sm` | h-9 | px-4, text-xs | Badge-row actions, card micro-CTAs |
| `default` | h-11 | px-6 | Most buttons |
| `lg` | h-13 | px-8, text-base | Hero CTA, section-level CTA |
| `icon` | h-10 w-10 | — | Search, Menu, X, Social icon-only buttons |

**Example: Button as Next.js Link** (the 90% case)

```tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

<Button asChild size="lg">
  <Link href="/contact">
    Start a Conversation
    <ArrowRight className="h-4 w-4" />
  </Link>
</Button>
```

**Example: Icon-only ghost button**

```tsx
<Button variant="ghost" size="icon" aria-label="Open search">
  <Search className="h-4 w-4" />
</Button>
```

---

### `<Card />`

- **File:** `src/components/ui/card.tsx`
- **Kind:** UI primitive (multi-sub-component)
- **"use client":** ❌ No
- **Exports:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

All sub-components forward `className` merged via `cn()`.

**Example**

```tsx
<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Premium Plan</CardTitle>
    <CardDescription>Everything in Starter, plus priority support.</CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="list-disc pl-4 text-sm text-muted">
      <li>Unlimited projects</li>
      <li>7-day support SLA</li>
    </ul>
  </CardContent>
  <CardFooter>
    <Button asChild><Link href="/contact">Upgrade</Link></Button>
  </CardFooter>
</Card>
```

---

### `<Badge />`

- **File:** `src/components/ui/badge.tsx`
- **Kind:** UI primitive
- **Variants:** `default` (white/6 bg), `purple`, `blue`, `cyan`, `success`, `warning`, `destructive`, `outline`

**Example — category chip on a project card**

```tsx
<Badge variant="purple">web development</Badge>
```

---

### `<Input />` & `<Textarea />`

- **File:** `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`
- **Kind:** UI primitive
- **"use client":** ❌ No (pass `ref`)
- **Pattern:** Forward all HTMLInput/HTMLTextArea props + `className` via `cn()`

**Example — use with Radix Label for accessibility**

```tsx
import * as Label from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

<Label.Root htmlFor="email" className="mb-2 block text-sm">Email</Label.Root>
<Input id="email" type="email" placeholder="you@company.com" required />
```

---

## 2. Shared Components (`components/shared/*`)

Used across two or more feature pages. Reusable composition patterns, not primitives.

---

### `<GlassCard />`

- **File:** `src/components/shared/glass-card.tsx`
- **Kind:** Shared composition primitive
- **"use client":** ❌ No (pure layout)
- **Props:** `children`, `className?`, `hoverable?` (default true)
- **Pattern:** `<div className="glass rounded-2xl p-6 …">` + optional hover border-brighten

A **glassmorphism card** is the base content block of the design system. Most sections use it for "boxes of content."

**Don't use when:** the content needs no border/backdrop-blur (i.e. it's already inside another glass card). Prefer plain div + padding to avoid double-blur.

---

### `<SectionHeader />`

- **File:** `src/components/shared/section-header.tsx`
- **Props:** `label`, `title`, `description?`, `align: "left" | "center" = "left"`, `className?`

Section eyebrow + title + paragraph trio. 90% of content sections start with this.

```tsx
<SectionHeader
  label="What I Do"
  title="Services & Expertise"
  description="From concept to deployment, end-to-end solutions."
  align="center"
/>
```

---

### `<Reveal />`

- **File:** `src/components/shared/reveal.tsx`
- **Kind:** Shared animation wrapper
- **"use client":** ✅ Yes (Framer Motion uses hooks)
- **Props:** `children`, `delay?: number = 0`, `y?: number = 24`, `blur?: boolean`, `className?`, `once?: boolean = true`

Wraps children in `<motion.div>` using `whileInView` → element fades + rises when it scrolls into view. Wrap every section title, every card in a grid.

```tsx
<Reveal delay={i * 0.1}>
  <GlassCard>…</GlassCard>
</Reveal>
```

> **UX Rule:** Add delay per-item up to ~1 sec total stagger. Beyond that users get impatient waiting for content.

---

### `<GradientText />`

- **File:** `src/components/shared/gradient-text.tsx`
- **Props:** `children`, `as?: keyof JSX.IntrinsicElements = "span"`, `className?`

Purple → Blue → Cyan text gradient. Use for the ONE hero headline word that must stand out. Don't gradient-ize whole paragraphs.

```tsx
<h2 className="font-display text-4xl">
  Ready to build something <GradientText>exceptional</GradientText>?
</h2>
```

---

### `<MagneticButton />`

- **File:** `src/components/shared/magnetic-button.tsx`
- **"use client":** ✅ Yes
- **Props:** `children`, `strength? = 15` (px), `className?`

Subtle mouse-follow micro-interaction on primary hero CTAs. Avoid on repeated rows of buttons; it's a "one per page" effect.

---

### `<ProjectCard />`

- **File:** `src/components/shared/project-card.tsx`
- **"use client":** ✅ Yes (3D tilt uses `useState`, Framer uses `whileInView`)
- **Props:** `project: Project`, `index?: number`, `featured?: boolean`
- **Composed from:** Reveal + Badge + Link, custom 3D tilt `handleMouseMove`

Renders a card for one `Project` from `@/data/projects`. For `featured: true` it takes 2 columns on `lg:` screens.

---

### `<SearchDialog />`

- **File:** `src/components/shared/search-dialog.tsx`
- **"use client":** ✅ Yes (Radix Dialog + search input state)
- **Props:** `open`, `onOpenChange`
- **Shortcuts:** Cmd/Ctrl+K (auto-registers global keydown)

Global project/category fuzzy search. Owned by Navbar (owns the `open` state). Rendered as sibling of the fixed `<header>` via React Portal (Radix does this).

---

## 3. Layout Components (`components/layout/*`)

Wires the shell of the site. Used inside `app/layout.tsx`.

### `<Navbar />`

- **File:** `src/components/layout/navbar.tsx`
- **"use client":** ✅ Yes (scroll listener, mobile open state, pathname hook)
- **Responsive:**
  - `< lg` → hamburger opens dropdown menu under glass navbar
  - `≥ lg` → inline 6-link nav row + search + CTA
- **Scroll effect:** `window.scrollY > 20` → switches from transparent to `.glass shadow-2xl`.

### `<Footer />`

- **File:** `src/components/layout/footer.tsx`
- **"use client":** ✅ Yes (scrollToTop uses DOM)
- **4-column md layout:** Brand / Nav first half / Nav second half / Social icons + back-to-top.

### `<SmoothScroll />`

- **File:** `src/components/layout/smooth-scroll.tsx`
- **"use client":** ✅ Yes (Lenis instance needs `useEffect`)
- Wraps `children` in a Lenis smooth scroll context. Loaded once at the `<body>` level.

> Accessibility note: Lenis is configured to preserve native scroll for users who prefer reduced motion (check the actual implementation and add `matchMedia('(prefers-reduced-motion)')` if missing — see maintenance docs).

---

## 4. Home Page Sections (`components/home/*`)

Used on `/` only. If you find yourself importing them elsewhere, promote them to `shared/`.

| Component | Purpose |
|-----------|---------|
| `<BackgroundGradient />` | Decorative blurred radial blobs. Fixed behind whole page via `pointer-events-none`. |
| `<Hero />` | Top-of-fold: Headline, gradient-text, primary + secondary CTA, ambient graphic |
| `<StatsSection />` | 4 stat cards (Projects, Years, Tech, Clients) — Reveal staggered |
| `<FeaturedProjects />` | Renders only `getFeaturedProjects()` → 3 cards lg grid |

---

## 5. Feature-Specific Components

| Folder | Component | Role |
|--------|-----------|------|
| `contact/` | `<ContactForm />` | Form: name/email/subject/message. Future: RHF + Zod + POST /api/contact + toast |
| `certificates/` | `<CertificateGallery />` | Grid of certificate cards; click → open lightbox with verificationUrl link |
| `experience/` | `<Timeline />` | Vertical gradient-line experience cards with responsibilities/achievements/tech stacks |
| `services/` | `<ServiceCard />` | Price, duration, icon, feature check list, tech chips |
| `videos/` | `<VideoShowcase />` | Hover-thumbnail video cards → opens modal or plays inline |
| `providers/` | `<Analytics />` | Lazy injects Clarity + GA4 `<script>` only if env vars are set & typeof window |

---

## 6. Parent-Child Hierarchy (At a Glance)

```
Root Layout
├── SmoothScroll
│   ├── BackgroundGradient
│   ├── Navbar
│   │   └── SearchDialog (Radix Portal)
│   ├── main
│   │   └── Home Page
│   │       ├── Hero
│   │       │   ├── GradientText
│   │       │   ├── MagneticButton
│   │       │   └── Button + Link
│   │       ├── StatsSection
│   │       │   └── Reveal × 4 → GlassCard
│   │       ├── FeaturedProjects
│   │       │   └── Reveal × N → ProjectCard
│   │       │       ├── Badge
│   │       │       └── Button
│   │       ├── SectionHeader
│   │       ├── Reveal × N → GlassCard (Services CTA row)
│   │       └── Section "Ready to build"
│   │           └── Button + Link
│   └── Footer
└── AnalyticsProvider
```

---

## 7. Creating a New Component? Checklist

- [ ] **File:** `src/components/<right-folder>/<kebab-case>.tsx`
- [ ] **Export:** named `export function PascalCaseName() {…}` — not default (unless it's a Next.js route)
- [ ] **Props:** Named interface `PascalCaseNameProps`
- [ ] **`className` prop:** Always accept it, always merge via `cn()`
- [ ] **`"use client"` directive?** Only when using hooks, animation, browser APIs, event handlers
- [ ] **Compose not duplicate.** If it's 90% GlassCard + padding → use GlassCard inside, don't copy the backdrop-blur CSS
- [ ] **Ref forwarding** for primitives (Button, Input, Card root) so consumers can measure/focus
- [ ] **A11y:**
  - Icon-only buttons → `aria-label`
  - Forms → `<label htmlFor>` + `id`
  - Focus states visible (don't `outline-none` without a replacement)
- [ ] **Docs:** Add it to this file. Copy-paste one of the entries above as your template.

---

*Components catalog version: 1.0 · Updated: 2025-07-31*

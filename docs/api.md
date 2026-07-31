# API Documentation

> 🔌 Route Handlers, Data-access layer, Supabase schema, validation patterns, and integration points.

---

## Contents

1. [Routes (Frontend → URL surface)](#1-routes-frontend-routing-table)
2. [Static Data APIs (TS module imports)](#2-static-data-apis-srcdata)
3. [HTTP Route Handlers (src/app/api)](#3-http-route-handlers-srcappapi-extensible)
4. [Supabase Integration](#4-supabase-integration)
5. [Recommended Database Schema (v2 CMS)](#5-recommended-database-schema-v2-cms)
6. [Validation Pattern (Zod)](#6-validation-pattern-zod-ready)
7. [SEO Metadata Routes (sitemap, robots)](#7-seo-metadata-routes-sitemap-robots)
8. [Error Handling Convention](#8-error-handling-convention)
9. [Authentication & RLS (v2+)](#9-authentication--rls-v2-admin-cms)

---

## 1. Routes (Frontend Routing Table)

> These are NOT JSON APIs. They are the public URLs of the portfolio. All GET.

| Method | Path | Layout | Page | Server or Client Render |
|--------|------|--------|------|--------------------------|
| `GET` | `/` | Root Layout | Home page: Hero, Stats, Featured, CTA | Server (with CCs) |
| `GET` | `/about` | Root Layout | Bio, Skills, Education, Resume CTA | Server |
| `GET` | `/projects` | Root Layout | All projects grid + filters | Server |
| `GET` | `/projects/:slug` | Root Layout | Single project detail | Server |
| `GET` | `/categories` | Root Layout | Category cards | Server |
| `GET` | `/categories/:slug` | Root Layout | Projects by category | Server |
| `GET` | `/videos` | Root Layout | Demo videos grid | Server |
| `GET` | `/certificates` | Root Layout | Credential gallery | Server |
| `GET` | `/experience` | Root Layout | Career timeline + skills | Server |
| `GET` | `/services` | Root Layout | Services / pricing | Server |
| `GET` | `/contact` | Root Layout | Contact form + info | Server |
| `GET` | `/sitemap.xml` | — | sitemap.ts Metadata route | Server only |
| `GET` | `/robots.txt` | — | robots.ts Metadata route | Server only |
| `GET` | `/favicon.ico` | — | Next.js favicon route | Static |

All routes render as **Server Components by default** — the HTML is produced on the server (Vercel Edge / Node). "use client" components then hydrate on top for interactivity.

---

## 2. Static Data APIs (`src/data`)

In v1.0.0 the portfolio content is sourced from typed TypeScript modules (no DB round-trip). This keeps deploys zero-config, renders instant, and caches perfectly.

Each module exports `Interface` → `collection: Interface[]` → `helper functions`.

### `projects.ts`

```ts
export interface Project { slug; title; description; longDescription; category;
  featured; coverImage; demoVideo?; screenshots; features; technologies;
  duration; architecture; challenges; liveUrl?; githubUrl?; year; }

export const projects: Project[] = [ /* … */ ];

// Queries
export function getProjectBySlug(slug: string): Project | undefined;
export function getFeaturedProjects(): Project[];            // featured === true
export function getProjectsByCategory(category: string): Project[];
```

### `categories.ts`

```ts
export interface Category { slug; name; description; icon; gradient; projectCount; }
export const categories: Category[] = [ /* … */ ];
export function getCategoryBySlug(slug: string): Category | undefined;
```

### `experience.ts`

```ts
export interface Experience { id; company; role; duration; startDate; endDate | null;
  description; responsibilities[]; technologies[]; achievements[]; }
export interface Education { institution; degree; field; duration; description; }
export interface Skill { name; level; category; }

export const experiences: Experience[];
export const education: Education[];
export const skills: Skill[];
export const stats: { label; value }[];   // 40+ projects, 4+ years, etc.
```

### Others

| Module | Shape |
|--------|-------|
| `services.ts` | `Service[]` + `CURRENCY_RATES: Record<string, number>` |
| `certificates.ts` | `Certificate[]` (issuer, dates, verification URL, skills) |
| `videos.ts` | `Video[]` (thumbnails, videoUrl, duration, linked projectSlug) |

### Migration path to Supabase CMS (v2)

When you switch to DB-backed content, ONLY the body of the helper functions changes:

```ts
// Before — static
export function getFeaturedProjects() { return projects.filter(p => p.featured); }

// After — Supabase (Server Component or Route Handler)
import { createClient } from "@/lib/supabase/server";
export async function getFeaturedProjects() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("featured", true);
  return data ?? [];
}
```

Call sites (`FeaturedProjects`, `/projects/page.tsx`, etc.) do NOT need to change — they already await or sync-consume as appropriate.

---

## 3. HTTP Route Handlers (`src/app/api/*`) — Extensible

v1 ships with zero required API routes. The following are **convention stubs** — create the file when you need the feature.

### Planned: `POST /api/contact`

**File:** `src/app/api/contact/route.ts`

```
Request:
  { "name": "Priya Sharma",
    "email": "priya@company.com",
    "subject": "Project inquiry",
    "message": "Hi, we'd like to build…",
    "company?": "Acme Inc",
    "budget?": "10000-25000" }

Response:
  201 { "ok": true, "id": "uuid", "message": "Message received." }
  400 { "ok": false, "error": "Invalid payload", "issues": [{path, msg}] }
  429 { "ok": false, "error": "Too many requests. Try again later." }
```

**Implementation checklist:**
1. Zod schema validation (see §6)
2. Server-only rate-limiting (Upstash Redis or memory store for small scale)
3. `supabase.from('contact_submissions').insert(…).select()`
4. Resend.com / SMTP email to `SITE_CONFIG.email`
5. Return `NextResponse.json(…)`

### Planned: `POST /api/revalidate`

For webhook-driven ISR revalidation when content changes in the CMS:

```
Authorization: Bearer REVALIDATE_SECRET
{ "tags": ["projects", "categories"] }
```

Uses `revalidateTag()` + `revalidatePath()`.

---

## 4. Supabase Integration

Two typed client factories, one for each execution context. **Always pick the correct one** — the server variant wraps cookie operations correctly.

### Browser / Client Components — `@/lib/supabase/client`

```ts
"use client";
import { createClient } from "@/lib/supabase/client";

function SomeCC() {
  const supabase = createClient();  // singleton-like; uses NEXT_PUBLIC_* env
  // safe for: reads from public tables, auth signIn / signUp
}
```

**Source:** `src/lib/supabase/client.ts`
Uses: `@supabase/ssr/createBrowserClient`

### Server Components / Route Handlers — `@/lib/supabase/server`

```tsx
// file: src/app/projects/page.tsx  (Server Component)
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").order("year");
  // …render
}
```

**Source:** `src/lib/supabase/server.ts`
Uses: `@supabase/ssr/createServerClient` + `next/headers.cookies()`

The `setAll` helper catches `Error: Cookies can only be modified in a Server Action or Route Handler` for pure read-only Server Components — that `try/catch` block is intentional.

### Environment Variables Required

| Key | Scope | Required for |
|-----|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Both | All Supabase usage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Both | All Supabase usage (safe in browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side ONLY | Bypasses RLS for admin APIs — **never prefix with `NEXT_PUBLIC_`** |

---

## 5. Recommended Database Schema (v2 CMS)

SQL DDL you'll run in Supabase SQL Editor when promoting the TS-data-layer to a real CMS.

```sql
-- 5.1 Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  long_description text not null,
  category text references categories(slug) on delete set null,
  featured boolean default false,
  cover_image text,
  demo_video text,
  screenshots text[] default '{}',
  features text[] default '{}',
  technologies text[] default '{}',
  duration text,
  architecture text,
  challenges text[] default '{}',
  live_url text,
  github_url text,
  year int check (year > 1990 and year < 2100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5.2 Categories
create table categories (
  slug text primary key,
  name text unique not null,
  description text,
  icon text,
  gradient text,
  sort_order int default 0
);

-- 5.3 Certificates, Experiences, Videos, Services (similar pattern)
-- … (mirrors the TS interfaces in src/data/*)

-- 5.4 Contact submissions
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
  subject text,
  message text not null,
  company text,
  budget text,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now(),
  replied_at timestamptz,
  replied_by uuid references auth(id)
);

-- 5.5 Row Level Security (RLS)
alter table projects enable row level security;
alter table categories enable row level security;
alter table contact_submissions enable row level security;

-- Public read for portfolio content
create policy "Projects are public readable" on projects
  for select using (true);
create policy "Categories are public readable" on categories
  for select using (true);

-- Contact submissions: anonymous insert only; no public read
create policy "Anyone can submit contact form" on contact_submissions
  for insert with check (true);
create policy "Admin can read contact submissions" on contact_submissions
  for select using (auth.role() = 'authenticated' and auth.email() like '%@nirmaan.dev');

-- 5.6 Storage buckets (via Supabase Dashboard → Storage)
--   public: "project-assets"   (covers, screenshots)
--   public: "certificates"    (cert imagery)
--   public: "videos"          (demo .mp4 files)
--   private: "admin"          (resumes, backups)
```

### `updated_at` trigger (paste once)

```sql
create extension if not exists moddatetime;
create trigger handle_updated_at before update on projects
  for each row execute procedure moddatetime (updated_at);
```

---

## 6. Validation Pattern (Zod-ready)

`package.json` ships without Zod, but the v1 design uses a shape that's trivially Zod-ifiable. When adding `/api/contact`, install it:

```bash
npm install zod  # and optionally react-hook-form @hookform/resolvers
```

### Schema example

```ts
// src/lib/validation/contact.ts
import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Please enter a valid email"),
  subject: z.string().trim().min(3).max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(4000),
  company: z.string().trim().max(120).optional(),
  budget: z.enum(["<2k", "2k-5k", "5k-15k", "15k-50k", "50k+"]).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
```

### Usage

**Server-side (Route Handler) — always:**

```ts
const parsed = ContactSchema.safeParse(await req.json());
if (!parsed.success) {
  return NextResponse.json(
    { ok: false, error: "Invalid payload", issues: parsed.error.issues },
    { status: 400 }
  );
}
```

**Client-side (ContactForm) — nice to have:**

Combine with `react-hook-form` + `@hookform/resolvers/zod` for inline error messages without network round-trip.

---

## 7. SEO Metadata Routes (sitemap, robots)

### `sitemap.ts` → `/sitemap.xml`

**File:** `src/app/sitemap.ts`

Dynamically generates:
- Static NAV_LINKS pages
- Each project → `/projects/:slug`
- Each category → `/categories/:slug`

Includes `lastModified`, `changeFrequency`, and `priority`.

### `robots.ts` → `/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://nirmaan.dev/sitemap.xml
```

Add per-path disallow rules here if/when you add `/admin` or draft routes.

---

## 8. Error Handling Convention

### HTTP Route Handlers

Always return `NextResponse.json()` with consistent envelope:

```ts
type ApiEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; issues?: ZodIssue[] };
```

Status codes:

| Status | When |
|--------|------|
| 200 | Successful GET |
| 201 | Successful POST that created a resource (return `Location` header) |
| 204 | Successful DELETE / no body |
| 400 | Validation failed, bad request |
| 401 | Unauthenticated — auth needed |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate slug, etc.) |
| 429 | Rate limit hit |
| 500 | Unknown server error (log it, return generic message, never leak stack) |

### Next.js Error Boundaries (`error.tsx`)

Per-segment error files MUST start with `"use client"` per Next.js rules.

```tsx
// src/app/projects/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <h2 className="text-2xl font-bold">Couldn't load projects.</h2>
      <p className="text-muted">Please try again in a moment.</p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
```

---

## 9. Authentication & RLS (v2 Admin CMS)

When the admin dashboard is added, use this stack:

1. **Auth:** Supabase GoTrue — email magic link or OAuth (GitHub/Google)
2. **Session:** `createClient()` server variant reads session from cookies
3. **Middleware:** `src/middleware.ts` — `matcher: ['/admin/:path*']` — redirects unauthenticated to `/admin/login`
4. **RLS:** Policies reference `auth.uid()` or `auth.email()`. Example above for `contact_submissions`.
5. **Audit:** Every write on admin tables triggers a journal row in `admin_audit(user_id, action, table, old, new)`.

See `docs/maintenance.md → Admin` for how-tos.

---

*API doc version: 1.0 · Updated: 2025-07-31*

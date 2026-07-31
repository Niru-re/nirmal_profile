# Contributing to Nirmaan Portfolio

First off — **thank you** for considering a contribution! Every pull request, bug report, documentation fix, and design suggestion helps make this project better for the entire community.

The following is a set of guidelines for contributing. These are guidelines, not rules — use your best judgment, and feel free to propose changes to this document itself in a pull request.

---

## 📑 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [What Can I Contribute?](#what-can-i-contribute)
3. [First Time Contributor?](#first-time-contributor)
4. [Getting Started](#getting-started)
   - [Fork & Clone](#fork--clone)
   - [Set Up Environment](#set-up-environment)
   - [Create a Branch](#create-a-branch)
5. [Coding Standards](#coding-standards)
   - [Branch Naming](#branch-naming)
   - [Commit Messages](#commit-messages)
   - [TypeScript & React Conventions](#typescript--react-conventions)
   - [Styling (Tailwind CSS 4)](#styling-tailwind-css-4)
   - [Accessibility (a11y)](#accessibility-a11y)
6. [Pull Request Workflow](#pull-request-workflow)
7. [Issue & Bug Reports](#issue--bug-reports)
8. [Feature Requests](#feature-requests)
9. [Review & Merge Process](#review--merge-process)
10. [Release Process](#release-process)

---

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms. Report unacceptable behavior to **hello@nirmaan.dev**.

---

## What Can I Contribute?

Everything is welcome — from a single typo fix to a full feature. Some great first areas:

| Contribution Type            | Examples                                                                 |
|------------------------------|-------------------------------------------------------------------------|
| 🐛 Bug Fixes                 | Broken layouts, wrong data, wrong links, broken animations             |
| 📚 Documentation             | Fix README, improve guides, add code comments, translate docs          |
| 🎨 Design / UI               | Improve dark mode contrast, fix responsive breaks, new section design  |
| ✨ Features                  | New page, new component, CMS integration, blog support                 |
| ⚡ Performance               | Bundle size, LCP, hydration, animation jank, SEO                       |
| ♿ Accessibility             | Missing aria-labels, keyboard trapping, focus rings, color contrast    |
| 🔧 Dev Tooling               | Lint rules, pre-commit hooks, Storybook setup, tests                   |

> **💡 Tip for newcomers:** Look for GitHub issues tagged `good first issue` or `help wanted`.

---

## First Time Contributor?

If you've never contributed to open source before, here's a handholding walkthrough:

1. **Pick a small issue** or fix a typo you noticed.
2. Follow the [Getting Started](#getting-started) steps below.
3. Open a pull request titled `docs: fix typo in X` or similar.
4. Ask any question in the PR description — maintainers will kindly guide you.

No contribution is too small.

---

## Getting Started

### Fork & Clone

1. Go to [https://github.com/Niru-re/nirmal_profile](https://github.com/Niru-re/nirmal_profile).
2. Click the **Fork** button in the top right to create your own copy.
3. Clone *your fork* locally:

```bash
git clone git@github.com:YOUR_GITHUB_USERNAME/nirmal_profile.git
cd nirmal_profile
```

4. Add the **upstream** remote so you can sync the latest changes:

```bash
git remote add upstream https://github.com/Niru-re/nirmal_profile.git
git fetch upstream
```

### Set Up Environment

Requires **Node.js ≥ 18.17** (20 LTS or 22 LTS recommended):

```bash
node -v   # confirm version
npm install
cp .env.example .env.local
```

You do **not** need Supabase credentials to run the portfolio locally — the public pages work fully on static data. Only the future contact-form persistence and admin panel require Supabase.

Start the dev server:

```bash
npm run dev
# → http://localhost:3000
```

### Create a Branch

**Never work directly on `main`.** Create a feature branch:

```bash
# Good:
git checkout -b feat/ai-chatbot
git checkout -b fix/project-card-tilt
git checkout -b docs/maintenance-guide-update
git checkout -b perf/reduce-bundle-size
```

Keep your branch rebased with upstream `main` to reduce merge conflicts:

```bash
git fetch upstream
git rebase upstream/main
```

---

## Coding Standards

### Branch Naming

Use `prefix/short-description`:

| Prefix    | Usage                                   | Examples                                  |
|-----------|-----------------------------------------|-------------------------------------------|
| `feat/`   | New features, pages, routes             | `feat/blog-mdx`, `feat/light-mode`        |
| `fix/`    | Bug fixes, regressions, broken UI       | `fix/mobile-menu-overlay`                 |
| `perf/`   | Performance & bundle optimizations      | `perf/font-preload`                       |
| `style/`  | CSS/styling tweaks (no logic change)    | `style/hero-gradient-alignment`           |
| `refactor/`| Code restructure, no behavior change  | `refactor/data-layer`                     |
| `docs/`   | README, docs, comments                  | `docs/faq-update`                         |
| `test/`   | Adding tests, test infra                | `test/button-spec`                        |
| `chore/`  | Dep upgrades, config, build scripts     | `chore/upgrade-next-16.3`                 |

### Commit Messages

We follow **[Conventional Commits 1.0](https://www.conventionalcommits.org/en/v1.0.0/)**.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

✅ **Good:**
```
feat(projects): add filter-by-year dropdown
fix(ui): correct border radius on mobile glass cards
docs(readme): update env vars list with SUPABASE_SERVICE_ROLE_KEY
perf(home): defer video demo script until user interaction
```

❌ **Avoid:**
```
fixed bug
stuff
update code
```

**Types:** `feat`, `fix`, `perf`, `style`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `revert`.

**Scopes** (optional): Any folder, module, or route name: `home`, `projects`, `ui`, `contact`, `seo`, `analytics`, `build`, etc.

### TypeScript & React Conventions

| Rule | Detail |
|------|--------|
| **Strict mode** | `tsconfig.json` has `strict: true`. Keep it that way. Prefer `unknown` over `any`. |
| **`type` vs `interface`** | Use `interface` for React props & object types with extension. Use `type` for unions, tuples, primitives, and function signatures. |
| **File naming** | React components: `PascalCase.tsx` (e.g. `ProjectCard.tsx`). Utilities: `kebab-case.ts` (e.g. `format-date.ts`). |
| **Colocation** | Keep a component, its types, and its unit tests *together* rather than spread across folders. |
| **Server vs Client** | Add `"use client"` at the very top *only* when a file uses `useState`, `useEffect`, event handlers, browser APIs, or animation libraries (Framer Motion, GSAP). Everything else is a Server Component by default. |
| **Prop drilling** | 2–3 levels is OK. Beyond that → composition or context, but **prefer composition**. |
| **No `as any`** | If you must cast, write a comment explaining *why* it's safe, and prefer `as unknown as Target`. |
| **Exports** | Prefer named exports for components, utilities, and types. Default exports are reserved for Next.js route files (`page.tsx`, `layout.tsx`, etc.). |

### Styling (Tailwind CSS 4)

This project uses **Tailwind CSS v4** with CSS custom property design tokens defined in [`src/app/globals.css`](src/app/globals.css).

**Do's:**

- Use semantic design tokens: `bg-background`, `text-foreground`, `text-muted`, `border`, `accent-purple`, `accent-blue`, `accent-cyan`.
- Use Tailwind utilities for *all* styling — **no inline `style={}`** unless it's a genuinely dynamic value (e.g. 3D tilt `rotateX`).
- Use the `cn()` helper from `@/lib/utils` to merge classes safely with Tailwind conflict resolution.
- Wrap repeated multi-class patterns into a reusable component or a CVA variant.

**Don'ts:**

- Don't hardcode hex colors (e.g. `#8b5cf6`). Use the CSS tokens / Tailwind theme names: `accent-purple`.
- Don't add arbitrary values excessively (`w-[317px]`) — if you see the same value twice, promote it to a token.
- Don't create `*.module.css` files. The design system is utility-first.

### Accessibility (a11y)

- Every interactive element must be keyboard-reachable (Tab) and keyboard-activatable (Enter / Space).
- Icons used without text get `aria-label`.
- Forms have associated `<label>` (use Radix `Label` + `id`).
- Color contrast ≥ WCAG 2.1 AA for body text.
- Images: meaningful ones have `alt`; decorative ones have `alt=""`.
- Dialogs: focus trap, Esc-to-close, focus restoration (Radix Dialog handles this — use it).

---

## Pull Request Workflow

**Every PR should be small & focused.** One feature per PR, one bug per PR. Split large features into multiple stacked PRs when possible.

### Before you submit

1. **Run the full CI locally:**
   ```bash
   npm run lint        # ESLint
   npm run typecheck   # tsc --noEmit
   npm run build       # Production build (catches the most errors)
   ```
2. **Manually verify:**
   - Homepage, Projects page, 1x project detail, About, Contact — all open and render.
   - Mobile (≤ 480px) viewport looks correct.
   - Animations don't jank.
   - Keyboard tab order is logical.
3. **Screenshots / recordings** are *highly recommended* for UI changes.

### Open the PR

Use this title format:

```
<type>(scope): Short summary (under 72 chars)
```

**PR description template** (copy-paste and fill):

```md
### Summary
One or two sentences describing *what* this PR does.

Closes #<issue-number>  (if any)

### Screenshots / Demo
(Attach screenshots, screen recordings, or a live preview URL)

### How to test
1. Checkout this branch.
2. `npm run dev`
3. Navigate to `/example`.
4. Click X, observe Y.

### Checklist
- [ ] I ran `npm run lint`
- [ ] I ran `npm run typecheck`
- [ ] I ran `npm run build` successfully
- [ ] I manually tested mobile viewport
- [ ] I added / updated relevant documentation
- [ ] This PR has a single, focused purpose
```

---

## Issue & Bug Reports

**Search first!** Duplicate issues clutter the tracker.

When you do open a bug report, include:

1. **What happened** — expected vs actual behavior (screenshots 🔜 help a lot).
2. **Reproduction** — exact steps, URLs, data.
3. **Environment** — OS, browser & version, Node version (`node -v`).
4. **Console output** — copy-pasted errors from browser DevTools & terminal.

Use the **🐛 Bug Report** issue template in `.github/ISSUE_TEMPLATE/`.

---

## Feature Requests

Feature suggestions are tracked as GitHub issues too.

Use the **✨ Feature Request** template. Explain:

1. **Problem** — what pain does the feature solve?
2. **Proposed solution** — what should it do?
3. **Alternatives you considered** — even if they're wrong.
4. **Additional context** — mockups, examples from other projects, screenshots.

---

## Review & Merge Process

1. **Automated checks** run on every PR: lint, typecheck, build (set up in `.github/workflows/ci.yml`).
2. A maintainer will **assign a reviewer** or self-assign within ~48 hours on weekdays.
3. The reviewer will leave comments. **Discuss, don't argue** — if there's honest disagreement, move it to a voice call or async doc.
4. Address all review comments via follow-up commits (**don't rebase & force-push during review** — it breaks the comment threads).
5. Once approved, a maintainer **squash-merges** into `main` with a clean commit message.

**Merge strategy:** Squash merge for feature branches, rebase merge for hotfixes.

---

## Release Process

A maintainer will cut a release when enough changes have landed. Steps:

1. Update `CHANGELOG.md` with the new version + date.
2. Bump `version` in `package.json`.
3. Commit: `chore(release): v1.x.y`.
4. Tag: `git tag -a v1.x.y -m "Release v1.x.y"`.
5. Push: `git push upstream main --follow-tags`.
6. Publish a GitHub Release with the changelog section + build artifacts (optional).

See the [Versioning Strategy](CHANGELOG.md#versioning-strategy) table in `CHANGELOG.md`.

---

## Still Have Questions?

- **Open a Discussion** → [GitHub Discussions](https://github.com/Niru-re/nirmal_profile/discussions)
- **Maintainer Email** → [hello@nirmaan.dev](mailto:hello@nirmaan.dev)

Again — **thank you** for your time. Open source lives because people like you care enough to type up a bug report or fix a typo. 🙏

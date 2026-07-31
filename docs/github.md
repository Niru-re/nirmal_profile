# GitHub Guide

> 🐙 Commands, branching, pushing, branch protection, releases & tags, repo metadata & topics.

For the VCS/Git portion of the project lifecycle. Covers the 17 Git-specific commands from the prompt, plus conventions the maintainer team follows.

---

## Contents

1. [Repository Reference](#1-repository-reference)
2. [First-Time Repository Setup](#2-first-time-repository-setup-git-init-flow)
3. [Common Daily Workflow Commands](#3-common-daily-workflow-commands)
4. [Branching Strategy (Trunk-Based with Short-Lived Feature Branches)](#4-branching-strategy)
5. [Commit Convention (Conventional Commits)](#5-commit-convention-conventional-commits)
6. [Tags & Releases](#6-tags--releases)
7. [Branch Protection Rules](#7-branch-protection-rules-repo-settings)
8. [How to Push — Walkthrough with Explanations](#8-how-to-push--full-walkthrough-with-explanations)
9. [Suggested Repository Metadata](#9-suggested-repository-metadata)
10. [Labels](#10-labels)
11. [Security & Permissions](#11-security--permissions)

---

## 1. Repository Reference

| Field | Value |
|-------|-------|
| **GitHub URL** | `https://github.com/Niru-re/nirmal_profile` |
| **SSH clone URL** | `git@github.com:Niru-re/nirmal_profile.git` |
| **HTTPS clone URL** | `https://github.com/Niru-re/nirmal_profile.git` |
| **Default branch** | `main` |
| **Issue tracker** | GitHub Issues (templates in `.github/ISSUE_TEMPLATE/`) |
| **Discussions** | GitHub Discussions (Q&A, feature brainstorming) |
| **License** | MIT |
| **CI/CD** | GitHub Actions (`.github/workflows/ci.yml`) → lint, typecheck, build |

---

## 2. First-Time Repository Setup (`git init` Flow)

If ever starting from zero (already done for this repo, but documented for completeness):

```bash
# 1. Create & enter project folder
mkdir nirmal_profile
cd nirmal_profile

# 2. Initialize a brand-new git repository
git init
# → Creates the .git/ directory (the actual repository metadata).
# → Default branch is "master" on some systems, "main" on others.

# 3. (Optional but recommended) Rename default branch to main right away
git branch -M main

# 4. Create the initial files (README, .gitignore, package.json, src/...)
# echo "# nirmal_profile" >> README.md

# 5. Stage the very first files
git add .

# 6. Create the very first commit (root commit — parent of all history)
git commit -m "chore: initial commit"

# 7. Link this local repo to GitHub (after creating empty repo on GitHub UI)
git remote add origin git@github.com:Niru-re/nirmal_profile.git
# → Registers the GitHub repo as "origin" — your default push/pull remote.
# → You can list remotes any time with `git remote -v`.

# 8. Push main branch upstream, and set the upstream tracking reference
git push -u origin main
# -u (--set-upstream) means future `git push` while on main will know where to go.
# First push ever for main; requires the repo on GitHub to be empty to avoid non-fast-forward errors.
```

---

## 3. Common Daily Workflow Commands

**Understanding every one of these is critical.**

| Step | Command | What it does | When to run |
|------|---------|--------------|-------------|
| **Status check** | `git status` | Prints the current state: which branch, staged/unstaged changes, ahead/behind count. **Run it before every commit.** | Constantly |
| **View changes** | `git diff` (unstaged) / `git diff --staged` (staged) | Line-by-line differences between working tree and index. | Before committing to sanity-check |
| **Stage file(s)** | `git add <file>...` or `git add .` | Copies a file into the staging area ("index"). Only staged files will enter the next commit. | After editing |
| **Commit staged** | `git commit -m "feat: add X"` | Creates an immutable snapshot with message, author, timestamp, parent pointer. | When change-set is atomic & complete |
| **Show log** | `git log --oneline -20` | Last 20 commits one per line. | Before merging / reviewing history |
| **Fetch upstream** | `git fetch upstream` | Downloads latest commits from the `upstream` remote WITHOUT touching your working branch. Safe anytime. | Daily, before branching |
| **Pull current branch** | `git pull --rebase origin main` (on main) | Applies new commits; `--rebase` avoids messy merge commits. | Before opening PRs |
| **Push feature** | `git push origin feature/ai-chatbot` | Uploads local commits to the matching remote branch. Creates the branch on remote if not present. | When ready for review / preview deploy |
| **Create branch** | `git checkout -b feature/blah` | Create + switch. Equivalent `git switch -c feature/blah`. | Every new piece of work. NEVER work directly on main. |
| **Switch branches** | `git switch main` / `git checkout main` | Moves HEAD pointer; updates working directory. Commit or stash first! | When changing context |
| **View branches** | `git branch -a` | Lists local + remote branches. | When forgetting branch name |
| **Delete local branch** | `git branch -d feature/blah` | After merge, clean up. Use `-D` (uppercase) to force-delete unmerged. | Post-merge cleanup |
| **Rebase on main** | `git rebase main` (while on feature branch) | Replays each feature commit on top of latest main, for a linear history. Resolve conflicts per commit. | Before opening PR |
| **Stash WIP** | `git stash push -m "wip: mid refactor"` | Saves dirty state to a stack so you can switch branches cleanly. | When interrupted mid-work |
| **Unstage file** | `git restore --staged <file>` | Removes a file from index without discarding edits in working tree. | Accidental `git add .` |
| **Undo last commit (soft)** | `git reset --soft HEAD~1` | Pops the last commit back into staging. Same files, same diff, uncommitted. | "Oops I committed too early" |
| **Undo working tree changes** | `git restore <file>` | Throws away edits to `<file>` (reverts to HEAD). Destructive — be sure. | Accidental edit on wrong branch |

---

## 4. Branching Strategy

We use **Trunk-Based Development with short-lived feature branches**.

```
main (always deployable green)  ●──●──●──●──────────●────────●───
                                 \     /            \      /
feat/search                    ●──●──┘         fix/csp ●──●──┘
                                      (PR review & CI green)
```

### Naming

```
<type>/<short-kebab-description>
```

| Prefix | Meaning |
|--------|---------|
| `feat/` | New feature, route, capability |
| `fix/` | Bug, regression, broken UX |
| `docs/` | Documentation files, README |
| `chore/` | Dep upgrades, CI tweaks, build scripts, version bumps |
| `perf/` | Performance optimization (no behavior change) |
| `refactor/` | Code restructure — zero behavior change |
| `style/` | Styling-only tweaks (classes, tokens, spacing) |
| `release/` | Release candidate branch for tagging |
| `hotfix/` | Urgent production patch branching off last tag |

### Maximum lifetime of a feature branch

**3–5 working days.** Beyond that → split into smaller PRs stacked against each other, or risk severe merge conflicts + stale review context.

---

## 5. Commit Convention (Conventional Commits)

Required format. CI doesn't enforce it (yet), but the CHANGELOG generator reads from it.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| type | SemVer bump when released |
|------|---------------------------|
| `feat` | MINOR |
| `fix` | PATCH |
| `perf` | PATCH |
| `refactor`, `style`, `chore`, `ci`, `build`, `test`, `docs` | None |
| `!` (appended to type) e.g. `feat!: redesign data layer` | MAJOR (breaking) |

### Examples

```
feat(projects): add filter-by-year dropdown
fix(ui): correct border radius on mobile glass cards
perf(home): defer video demo script until user interaction
docs(readme): update env vars list with SUPABASE_SERVICE_ROLE_KEY
chore(deps): bump next from 16.2.12 → 16.3.0
feat(api): add /api/contact submission endpoint
feat(api)!: switch contact payload schema from form-urlencoded to JSON
BREAKING CHANGE: clients sending multipart/form-data will receive 415 Unsupported Media Type.
```

---

## 6. Tags & Releases

### 6.1 Semantic Versioning (SemVer 2.0)

```
MAJOR . MINOR . PATCH
  1   .   0   .   0
```

| Bump | When | Example |
|------|------|---------|
| MAJOR | Breaking API change | Removing a route, changing Project interface |
| MINOR | Backwards-compatible feature | Adding a blog, adding a filter |
| PATCH | Backwards-compatible bug fix | Fix 404 on category slugs with hyphens |

### 6.2 Tagging a Release (Maintainers)

```bash
# 1. On main, clean working tree
git switch main
git pull upstream main
npm run lint && npm run typecheck && npm run build   # sanity

# 2. Bump version in package.json (pick one):
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.1 → 1.1.0
npm version major   # 1.1.0 → 2.0.0
# ↑ Does 3 things: edits package.json + package-lock, commits, creates annotated git tag v1.x.y

# 3. Push main + tags
git push upstream main --follow-tags
# --follow-tags pushes both the new commit AND the v tag in one go
```

### 6.3 GitHub Release

After the tag arrives on GitHub:

1. Go to `Releases` → **Draft a new release**.
2. **Choose tag** → pick `v1.x.y` you just pushed.
3. **Release title:** `v1.x.y — Short Summary`.
4. Paste the CHANGELOG section for this version into the body.
5. (Optional) Attach the standalone build output or migration SQL.
6. For major versions, check "Create a discussion for this release".
7. **Publish release**. 🎉

---

## 7. Branch Protection Rules (Repo Settings)

In GitHub repo → **Settings → Branches → Branch protection rule for `main`**:

| Rule | Value | Why |
|------|-------|-----|
| **Require a pull request before merging** | ON | No direct pushes |
| **Require approvals** | 1 approval | Avoid solo-maintainer blindness; cross-team review for non-trivial changes |
| **Dismiss stale pull request approvals when new commits are pushed** | ON | Old approval shouldn't cover new code |
| **Require status checks to pass** | ON + check: `lint`, `typecheck`, `build` (matches CI job names) | Green CI gate |
| **Require branches to be up to date before merging** | ON (fast-forward merges only) | Linear history, tests run against actual merged tree |
| **Require signed commits** | OFF (optional — high friction for casual contribs) | ON if compliance required |
| **Require linear history** | ON | Squash merge + rebase merge produce linear |
| **Prevent direct pushes** | ON | Nobody bypasses PR |
| **Include administrators** | ON for maintainer team too | We are not above the rules |

Merge method: **Allow Squash merging only.** (Disable merge commits, disable rebase merges.) Squashing turns a 14-commit PR into one clean commit with the PR title on main.

---

## 8. How to Push — Full Walkthrough (with Explanations)

Scenario: You just wrote a new FAQ section in the README and want to push it up.

```bash
# 0. Check status — always. (reminds you: are you on main? Any dirty files?)
git status

# 1. Create a branch — every piece of work, even docs.
git checkout -b docs/update-faq
# → "Switched to a new branch 'docs/update-faq'"

# 2. Do your editing (edit README.md)

# 3. Re-check status so you only add what you intend
git status
# → On branch docs/update-faq
# → Changes not staged for commit:
# →    modified:   README.md

# 4. Diff review — catch typos before commit
git diff README.md

# 5. Stage the change
git add README.md

# 6. Double-check staged diff before committing
git diff --staged

# 7. Commit with conventional message
git commit -m "docs(readme): add FAQ for self-hosting without Supabase"
# → Creates 1 commit: immutable snapshot + author + message + parent

# 8. Push branch to your fork (origin). First push ever for this branch:
git push -u origin docs/update-faq
# -u sets upstream tracking; next push is just `git push` while on this branch

# 9. Open PR in GitHub UI:
#      base: main  ←  compare: docs/update-faq
#    Fill in PR template checklist.
#    GitHub Actions runs CI. If green → request a review.

# 10. After squash-merge, clean up:
git switch main
git pull upstream main
git branch -d docs/update-faq   # safe local delete
git push origin --delete docs/update-faq  # (optional) remote delete too

# Done. Repeat for every change.
```

---

## 9. Suggested Repository Metadata

In GitHub repo → ⚙️ **Settings → General** (this is the "professional polish" section):

| Field | Value |
|-------|-------|
| **Repository name** | `nirmal_profile` (keep as-is, matches prompt URL) |
| **Description** | ✨ Enterprise-grade portfolio website built with Next.js 16 · Framer Motion animations · Supabase integration · Vercel ready · MIT licensed |
| **Website** | `https://nirmaan.dev` |
| **Topics** (comma-separated, clickable tags for discovery) | `nextjs, nextjs16, react19, typescript, tailwindcss, tailwindcss-v4, portfolio, portfolio-website, framer-motion, gsap, lenis, supabase, radix-ui, shadcn-ui, lucide, vercel, glassmorphism, dark-mode, mit-license, open-source` |
| **Include in the home page** | ☑️ Preserve this repository, ☑️ Releases, ⬜ Packages, ⬜ Deployments, ☑️ Discussions |
| **Features** | ☑️ Issues, ⬜ Wikis (we use docs/ folder), ☑️ Discussions |
| **Default branch** | `main` |

### Banner / Social Preview (Settings → General → Social preview)

Upload a 1280×640 PNG matching the "banner suggestion" aesthetic used at the top of README. This image is what shows when someone shares the repo link on X, Discord, Slack, etc.

### Files on the repo sidebar

GitHub auto-renders files you've already created:
- `README.md` ✅
- `LICENSE` ✅ (shows MIT badge)
- `SECURITY.md` (links the "Security Policy" banner)
- `CODE_OF_CONDUCT.md` (links "Community" banner)

---

## 10. Labels

Labels organize issues and PRs. Suggested set (create them in Issues → Labels → New label):

| Name | Color | Purpose |
|------|-------|---------|
| `bug` | #d73a4a | Confirmed bug / regression |
| `enhancement` | #a2eeef | New feature or request |
| `documentation` | #0075ca | Docs improvement |
| `good first issue` | #7057ff | Onramp for new contributors |
| `help wanted` | #008672 | Maintainer wants help |
| `question` | #d876e3 | Support / discussion → redirect to Discussions |
| `invalid` | #e4e669 | Doesn't seem right; closed without action |
| `wontfix` | #ffffff | Will not be worked on |
| `dependencies` | #0366d6 | Dependabot PRs |
| `performance` | #fbca04 | Speed / bundle size |
| `accessibility` | #5319e7 | A11y |
| `security` | #ee0701 | Vulnerabilities (SECURITY.md tracker) |
| `design` | #ff7f50 | UX / visual design concerns |

---

## 11. Security & Permissions

### Collaborators / Teams (Settings → Access → Collaborators)

| Role | Who | Why |
|------|-----|-----|
| **Admin** | Maintainer (Niru-re) | Danger zone: delete repo, change protection rules |
| **Maintain** | Trusted core contributors | Manage PRs, tags, releases, no admin destructives |
| **Write** | Occasional contributors | Merge when CI + approvals |
| **Triage** | Community managers | Label + close issues, no write access to code |
| **Read** (default public) | Everyone | Fork, clone, open issues, PRs |

### Secret Scanning

GitHub will auto-alert if a committed file contains a Supabase key, AWS key, JWT secret etc.
- Enable it: **Settings → Code security → Secret scanning** + "Push protection" — ON.

### PAT / SSH

- Prefer SSH keys over HTTPS + Personal Access Tokens for day-to-day push.
- If using PATs: create one per device with least-scoped permissions (e.g. `repo` scope only), rotate annually.
- Never paste a token into any `git remote add` URL — it ends up in `.git/config` plaintext.

---

*GitHub guide version: 1.0 · Updated: 2025-07-31*

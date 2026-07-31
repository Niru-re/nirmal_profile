# Security Policy

The Nirmaan Portfolio project and its maintainers take the security of our
software seriously. We appreciate the effort and good faith of security
researchers who responsibly disclose vulnerabilities to us.

This document outlines our security policy, disclosure process, and scope.

---

## 🛡️ Supported Versions

We provide security updates for the **latest stable release** and the current
`main` branch (unreleased). Backports to older tagged versions are made on a
best-effort basis depending on severity.

| Version     | Supported          |
| ----------- | ------------------ |
| `1.0.x`     | ✅ Yes (current)    |
| `< 1.0`     | ❌ No               |

---

## 🚨 Reporting a Vulnerability

### For critical / sensitive vulnerabilities

**Do NOT file a public GitHub issue.** Publicly disclosing a vulnerability
can put the entire user base at risk before a patch is available.

Instead, **email the security team directly**:

> 📧 **hello@nirmaan.dev**
>
> Subject line: `[SECURITY] <short summary>`

Your email should include:

1. **Summary** — a concise description of the vulnerability.
2. **Impact** — what can an attacker achieve? (data leak, account takeover, XSS, SSRF, RCE, DoS, etc.)
3. **Reproduction steps** — exact commands / URLs / inputs to trigger the issue.
4. **Affected versions** — which tags or commits do you know to be affected?
5. **Patch / mitigation** — if you already know a fix, share it.
6. **Your public key** (optional) — if you want encrypted correspondence, attach or link to your PGP key.

**Response timeline:**

| Timeframe   | Action |
|-------------|--------|
| < 24 hours  | Acknowledge receipt of your report. |
| < 72 hours  | Confirm vulnerability, assess severity, set an expected fix date. |
| Every 5 days | Provide a status update as we work on a patch. |

### For low-severity / informational issues

For non-exploitable bugs, informational findings, or dependency bumps:
open a **🐛 Bug Report** issue and prefix the title with `[Security]`.
We still take them seriously and will triage appropriately.

---

## 🔒 What Is In Scope?

Anything in the **public code in this repository** and any **official
production deployment** at [nirmaan.dev](https://nirmaan.dev), including:

- Next.js routes, components, and utilities
- Supabase integration code (client & server wrappers)
- Third-party dependency usage (XSS via dangerouslySetInnerHTML, etc.)
- Build & deployment configuration (next.config.ts, vercel.json, GitHub Actions)
- Environment variable handling & secret exposure

## ⚠️ What Is Out of Scope

- Self-XSS (e.g. pasting JS into DevTools console)
- Attacks requiring MitM, device compromise, or social engineering
- DoS / brute-force against login endpoints on demo instances
- Spam / content issues on community forums or social media
- Vulnerabilities in third-party services themselves (Supabase, Vercel, GitHub) — report them to the relevant provider

---

## 📋 Disclosure Policy (Coordinated)

We practice **responsible coordinated disclosure**. The ideal timeline:

1. **T0:** You report the vulnerability privately to the maintainers.
2. **T0 + 3 days:** Maintainers confirm validity + severity.
3. **T0 + 14 to 90 days (depending on severity):** We release a fix in a new tagged version, publish a GitHub Security Advisory, and you receive credit.
4. **T0 + 90 days (max):** Full public disclosure, even if no patch is ready (rare — we'll be in touch to negotiate if needed).

We **never** disclose your identity or affiliation without written permission.
If you want public credit for the finding, please tell us *how* you'd like to
be named (name, handle, company, link).

---

## 🏅 Hall of Fame

Researchers who disclose valid, actionable, in-scope vulnerabilities are
recognized in the project's **Security Hall of Fame** (this section, or the
GitHub Release notes).

Send us a note with your preferred credit line after your report is confirmed.

---

## 🔐 Secure by Default — Our Commitments

Beyond handling reports, we strive to prevent vulnerabilities at the source:

| Practice | Where it lives |
|----------|---------------|
| No `console.log` statements in source | Audited during release |
| `.env*` files (except `.env.example`) gitignored | `.gitignore` |
| Server-only keys unprefixed (`SUPABASE_SERVICE_ROLE_KEY`, not `NEXT_PUBLIC_*`) | `.env.example` comments |
| Security headers on all routes | `next.config.ts` → `headers()` |
| Sanitized data rendering (React escapes by default; no `dangerouslySetInnerHTML`) | Code review standards |
| Radix UI primitives for focus traps, dismissal, a11y | `components/ui/*` |
| CI build, lint, and typecheck before every merge | `.github/workflows/ci.yml` |
| Dependency updates via Dependabot | `.github/dependabot.yml` (see [CONTRIBUTING](CONTRIBUTING.md)) |

---

## 📚 Related Reading

- [GitHub: Adding a security policy to your repository](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository)
- [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/)
- [Next.js: Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Supabase: Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

*Policy last updated: 2025-07-31 · Version 1.0*

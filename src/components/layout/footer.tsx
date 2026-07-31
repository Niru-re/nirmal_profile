"use client";

import Link from "next/link";
import { ArrowUp, Code2, Link2, AtSign } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#0B0B0B]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <span className="font-display text-lg font-semibold">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Building enterprise-quality digital products with precision and passion.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Navigation</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">More</h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Connect</h4>
            <div className="flex gap-3">
              <a
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted transition-all hover:border-white/20 hover:text-foreground"
                aria-label="GitHub"
              >
                <Code2 className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted transition-all hover:border-white/20 hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Link2 className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted transition-all hover:border-white/20 hover:text-foreground"
                aria-label="Twitter"
              >
                <AtSign className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition-all hover:border-white/20 hover:text-foreground"
          >
            Back to top
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

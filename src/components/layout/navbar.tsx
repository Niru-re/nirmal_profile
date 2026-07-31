"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { SearchDialog } from "@/components/shared/search-dialog";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState<string | null>(null);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6">
        <nav
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6",
            scrolled
              ? "glass shadow-lg shadow-black/20"
              : "bg-transparent"
          )}
        >
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <span className="font-display text-lg font-semibold text-foreground">
              {SITE_CONFIG.name}
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.slice(0, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                  pathname === link.href
                    ? "bg-white/10 text-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              aria-label="Search projects"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/contact"
              className="hidden rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-accent-purple/25 sm:inline-flex"
            >
              Get in Touch
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-4 lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm transition-colors",
                      pathname === link.href
                        ? "bg-white/10 text-foreground"
                        : "text-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

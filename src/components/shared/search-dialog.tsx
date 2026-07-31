"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-lg mx-4 glass rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, technologies..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted sm:inline">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === "" && (
            <p className="px-4 py-8 text-center text-sm text-muted">
              Start typing to search projects...
            </p>
          )}
          {query.trim() !== "" && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted">
              No projects found for &ldquo;{query}&rdquo;
            </p>
          )}
          {results.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/5"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{project.title}</p>
                <p className="text-xs text-muted line-clamp-1">{project.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

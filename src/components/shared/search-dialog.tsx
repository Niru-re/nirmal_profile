"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { certificates } from "@/data/certificates";
import { projects as staticProjects } from "@/data/projects-client";
import { services as staticServices } from "@/data/services";
import { videos as staticVideos } from "@/data/videos";
import { createClient } from "@/lib/supabase/client";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResultItem {
  title: string;
  description: string;
  href: string;
  category?: string;
  keywords: string[];
}

interface SearchResult extends SearchResultItem {
  score: number;
}

function buildFallbackSearchIndex(): SearchResultItem[] {
  const projectItems = staticProjects.map((project) => ({
    title: project.title,
    description: [project.category?.replace(/-/g, " "), project.description].filter(Boolean).join(" • "),
    href: `/projects/${project.slug}`,
    category: project.category,
    keywords: [project.category, ...project.technologies, ...project.features, ...project.challenges],
  }));

  const serviceItems = staticServices.map((service) => ({
    title: service.title,
    description: service.description,
    href: "/services",
    keywords: [service.id, ...service.technologies, ...service.features],
  }));

  const videoItems = staticVideos.map((video) => ({
    title: video.title,
    description: video.description,
    href: "/videos",
    keywords: [video.projectSlug ?? "", ...video.technologies],
  }));

  const certificateItems = certificates.map((certificate) => ({
    title: certificate.title,
    description: `${certificate.issuer} • ${certificate.issueDate}`,
    href: "/certificates",
    keywords: [certificate.issuer, ...certificate.skills],
  }));

  return [...projectItems, ...serviceItems, ...videoItems, ...certificateItems];
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<SearchResultItem[]>(() => buildFallbackSearchIndex());

  useEffect(() => {
    let isMounted = true;

    async function loadSearchIndex() {
      try {
        const supabase = createClient();

        const [projectsData, servicesData, videosData, certificatesData] = await Promise.all([
          supabase.from("projects").select("slug,title,description,category,features,technologies,architecture,challenges,long_description").order("sort_order", { ascending: true, nullsFirst: false }),
          supabase.from("services").select("id,title,description,technologies,features").order("sort_order", { ascending: true, nullsFirst: false }),
          supabase.from("videos").select("title,description,technologies,project_slug").order("sort_order", { ascending: true, nullsFirst: false }),
          supabase.from("certificates").select("title,issuer,skills,issue_date").order("sort_order", { ascending: true, nullsFirst: false }),
        ]);

        if (!isMounted) return;

        const nextIndex: SearchResultItem[] = [];

        if (!projectsData.error && projectsData.data) {
          nextIndex.push(
            ...projectsData.data.map((project: Record<string, unknown>) => ({
              title: String(project.title ?? ""),
              description: [String(project.category ?? "").replace(/-/g, " "), String(project.description ?? "")]
                .filter(Boolean)
                .join(" • "),
              href: `/projects/${String(project.slug ?? "")}`,
              category: String(project.category ?? ""),
              keywords: [
                String(project.category ?? ""),
                ...(Array.isArray(project.technologies) ? project.technologies : []),
                ...(Array.isArray(project.features) ? project.features : []),
                ...(Array.isArray(project.challenges) ? project.challenges : []),
                String(project.architecture ?? ""),
                String(project.long_description ?? ""),
              ].filter(Boolean).map(String),
            }))
          );
        }

        if (!servicesData.error && servicesData.data) {
          nextIndex.push(
            ...servicesData.data.map((service: Record<string, unknown>) => ({
              title: String(service.title ?? ""),
              description: String(service.description ?? ""),
              href: "/services",
              keywords: [
                ...(Array.isArray(service.technologies) ? service.technologies : []),
                ...(Array.isArray(service.features) ? service.features : []),
              ].filter(Boolean).map(String),
            }))
          );
        }

        if (!videosData.error && videosData.data) {
          nextIndex.push(
            ...videosData.data.map((video: Record<string, unknown>) => ({
              title: String(video.title ?? ""),
              description: String(video.description ?? ""),
              href: "/videos",
              keywords: [
                String(video.project_slug ?? ""),
                ...(Array.isArray(video.technologies) ? video.technologies : []),
              ].filter(Boolean).map(String),
            }))
          );
        }

        if (!certificatesData.error && certificatesData.data) {
          nextIndex.push(
            ...certificatesData.data.map((certificate: Record<string, unknown>) => ({
              title: String(certificate.title ?? ""),
              description: `${String(certificate.issuer ?? "")} • ${String(certificate.issue_date ?? "")}`,
              href: "/certificates",
              keywords: [String(certificate.issuer ?? ""), ...(Array.isArray(certificate.skills) ? certificate.skills : [])].filter(Boolean).map(String),
            }))
          );
        }

        setSearchIndex(nextIndex.length > 0 ? nextIndex : buildFallbackSearchIndex());
      } catch (error) {
        console.error("[search] failed to load search index", error);
      }
    }

    loadSearchIndex();

    return () => {
      isMounted = false;
    };
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return [];

    const queryTerms = trimmedQuery.split(/\s+/).filter(Boolean);

    return searchIndex
      .map((item) => {
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        let score = 0;

        if (title.includes(trimmedQuery)) score += 12;
        if (description.includes(trimmedQuery)) score += 5;

        if (item.category?.toLowerCase().includes(trimmedQuery)) score += 6;

        for (const term of queryTerms) {
          if (title.includes(term)) score += 3;
          if (description.includes(term)) score += 2;
          if (item.keywords.some((keyword) => keyword.toLowerCase().includes(term))) score += 3;
        }

        return score > 0 ? { ...item, score } : null;
      })
      .filter((item): item is SearchResult => item !== null)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 12);
  }, [query, searchIndex]);

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
          {results.map((result) => (
            <Link
              key={`${result.title}-${result.href}`}
              href={result.href}
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/5"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{result.title}</p>
                <p className="text-xs text-muted line-clamp-1">{result.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

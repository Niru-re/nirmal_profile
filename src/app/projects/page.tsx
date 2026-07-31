"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/shared/project-card";
import { projects } from "@/data/projects";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? projects.filter((p) => p.category === activeCategory)
    : projects;

  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            label="Portfolio"
            title="All projects"
            description="Explore my complete body of work across web development, data science, design, and more."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-all duration-300",
                activeCategory === null
                  ? "bg-gradient-to-r from-accent-purple to-accent-blue text-white"
                  : "border border-white/10 text-muted hover:text-foreground hover:border-white/20"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-all duration-300",
                  activeCategory === cat.slug
                    ? "bg-gradient-to-r from-accent-purple to-accent-blue text-white"
                    : "border border-white/10 text-muted hover:text-foreground hover:border-white/20"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted">No projects found in this category.</p>
        )}
      </div>
    </div>
  );
}

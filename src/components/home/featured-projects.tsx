"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/shared/project-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects;

  return (
    <section className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            label="Featured Work"
            title="Selected projects"
            description="A curated collection of my best work spanning web development, data science, and product design."
          />
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              featured={i === 0}
            />
          ))}
        </div>

        <Reveal delay={0.3} className="mt-12 text-center">
          <Button asChild variant="secondary" size="lg">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

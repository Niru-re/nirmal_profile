import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Code2, Clock, Calendar } from "lucide-react";
import { getProjectBySlug, getAllProjects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { GlassCard } from "@/components/shared/glass-card";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant="purple">{project.category.replace("-", " ")}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted">
              <Calendar className="h-3.5 w-3.5" /> {project.year}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted">
              <Clock className="h-3.5 w-3.5" /> {project.duration}
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {project.longDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="secondary">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Code2 className="h-4 w-4" />
                  Source Code
                </a>
              </Button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="my-12 aspect-video rounded-2xl bg-gradient-to-br from-accent-purple/10 via-accent-blue/5 to-accent-cyan/10 border border-white/[0.06]" />
        </Reveal>

        <div className="space-y-10">
          <Reveal delay={0.1}>
            <GlassCard>
              <h2 className="mb-4 text-xl font-semibold">Key Features</h2>
              <ul className="space-y-2">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-purple" />
                    {f}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.15}>
            <GlassCard>
              <h2 className="mb-4 text-xl font-semibold">Technology Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <Badge key={t} variant="blue">{t}</Badge>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.2}>
            <GlassCard>
              <h2 className="mb-4 text-xl font-semibold">Architecture</h2>
              <p className="text-sm leading-relaxed text-muted">{project.architecture}</p>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.25}>
            <GlassCard>
              <h2 className="mb-4 text-xl font-semibold">Challenges Solved</h2>
              <ul className="space-y-2">
                {project.challenges.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" />
                    {c}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

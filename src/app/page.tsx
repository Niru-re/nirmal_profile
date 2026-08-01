import { Hero } from "@/components/home/hero";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { StatsSection } from "@/components/home/stats";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProjects } from "@/data/projects";
import { getStats } from "@/data/experience";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProjects, stats] = await Promise.all([
    getFeaturedProjects(),
    getStats(),
  ]);

  return (
    <>
      <Hero />
      <StatsSection stats={stats} />
      <FeaturedProjects projects={featuredProjects} />

      <section className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeader
              label="What I Do"
              title="Services & expertise"
              description="From concept to deployment, I deliver end-to-end solutions that combine technical excellence with premium design."
              align="center"
              className="mx-auto"
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Web Development", desc: "Full-stack apps with Next.js, React, and TypeScript" },
              { title: "Data Analytics", desc: "Dashboards, ETL pipelines, and business intelligence" },
              { title: "UI/UX Design", desc: "Premium interfaces with design systems and prototypes" },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted">{item.desc}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3} className="mt-10 text-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/services">
                Explore All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="relative px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal blur>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to build something{" "}
              <span className="gradient-text">exceptional</span>?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Let&apos;s collaborate on your next project and create something remarkable together.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start a Conversation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

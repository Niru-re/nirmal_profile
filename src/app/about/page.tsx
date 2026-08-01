import type { Metadata } from "next";
import Link from "next/link";
import { Download, Code2, Link2, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllSkills, getAllEducation, getStats } from "@/data/experience";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About",
  description: "Learn about my background, skills, education, and professional journey.",
};

export default async function AboutPage() {
  const [skills, education, stats] = await Promise.all([
    getAllSkills(),
    getAllEducation(),
    getStats(),
  ]);
  const skillCategories = [...new Set(skills.map((s) => s.category))];

  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            label="About Me"
            title="Crafting digital experiences with precision"
            description="I'm a full-stack developer and product engineer passionate about building enterprise-quality applications that combine technical excellence with premium design."
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <GlassCard className="sticky top-28">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20">
                <span className="font-display text-5xl font-bold gradient-text">N</span>
              </div>
              <h3 className="text-center text-xl font-semibold">{SITE_CONFIG.name}</h3>
              <p className="mt-1 text-center text-sm text-accent-blue">Full-Stack Developer</p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <MapPin className="h-4 w-4 shrink-0 text-accent-purple" />
                  {SITE_CONFIG.location}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted hover:text-foreground transition-colors">
                  <Code2 className="h-4 w-4" />
                </a>
                <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted hover:text-foreground transition-colors">
                  <Link2 className="h-4 w-4" />
                </a>
              </div>

              <Button asChild className="mt-6 w-full" variant="secondary">
                <Link href={SITE_CONFIG.resumeUrl}>
                  <Download className="h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </GlassCard>
          </Reveal>

          <div className="lg:col-span-2 space-y-12">
            <Reveal>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat) => (
                  <GlassCard key={stat.label} className="text-center !p-4">
                    <p className="font-display text-2xl font-bold gradient-text">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted">{stat.label}</p>
                  </GlassCard>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="mb-6 text-2xl font-semibold">Skills</h3>
              <div className="space-y-6">
                {skillCategories.map((category) => (
                  <div key={category}>
                    <h4 className="mb-3 text-sm font-medium text-accent-purple uppercase tracking-wider">
                      {category}
                    </h4>
                    <div className="space-y-3">
                      {skills
                        .filter((s) => s.category === category)
                        .map((skill) => (
                          <div key={skill.name}>
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="text-foreground">{skill.name}</span>
                              <span className="text-muted">{skill.level}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/[0.06]">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-blue transition-all duration-1000"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h3 className="mb-6 text-2xl font-semibold">Education</h3>
              {education.map((edu) => (
                <GlassCard key={edu.institution}>
                  <h4 className="text-lg font-semibold text-foreground">{edu.degree}</h4>
                  <p className="text-accent-blue">{edu.institution}</p>
                  <p className="mt-1 text-sm text-muted">{edu.field} · {edu.duration}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{edu.description}</p>
                </GlassCard>
              ))}
            </Reveal>

            <Reveal delay={0.3}>
              <h3 className="mb-4 text-2xl font-semibold">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Badge key={s.name} variant="default">{s.name}</Badge>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

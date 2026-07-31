"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import type { Experience } from "@/data/experience";

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: TimelineProps) {
  const [expanded, setExpanded] = useState<string | null>(experiences[0]?.id ?? null);

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent-purple/50 via-accent-blue/30 to-transparent sm:left-8" />

      <div className="space-y-8">
        {experiences.map((exp, i) => (
          <Reveal key={exp.id} delay={i * 0.15}>
            <div className="relative pl-16 sm:pl-20">
              <div className="absolute left-4 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent-purple bg-background sm:left-6">
                <div className="h-2 w-2 rounded-full bg-accent-purple" />
              </div>

              <button
                onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                className="w-full text-left"
              >
                <div className="glass rounded-2xl p-6 transition-all hover:border-white/15">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-accent-purple" />
                        <span className="text-sm text-muted">{exp.duration}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{exp.role}</h3>
                      <p className="mt-1 text-accent-blue">{exp.company}</p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted transition-transform duration-300 ${
                        expanded === exp.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expanded === exp.id ? "auto" : 0,
                      opacity: expanded === exp.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6">
                      <p className="mb-4 text-sm leading-relaxed text-muted">
                        {exp.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold text-foreground">
                          Responsibilities
                        </h4>
                        <ul className="space-y-1.5">
                          {exp.responsibilities.map((r) => (
                            <li key={r} className="flex items-start gap-2 text-sm text-muted">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-purple" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold text-foreground">
                          Achievements
                        </h4>
                        <ul className="space-y-1.5">
                          {exp.achievements.map((a) => (
                            <li key={a} className="flex items-start gap-2 text-sm text-muted">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-cyan" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="default">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

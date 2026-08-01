"use client";

import { Reveal } from "@/components/shared/reveal";
import { GlassCard } from "@/components/shared/glass-card";

interface StatsSectionProps {
  stats: Array<{ label: string; value: string }>;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <GlassCard className="text-center">
                <p className="font-display text-3xl font-bold gradient-text sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

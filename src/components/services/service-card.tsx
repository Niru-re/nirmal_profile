"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  LayoutDashboard,
  BarChart3,
  Brain,
  Palette,
  Film,
  Clock,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURRENCY_RATES, type Service } from "@/data/services-client";
import { formatCurrency } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  LayoutDashboard,
  BarChart3,
  Brain,
  Palette,
  Film,
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const [currency, setCurrency] = useState("USD");
  const Icon = iconMap[service.icon] ?? Globe;
  const price = service.startingPrice * (CURRENCY_RATES[currency] ?? 1);

  return (
    <Reveal delay={index * 0.1}>
      <GlassCard className="flex h-full flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20">
          <Icon className="h-6 w-6 text-accent-purple" />
        </div>

        <h3 className="mb-2 text-xl font-semibold text-foreground">{service.title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
          {service.description}
        </p>

        <div className="mb-4 flex items-center gap-2 text-sm text-muted">
          <Clock className="h-4 w-4" />
          {service.duration}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {service.technologies.map((tech) => (
            <Badge key={tech} variant="default">{tech}</Badge>
          ))}
        </div>

        <div className="mb-6 border-t border-white/[0.06] pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted">Starting from</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {formatCurrency(price, currency)}
              </p>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-muted outline-none"
            >
              {Object.keys(CURRENCY_RATES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <Button asChild variant="secondary" className="w-full">
          <Link href="/contact">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </GlassCard>
    </Reveal>
  );
}

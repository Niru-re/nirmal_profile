import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2, Palette, BarChart3, Brain, Terminal, PieChart,
  Database, Film, PenTool, Zap, ArrowRight,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { getAllCategories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse projects organized by category — web development, data science, design, and more.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Palette, BarChart3, Brain, Terminal, PieChart, Database, Film, PenTool, Zap,
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            label="Categories"
            title="Explore by expertise"
            description="Each category represents a domain of expertise with its own unique visual identity and curated project collection."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] ?? Code2;
            return (
              <Reveal key={cat.slug} delay={i * 0.06}>
                <Link href={`/categories/${cat.slug}`} className="group block">
                  <div className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br ${cat.gradient} p-6 transition-all duration-500 hover:border-white/12 hover:shadow-xl hover:shadow-accent-purple/5`}>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                      <Icon className="h-6 w-6 text-accent-purple" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent-purple transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted">{cat.projectCount} projects</span>
                      <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent-purple" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

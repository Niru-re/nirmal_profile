import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { ProjectCard } from "@/components/shared/project-card";
import { getAllCategories, getCategoryBySlug } from "@/data/categories";
import { getProjectsByCategory } from "@/data/projects";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = await getAllCategories();
  return all.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const [category, categoryProjects] = await Promise.all([
    getCategoryBySlug(slug),
    getProjectsByCategory(slug),
  ]);
  if (!category) notFound();

  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Link
            href="/categories"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Categories
          </Link>
          <SectionHeader
            label="Category"
            title={category.name}
            description={category.description}
          />
        </Reveal>

        {categoryProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {categoryProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="py-16 text-center">
              <p className="text-muted">Projects in this category coming soon.</p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

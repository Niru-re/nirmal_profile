import type { Metadata } from "next";
import { ProjectsFilters } from "@/components/projects/projects-filters";
import { getAllProjects } from "@/data/projects";
import { getAllCategories } from "@/data/categories";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my complete body of work across web development, data science, design, and more.",
};

export default async function ProjectsPage() {
  const [allProjects, allCategories] = await Promise.all([
    getAllProjects(),
    getAllCategories(),
  ]);
  return <ProjectsFilters allProjects={allProjects} allCategories={allCategories} />;
}

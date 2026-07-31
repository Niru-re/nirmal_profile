import type { MetadataRoute } from "next";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { projects } from "@/data/projects";
import { categories } from "@/data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  const staticPages = NAV_LINKS.map((link) => ({
    url: `${baseUrl}${link.href === "/" ? "" : link.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: link.href === "/" ? 1 : 0.8,
  }));

  const projectPages = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...categoryPages];
}

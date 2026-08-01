export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  projectCount: number;
}

export type CategoryRow = Omit<Category, "projectCount"> & { project_count: number };

export function normalizeCategory(row: CategoryRow): Category {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    gradient: row.gradient,
    projectCount: row.project_count ?? 0,
  };
}

export const categories: Category[] = [
  {
    slug: "web-development",
    name: "Web Development",
    description: "Full-stack applications with modern frameworks and scalable architecture.",
    icon: "Code2",
    gradient: "from-violet-500/20 to-blue-500/20",
    projectCount: 8,
  },
  {
    slug: "web-design",
    name: "Web Design",
    description: "Pixel-perfect interfaces with premium aesthetics and intuitive UX.",
    icon: "Palette",
    gradient: "from-blue-500/20 to-cyan-500/20",
    projectCount: 5,
  },
  {
    slug: "data-science",
    name: "Data Science",
    description: "Insights-driven analytics, visualization, and statistical modeling.",
    icon: "BarChart3",
    gradient: "from-cyan-500/20 to-emerald-500/20",
    projectCount: 4,
  },
  {
    slug: "machine-learning",
    name: "Machine Learning",
    description: "Predictive models, NLP pipelines, and intelligent automation.",
    icon: "Brain",
    gradient: "from-purple-500/20 to-violet-500/20",
    projectCount: 3,
  },
  {
    slug: "python",
    name: "Python",
    description: "Backend services, automation scripts, and data processing pipelines.",
    icon: "Terminal",
    gradient: "from-yellow-500/20 to-orange-500/20",
    projectCount: 6,
  },
  {
    slug: "power-bi",
    name: "Power BI",
    description: "Interactive dashboards and executive reporting solutions.",
    icon: "PieChart",
    gradient: "from-amber-500/20 to-yellow-500/20",
    projectCount: 3,
  },
  {
    slug: "sql",
    name: "SQL",
    description: "Database design, query optimization, and data warehousing.",
    icon: "Database",
    gradient: "from-sky-500/20 to-indigo-500/20",
    projectCount: 4,
  },
  {
    slug: "video-editing",
    name: "Video Editing",
    description: "Product demos, motion graphics, and cinematic presentations.",
    icon: "Film",
    gradient: "from-rose-500/20 to-pink-500/20",
    projectCount: 2,
  },
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    description: "User research, wireframes, prototypes, and design systems.",
    icon: "PenTool",
    gradient: "from-indigo-500/20 to-purple-500/20",
    projectCount: 5,
  },
  {
    slug: "automation",
    name: "Automation",
    description: "Workflow automation, CI/CD pipelines, and intelligent bots.",
    icon: "Zap",
    gradient: "from-teal-500/20 to-cyan-500/20",
    projectCount: 3,
  },
];

export function getAllCategoriesStatic(): Category[] {
  return [...categories];
}
export function getCategoryBySlugStatic(slug: string): Category | null {
  return categories.find((c) => c.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Supabase-backed async functions (fall back to static data when unavailable)
// Using dynamic import() so that next/headers is never pulled into client bundles.
// ---------------------------------------------------------------------------

export async function getAllCategories(): Promise<Category[]> {
  const { loadSupabaseServerClientOrNull } = await import("@/data/_db");
  const supabase = await loadSupabaseServerClientOrNull();
  if (!supabase) return getAllCategoriesStatic();
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("name", { ascending: true });
    if (error) { console.error("[categories] Supabase error:", error.message); return getAllCategoriesStatic(); }
    if (!data || data.length === 0) return getAllCategoriesStatic();
    return (data as CategoryRow[]).map(normalizeCategory);
  } catch (err) { console.error("[categories] fetch failed:", err); return getAllCategoriesStatic(); }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { loadSupabaseServerClientOrNull } = await import("@/data/_db");
  const supabase = await loadSupabaseServerClientOrNull();
  if (!supabase) return getCategoryBySlugStatic(slug);
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) { console.error("[categories/slug] Supabase error:", error.message); return getCategoryBySlugStatic(slug); }
    if (!data) return getCategoryBySlugStatic(slug);
    return normalizeCategory(data as CategoryRow);
  } catch (err) { console.error("[categories/slug] fetch failed:", err); return getCategoryBySlugStatic(slug); }
}

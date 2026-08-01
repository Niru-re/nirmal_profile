export type { Service } from "@/data/services-client";
export { CURRENCY_RATES } from "@/data/services-client";
import type { Service } from "@/data/services-client";

export const services: Service[] = [
  {
    id: "web-dev",
    title: "Website Development",
    description:
      "Premium, performant websites and web applications built with modern frameworks and best practices.",
    icon: "Globe",
    duration: "2–8 weeks",
    startingPrice: 1500,
    currency: "USD",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    features: [
      "Responsive design",
      "SEO optimization",
      "Performance tuning",
      "CMS integration",
      "Analytics setup",
    ],
  },
  {
    id: "dashboard",
    title: "Dashboard Development",
    description:
      "Interactive dashboards and admin panels with real-time data visualization and analytics.",
    icon: "LayoutDashboard",
    duration: "3–10 weeks",
    startingPrice: 2500,
    currency: "USD",
    technologies: ["React", "D3.js", "PostgreSQL", "Power BI"],
    features: [
      "Custom charts & widgets",
      "Real-time data sync",
      "Role-based access",
      "Export & reporting",
      "Mobile responsive",
    ],
  },
  {
    id: "analytics",
    title: "Data Analytics",
    description:
      "Transform raw data into actionable insights with advanced analytics and visualization.",
    icon: "BarChart3",
    duration: "2–6 weeks",
    startingPrice: 1200,
    currency: "USD",
    technologies: ["Python", "SQL", "Power BI", "Pandas"],
    features: [
      "Data cleaning & ETL",
      "Statistical analysis",
      "Interactive reports",
      "Automated pipelines",
      "KPI dashboards",
    ],
  },
  {
    id: "ml",
    title: "Machine Learning",
    description:
      "Custom ML models for prediction, classification, NLP, and intelligent automation.",
    icon: "Brain",
    duration: "4–12 weeks",
    startingPrice: 3000,
    currency: "USD",
    technologies: ["Python", "TensorFlow", "scikit-learn", "FastAPI"],
    features: [
      "Model development",
      "Data preprocessing",
      "API deployment",
      "Performance monitoring",
      "Documentation",
    ],
  },
  {
    id: "ui-design",
    title: "UI Design",
    description:
      "Beautiful, user-centered interface designs with comprehensive design systems.",
    icon: "Palette",
    duration: "1–4 weeks",
    startingPrice: 800,
    currency: "USD",
    technologies: ["Figma", "Adobe XD", "Prototyping"],
    features: [
      "Wireframes & mockups",
      "Design system",
      "Interactive prototypes",
      "Accessibility audit",
      "Developer handoff",
    ],
  },
  {
    id: "video",
    title: "Video Editing",
    description:
      "Professional product demos, promotional videos, and motion graphics.",
    icon: "Film",
    duration: "1–3 weeks",
    startingPrice: 500,
    currency: "USD",
    technologies: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    features: [
      "Product demos",
      "Motion graphics",
      "Color grading",
      "Sound design",
      "Multi-format export",
    ],
  },
];

type ServiceRow = Omit<Service, "startingPrice"> & { starting_price: number };

function normalize(row: ServiceRow): Service {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    duration: row.duration ?? "",
    startingPrice: Number(row.starting_price) ?? 0,
    currency: row.currency ?? "USD",
    technologies: row.technologies ?? [],
    features: row.features ?? [],
  };
}

export async function getAllServices(): Promise<Service[]> {
  const { loadSupabaseServerClientOrNull } = await import("@/data/_db");
  const supabase = await loadSupabaseServerClientOrNull();
  if (!supabase) return [...services];
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("title", { ascending: true });
    if (error) { console.error("[services] Supabase error:", error.message); return [...services]; }
    if (!data || data.length === 0) return [...services];
    return (data as ServiceRow[]).map(normalize);
  } catch (err) { console.error("[services] fetch failed:", err); return [...services]; }
}

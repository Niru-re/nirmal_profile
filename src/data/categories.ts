export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  projectCount: number;
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

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

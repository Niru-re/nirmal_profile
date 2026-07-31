export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string | null;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
}

export const experiences: Experience[] = [
  {
    id: "1",
    company: "TechVentures Inc.",
    role: "Senior Full-Stack Developer",
    duration: "Jan 2024 — Present",
    startDate: "2024-01",
    endDate: null,
    description:
      "Leading development of enterprise SaaS products with a focus on performance, scalability, and premium user experience.",
    responsibilities: [
      "Architect and build full-stack features for a B2B analytics platform serving 10K+ users",
      "Lead code reviews and establish engineering best practices across the team",
      "Collaborate with design team to implement pixel-perfect, accessible interfaces",
      "Optimize application performance achieving 95+ Lighthouse scores",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS", "Docker"],
    achievements: [
      "Reduced page load time by 45% through code splitting and caching strategies",
      "Shipped 3 major product features ahead of schedule",
      "Mentored 2 junior developers to mid-level proficiency",
    ],
  },
  {
    id: "2",
    company: "DataFlow Solutions",
    role: "Full-Stack Developer",
    duration: "Jun 2022 — Dec 2023",
    startDate: "2022-06",
    endDate: "2023-12",
    description:
      "Built data visualization tools and analytics dashboards for enterprise clients in finance and healthcare.",
    responsibilities: [
      "Developed interactive dashboards using React and D3.js",
      "Built RESTful APIs and GraphQL endpoints for data services",
      "Implemented ETL pipelines for real-time data processing",
      "Created automated testing suites with 90%+ coverage",
    ],
    technologies: ["React", "Node.js", "Python", "PostgreSQL", "Power BI", "GraphQL"],
    achievements: [
      "Delivered 8 client projects on time with 100% satisfaction rate",
      "Built reusable component library adopted by entire engineering team",
      "Automated reporting saving 20+ hours per week for analytics team",
    ],
  },
  {
    id: "3",
    company: "Creative Digital Agency",
    role: "Frontend Developer & Designer",
    duration: "Mar 2021 — May 2022",
    startDate: "2021-03",
    endDate: "2022-05",
    description:
      "Designed and developed premium websites and web applications for diverse clients across industries.",
    responsibilities: [
      "Designed and implemented responsive websites for 15+ clients",
      "Created UI/UX prototypes and design systems in Figma",
      "Developed custom WordPress themes and React applications",
      "Managed client relationships and project timelines",
    ],
    technologies: ["React", "Next.js", "Figma", "WordPress", "Tailwind CSS", "GSAP"],
    achievements: [
      "Won agency's 'Best Design' award for e-commerce redesign project",
      "Increased client conversion rates by average of 35%",
      "Built agency's first component library reducing dev time by 40%",
    ],
  },
];

export interface Education {
  institution: string;
  degree: string;
  field: string;
  duration: string;
  description: string;
}

export const education: Education[] = [
  {
    institution: "University of Technology",
    degree: "Bachelor of Technology",
    field: "Computer Science & Engineering",
    duration: "2017 — 2021",
    description:
      "Focused on software engineering, data structures, machine learning, and web technologies.",
  },
];

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export const skills: Skill[] = [
  { name: "TypeScript", level: 95, category: "Frontend" },
  { name: "React / Next.js", level: 95, category: "Frontend" },
  { name: "Tailwind CSS", level: 90, category: "Frontend" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Python", level: 90, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Database" },
  { name: "Supabase", level: 80, category: "Backend" },
  { name: "Power BI", level: 85, category: "Analytics" },
  { name: "Machine Learning", level: 75, category: "AI/ML" },
  { name: "Figma", level: 85, category: "Design" },
  { name: "Docker", level: 75, category: "DevOps" },
  { name: "AWS", level: 70, category: "DevOps" },
];

export const stats = [
  { label: "Projects Completed", value: "40+" },
  { label: "Years Experience", value: "4+" },
  { label: "Technologies", value: "25+" },
  { label: "Happy Clients", value: "30+" },
];

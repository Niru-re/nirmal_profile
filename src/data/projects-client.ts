/**
 * Client-safe project data — ZERO server-side imports.
 * Use this in "use client" components (e.g. search dialog, filters).
 * Server Components should use the async functions from projects.ts instead.
 */

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  featured: boolean;
  coverImage: string;
  demoVideo?: string;
  screenshots: string[];
  features: string[];
  technologies: string[];
  duration: string;
  architecture: string;
  challenges: string[];
  liveUrl?: string;
  githubUrl?: string;
  year: number;
}

export const projects: Project[] = [
  {
    slug: "enterprise-analytics-platform",
    title: "Enterprise Analytics Platform",
    description:
      "Real-time business intelligence dashboard with predictive analytics and custom reporting.",
    longDescription:
      "A comprehensive analytics platform designed for enterprise teams to visualize KPIs, track performance metrics, and generate AI-powered insights. Built with a focus on scalability, real-time data processing, and an intuitive user experience.",
    category: "web-development",
    featured: true,
    coverImage: "/projects/analytics-cover.jpg",
    demoVideo: "/videos/analytics-demo.mp4",
    screenshots: ["/projects/analytics-1.jpg", "/projects/analytics-2.jpg", "/projects/analytics-3.jpg"],
    features: [
      "Real-time data streaming with WebSocket integration",
      "Custom dashboard builder with drag-and-drop widgets",
      "AI-powered anomaly detection and forecasting",
      "Role-based access control and team collaboration",
      "Export to PDF, Excel, and scheduled email reports",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Python", "Power BI"],
    duration: "4 months",
    architecture:
      "Microservices architecture with Next.js frontend, FastAPI backend, PostgreSQL for persistence, Redis for caching, and Apache Kafka for event streaming.",
    challenges: [
      "Optimized query performance for datasets exceeding 10M rows",
      "Implemented real-time sync across 50+ concurrent dashboard users",
      "Designed a flexible widget system supporting 20+ chart types",
    ],
    liveUrl: "https://demo.example.com",
    githubUrl: "https://github.com/nirmaan/analytics-platform",
    year: 2025,
  },
  {
    slug: "ai-content-studio",
    title: "AI Content Studio",
    description:
      "Generative AI platform for creating, editing, and publishing multimedia content at scale.",
    longDescription:
      "An end-to-end content creation platform leveraging large language models and diffusion models to help teams produce high-quality written and visual content.",
    category: "machine-learning",
    featured: true,
    coverImage: "/projects/ai-studio-cover.jpg",
    demoVideo: "/videos/ai-studio-demo.mp4",
    screenshots: ["/projects/ai-studio-1.jpg", "/projects/ai-studio-2.jpg"],
    features: [
      "Multi-model AI generation (text, image, video)",
      "Brand voice training and consistency checks",
      "Collaborative real-time editing",
      "Content calendar and scheduling",
      "SEO optimization suggestions",
    ],
    technologies: ["React", "Python", "FastAPI", "OpenAI API", "Supabase", "Tailwind CSS"],
    duration: "3 months",
    architecture:
      "React SPA with FastAPI middleware orchestrating multiple AI providers. Supabase for auth and storage.",
    challenges: [
      "Reduced AI generation latency by 60% through intelligent caching",
      "Built a prompt engineering pipeline for consistent brand output",
      "Handled rate limiting across multiple AI provider APIs",
    ],
    liveUrl: "https://demo.example.com",
    githubUrl: "https://github.com/nirmaan/ai-content-studio",
    year: 2025,
  },
  {
    slug: "design-system-hub",
    title: "Design System Hub",
    description:
      "Comprehensive design system with component library, documentation, and Figma integration.",
    longDescription:
      "A living design system that serves as the single source of truth for product teams.",
    category: "ui-ux-design",
    featured: true,
    coverImage: "/projects/design-system-cover.jpg",
    screenshots: ["/projects/design-system-1.jpg", "/projects/design-system-2.jpg"],
    features: [
      "50+ accessible React components",
      "Design token management with theming",
      "Interactive documentation with Storybook",
      "Figma plugin for design-code sync",
      "Automated visual regression testing",
    ],
    technologies: ["React", "TypeScript", "Storybook", "Tailwind CSS", "Figma API"],
    duration: "2 months",
    architecture:
      "Monorepo with packages for tokens, components, and documentation.",
    challenges: [
      "Achieved WCAG 2.1 AA compliance across all components",
      "Reduced design-to-development handoff time by 70%",
      "Built a token pipeline syncing Figma variables to CSS custom properties",
    ],
    githubUrl: "https://github.com/nirmaan/design-system-hub",
    year: 2024,
  },
  {
    slug: "ecommerce-dashboard",
    title: "E-Commerce Command Center",
    description:
      "Unified dashboard for managing inventory, orders, customers, and revenue analytics.",
    longDescription:
      "A powerful e-commerce management platform providing merchants with real-time visibility into their business operations.",
    category: "web-development",
    featured: false,
    coverImage: "/projects/ecommerce-cover.jpg",
    screenshots: ["/projects/ecommerce-1.jpg"],
    features: [
      "Real-time inventory management",
      "Order processing automation",
      "Customer segmentation and CRM",
      "Revenue forecasting with ML models",
      "Multi-channel sales integration",
    ],
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Chart.js"],
    duration: "3 months",
    architecture:
      "Next.js full-stack application with tRPC for type-safe APIs, PostgreSQL with Prisma ORM.",
    challenges: [
      "Integrated 5 third-party sales channels into a unified view",
      "Built inventory sync handling 100K+ SKUs",
    ],
    liveUrl: "https://demo.example.com",
    year: 2024,
  },
  {
    slug: "data-pipeline-automation",
    title: "Data Pipeline Automation",
    description:
      "Automated ETL pipelines for ingesting, transforming, and loading data from multiple sources.",
    longDescription:
      "An enterprise-grade data pipeline system that automates the extraction, transformation, and loading of data.",
    category: "automation",
    featured: false,
    coverImage: "/projects/pipeline-cover.jpg",
    screenshots: ["/projects/pipeline-1.jpg"],
    features: [
      "Visual pipeline builder",
      "Scheduled and event-triggered runs",
      "Data quality validation rules",
      "Error handling with automatic retries",
      "Pipeline monitoring dashboard",
    ],
    technologies: ["Python", "Apache Airflow", "SQL", "Docker", "AWS S3"],
    duration: "2 months",
    architecture:
      "Apache Airflow orchestrating Python ETL scripts, with data stored in AWS S3.",
    challenges: [
      "Processed 500GB+ daily data volume reliably",
      "Reduced pipeline failure rate to under 0.1%",
    ],
    githubUrl: "https://github.com/nirmaan/data-pipeline",
    year: 2024,
  },
  {
    slug: "power-bi-sales-dashboard",
    title: "Sales Performance Dashboard",
    description:
      "Executive Power BI dashboard with drill-down analytics and automated refresh.",
    longDescription:
      "A comprehensive sales analytics dashboard built in Power BI for real-time visibility into sales performance.",
    category: "power-bi",
    featured: false,
    coverImage: "/projects/powerbi-cover.jpg",
    screenshots: ["/projects/powerbi-1.jpg"],
    features: [
      "Interactive drill-down by region and product",
      "Automated daily data refresh",
      "Mobile-optimized report views",
      "Custom DAX measures for KPIs",
      "Embedded sharing with row-level security",
    ],
    technologies: ["Power BI", "DAX", "SQL Server", "Azure Data Factory"],
    duration: "1 month",
    architecture:
      "Azure Data Factory for ETL, SQL Server as data source, Power BI Service for publishing.",
    challenges: [
      "Optimized DAX queries reducing report load time by 80%",
      "Implemented row-level security for 200+ users",
    ],
    year: 2024,
  },
];

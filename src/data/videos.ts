// ⚠️  Import MUST be at the top — never after function definitions
import { videoUrl as toVideoUrl, thumbnailUrl as toThumbUrl } from "@/lib/storage";

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  technologies: string[];
  projectSlug?: string;
}

// Static fallback — used when Supabase is unavailable or returns no rows
export const videos: Video[] = [
  {
    id: "1",
    title: "Enterprise Analytics Platform — Full Demo",
    description:
      "Complete walkthrough of the analytics platform showcasing real-time dashboards, custom widgets, and AI-powered insights.",
    thumbnail: "/videos/analytics-thumb.jpg",
    videoUrl: "/videos/analytics-demo.mp4",
    duration: "4:32",
    technologies: ["Next.js", "PostgreSQL", "Python"],
    projectSlug: "enterprise-analytics-platform",
  },
  {
    id: "2",
    title: "AI Content Studio — Product Overview",
    description:
      "Demonstration of the AI content generation platform with multi-model support and collaborative editing.",
    thumbnail: "/videos/ai-studio-thumb.jpg",
    videoUrl: "/videos/ai-studio-demo.mp4",
    duration: "3:15",
    technologies: ["React", "Python", "OpenAI"],
    projectSlug: "ai-content-studio",
  },
  {
    id: "3",
    title: "Design System Hub — Component Library Tour",
    description:
      "Tour of the design system including component documentation, theming, and Figma integration.",
    thumbnail: "/videos/design-system-thumb.jpg",
    videoUrl: "/videos/design-system-demo.mp4",
    duration: "5:48",
    technologies: ["React", "Storybook", "Figma"],
    projectSlug: "design-system-hub",
  },
  {
    id: "4",
    title: "E-Commerce Dashboard — Feature Showcase",
    description:
      "Overview of inventory management, order processing, and revenue analytics features.",
    thumbnail: "/videos/ecommerce-thumb.jpg",
    videoUrl: "/videos/ecommerce-demo.mp4",
    duration: "2:56",
    technologies: ["Next.js", "Stripe", "Chart.js"],
    projectSlug: "ecommerce-dashboard",
  },
];

type VideoRow = Omit<Video, "videoUrl" | "projectSlug"> & {
  video_url: string;
  project_slug: string | null;
};

function normalize(row: VideoRow): Video {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description ?? "",
    // storageUrl passes through absolute URLs and /public paths unchanged,
    // and builds a full Supabase Storage URL for bare filenames.
    thumbnail: toThumbUrl(row.thumbnail ?? ""),
    videoUrl: toVideoUrl(row.video_url ?? ""),
    duration: row.duration ?? "",
    technologies: row.technologies ?? [],
    projectSlug: row.project_slug ?? undefined,
  };
}

export async function getAllVideos(): Promise<Video[]> {
  const { loadSupabaseServerClientOrNull } = await import("@/data/_db");
  const supabase = await loadSupabaseServerClientOrNull();
  if (!supabase) return [...videos];
  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false });
    if (error) {
      console.error("[videos] Supabase error:", error.message);
      return [...videos];
    }
    if (!data || data.length === 0) return [...videos];
    return (data as VideoRow[]).map(normalize);
  } catch (err) {
    console.error("[videos] fetch failed:", err);
    return [...videos];
  }
}

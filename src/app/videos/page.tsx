import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { VideoShowcase } from "@/components/videos/video-showcase";
import { getAllVideos } from "@/data/videos";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch project demonstrations and product walkthroughs.",
};

export default async function VideosPage() {
  const videos = await getAllVideos();
  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            label="Showcase"
            title="Project videos"
            description="Watch detailed demonstrations of my projects — from architecture walkthroughs to feature showcases."
          />
        </Reveal>
        <VideoShowcase videos={videos} />
      </div>
    </div>
  );
}

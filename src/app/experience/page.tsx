import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { Timeline } from "@/components/experience/timeline";
import { experiences } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience and career timeline.",
};

export default function ExperiencePage() {
  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeader
            label="Career"
            title="Work experience"
            description="A timeline of my professional journey building products, leading teams, and delivering impact."
          />
        </Reveal>
        <Timeline experiences={experiences} />
      </div>
    </div>
  );
}

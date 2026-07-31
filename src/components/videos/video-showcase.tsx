"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import type { Video } from "@/data/videos";

interface VideoShowcaseProps {
  videos: Video[];
}

export function VideoShowcase({ videos }: VideoShowcaseProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handleMouseEnter = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (id: string) => {
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {videos.map((video, i) => (
        <Reveal key={video.id} delay={i * 0.1}>
          <GlassCard className="overflow-hidden !p-0 group">
            <div
              className="relative aspect-video cursor-pointer overflow-hidden bg-gradient-to-br from-accent-purple/10 to-accent-blue/10"
              onMouseEnter={() => handleMouseEnter(video.id)}
              onMouseLeave={() => handleMouseLeave(video.id)}
              onClick={() => setActiveVideo(activeVideo === video.id ? null : video.id)}
            >
              {activeVideo === video.id ? (
                <video
                  ref={(el) => { videoRefs.current[video.id] = el; }}
                  src={video.videoUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    src={video.videoUrl}
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover opacity-0"
                  />
                </>
              )}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                {video.duration}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-foreground">{video.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                {video.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {video.technologies.map((tech) => (
                  <Badge key={tech} variant="default">{tech}</Badge>
                ))}
              </div>
              {video.projectSlug && (
                <Link
                  href={`/projects/${video.projectSlug}`}
                  className="mt-3 inline-block text-sm text-accent-purple hover:underline"
                >
                  View Project →
                </Link>
              )}
            </div>
          </GlassCard>
        </Reveal>
      ))}
    </div>
  );
}

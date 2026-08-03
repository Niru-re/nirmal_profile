"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
  featured?: boolean;
}

export function ProjectCard({ project, index = 0, featured = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / centerY * -4);
    setRotateY((x - centerX) / centerX * 4);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="group"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card transition-all duration-500",
            "hover:border-white/12 hover:shadow-2xl hover:shadow-accent-purple/5",
            featured && "lg:col-span-2"
          )}
        >
          {project.coverImage ? (
            <div
              className={cn(
                "relative overflow-hidden bg-gradient-to-br from-accent-purple/10 via-accent-blue/5 to-accent-cyan/10",
                featured ? "aspect-[16/9]" : "aspect-[16/10]"
              )}
            >
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
            </div>
          ) : null}

          <div className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="purple">{project.category.replace("-", " ")}</Badge>
              <span className="text-xs text-muted-foreground">{project.year}</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground transition-colors group-hover:text-accent-purple">
              {project.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-white/[0.04] px-2 py-1 text-xs text-muted"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="rounded-md bg-white/[0.04] px-2 py-1 text-xs text-muted">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

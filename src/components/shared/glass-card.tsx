"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6",
        hover && "transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]",
        className
      )}
    >
      {children}
    </div>
  );
}

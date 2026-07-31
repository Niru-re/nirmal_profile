"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  blur?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  blur = false,
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const directionMap = {
    up: { y: 32 },
    down: { y: -32 },
    left: { x: 32 },
    right: { x: -32 },
    none: {},
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directionMap[direction],
        ...(blur ? { filter: "blur(8px)" } : {}),
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
          : {}
      }
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { GradientText } from "@/components/shared/gradient-text";
import { SITE_CONFIG } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 pt-24 sm:px-6">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {SITE_CONFIG.availability}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Building{" "}
          <GradientText>enterprise-quality</GradientText>
          <br />
          digital products
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          Full-stack developer crafting premium web applications, data platforms,
          and intelligent systems with meticulous attention to detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton>
            <Button asChild size="lg">
              <Link href="/projects">
                View Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

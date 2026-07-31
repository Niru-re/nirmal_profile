"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download, ZoomIn } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import type { Certificate } from "@/data/certificates";

interface CertificateGalleryProps {
  certificates: Certificate[];
}

export function CertificateGallery({ certificates }: CertificateGalleryProps) {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <Reveal key={cert.id} delay={i * 0.08}>
            <button
              onClick={() => setSelected(cert)}
              className="group w-full text-left"
            >
              <GlassCard className="overflow-hidden !p-0">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-accent-purple/10 to-accent-blue/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/[0.05]">
                      {cert.issuer.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-foreground line-clamp-2">{cert.title}</h3>
                  <p className="mt-1 text-sm text-accent-blue">{cert.issuer}</p>
                  <p className="mt-2 text-xs text-muted">
                    Issued {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </GlassCard>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl glass rounded-2xl p-6"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 mb-6" />

              <h3 className="text-xl font-semibold text-foreground">{selected.title}</h3>
              <p className="mt-1 text-accent-blue">{selected.issuer}</p>

              {selected.credentialId && (
                <p className="mt-2 text-sm text-muted">
                  Credential ID: {selected.credentialId}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.skills.map((skill) => (
                  <Badge key={skill} variant="purple">{skill}</Badge>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                {selected.verificationUrl && (
                  <a
                    href={selected.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition-colors hover:border-white/20 hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Verify
                  </a>
                )}
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-muted transition-colors hover:border-white/20 hover:text-foreground">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

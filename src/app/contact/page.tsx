import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Code2, Link2, Download, Clock } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { GlassCard } from "@/components/shared/glass-card";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for project inquiries, collaborations, or just to say hello.",
};

export default function ContactPage() {
  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            label="Contact"
            title="Let's work together"
            description="Have a project in mind? I'd love to hear about it. Send me a message and I'll respond as soon as possible."
          />
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Reveal delay={0.1}>
              <GlassCard>
                <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
                <div className="space-y-4">
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex items-center gap-3 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4 text-accent-purple" />
                    {SITE_CONFIG.email}
                  </a>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <MapPin className="h-4 w-4 text-accent-purple" />
                    {SITE_CONFIG.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <Clock className="h-4 w-4 text-accent-purple" />
                    {SITE_CONFIG.availability}
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.15}>
              <GlassCard>
                <h3 className="mb-4 text-lg font-semibold">Social</h3>
                <div className="flex gap-3">
                  <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted hover:text-foreground transition-colors">
                    <Code2 className="h-4 w-4" />
                  </a>
                  <a href={SITE_CONFIG.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted hover:text-foreground transition-colors">
                    <Link2 className="h-4 w-4" />
                  </a>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.2}>
              <Button asChild variant="secondary" className="w-full">
                <Link href={SITE_CONFIG.resumeUrl}>
                  <Download className="h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

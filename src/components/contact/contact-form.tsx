"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.currentTarget as HTMLFormElement;
      const fd = new FormData(form);
      const payload: Record<string, string> = {};
      fd.forEach((value, key) => {
        payload[key] = String(value);
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Contact send failed", data);
        alert(data?.error || "Failed to send message. Please try again later.");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <GlassCard className="text-center py-12">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-4 text-xl font-semibold text-foreground">Message Sent!</h3>
        <p className="mt-2 text-muted">Thank you for reaching out. I&apos;ll get back to you soon.</p>
      </GlassCard>
    );
  }

  return (
    <Reveal>
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                Name
              </label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-foreground">
              Subject
            </label>
            <Input id="subject" name="subject" placeholder="Project inquiry" required />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
              Message
            </label>
            <Textarea id="message" name="message" placeholder="Tell me about your project..." required />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
            {!loading && <Send className="h-4 w-4" />}
          </Button>
        </form>
      </GlassCard>
    </Reveal>
  );
}

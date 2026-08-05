"use client";

import { useRef, useState } from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";

function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

function showToast(message: string, type: "success" | "error") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
    type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
  }`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0");
  }, 2500);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled || loading) {
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    if (!validateEmail(email)) {
      showToast("Enter a valid email address.", "error");
      return;
    }

    if (message.length < 10) {
      showToast("Message must be at least 10 characters.", "error");
      return;
    }

    if (message.length > 2000) {
      showToast("Message must be 2000 characters or fewer.", "error");
      return;
    }

    setLoading(true);
    setDisabled(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showToast(data?.error || "Failed to send message. Please try again later.", "error");
        setLoading(false);
        setDisabled(false);
        return;
      }

      setSubmitted(true);
      showToast("Message sent successfully!", "success");
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      showToast("Unable to send your message. Please try again later.", "error");
      setDisabled(false);
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
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
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
          <Button type="submit" size="lg" className="w-full" disabled={disabled || loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                Sending...
                <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                Send Message
                <Send className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </GlassCard>
    </Reveal>
  );
}

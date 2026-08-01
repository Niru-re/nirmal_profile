import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { ServiceCard } from "@/components/services/service-card";
import { getAllServices } from "@/data/services";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description: "Professional services including web development, data analytics, machine learning, and design.",
};

export default async function ServicesPage() {
  const services = await getAllServices();
  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            label="Services"
            title="What I offer"
            description="End-to-end services from concept to deployment. Transparent pricing with flexible engagement models."
            align="center"
            className="mx-auto"
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

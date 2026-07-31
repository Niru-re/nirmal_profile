import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { CertificateGallery } from "@/components/certificates/certificate-gallery";
import { certificates } from "@/data/certificates";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Professional certifications and credentials.",
};

export default function CertificatesPage() {
  return (
    <div className="px-4 pt-32 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeader
            label="Credentials"
            title="Certifications"
            description="Professional certifications validating expertise across cloud, data, development, and design."
          />
        </Reveal>
        <CertificateGallery certificates={certificates} />
      </div>
    </div>
  );
}

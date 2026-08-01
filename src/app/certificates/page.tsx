import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/shared/reveal";
import { CertificateGallery } from "@/components/certificates/certificate-gallery";
import { getAllCertificates } from "@/data/certificates";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Certificates",
  description: "Professional certifications and credentials.",
};

export default async function CertificatesPage() {
  const certificates = await getAllCertificates();
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

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  imageUrl: string;
  verificationUrl?: string;
  credentialId?: string;
  skills: string[];
}

export const certificates: Certificate[] = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issueDate: "2024-06",
    expiryDate: "2027-06",
    imageUrl: "/certificates/aws-saa.jpg",
    verificationUrl: "https://aws.amazon.com/verification",
    credentialId: "AWS-SAA-2024-XXXX",
    skills: ["AWS", "Cloud Architecture", "DevOps"],
  },
  {
    id: "2",
    title: "Google Professional Data Engineer",
    issuer: "Google Cloud",
    issueDate: "2024-03",
    imageUrl: "/certificates/gcp-de.jpg",
    verificationUrl: "https://cloud.google.com/certification",
    credentialId: "GCP-DE-2024-XXXX",
    skills: ["GCP", "Data Engineering", "BigQuery"],
  },
  {
    id: "3",
    title: "Meta Front-End Developer",
    issuer: "Meta",
    issueDate: "2023-11",
    imageUrl: "/certificates/meta-fe.jpg",
    verificationUrl: "https://coursera.org/verify",
    credentialId: "META-FE-2023-XXXX",
    skills: ["React", "JavaScript", "CSS", "Testing"],
  },
  {
    id: "4",
    title: "Microsoft Power BI Data Analyst",
    issuer: "Microsoft",
    issueDate: "2023-08",
    imageUrl: "/certificates/powerbi.jpg",
    verificationUrl: "https://learn.microsoft.com/credentials",
    credentialId: "PL-300-2023-XXXX",
    skills: ["Power BI", "DAX", "Data Modeling"],
  },
  {
    id: "5",
    title: "TensorFlow Developer Certificate",
    issuer: "Google / TensorFlow",
    issueDate: "2023-05",
    imageUrl: "/certificates/tensorflow.jpg",
    verificationUrl: "https://tensorflow.org/certificate",
    credentialId: "TF-DEV-2023-XXXX",
    skills: ["TensorFlow", "Deep Learning", "Python"],
  },
  {
    id: "6",
    title: "UI/UX Design Specialization",
    issuer: "California Institute of the Arts",
    issueDate: "2022-12",
    imageUrl: "/certificates/uiux.jpg",
    verificationUrl: "https://coursera.org/verify",
    credentialId: "CALARTS-UX-2022-XXXX",
    skills: ["UI Design", "UX Research", "Prototyping"],
  },
];

type CertificateRow = Omit<
  Certificate,
  "issueDate" | "expiryDate" | "imageUrl" | "verificationUrl" | "credentialId"
> & {
  issue_date: string;
  expiry_date: string | null;
  image_url: string;
  verification_url: string | null;
  credential_id: string | null;
};

function normalize(row: CertificateRow): Certificate {
  return {
    id: String(row.id),
    title: row.title,
    issuer: row.issuer,
    issueDate: String(row.issue_date).slice(0, 7),
    expiryDate: row.expiry_date ? String(row.expiry_date).slice(0, 7) : undefined,
    imageUrl: row.image_url ?? "",
    verificationUrl: row.verification_url ?? undefined,
    credentialId: row.credential_id ?? undefined,
    skills: row.skills ?? [],
  };
}

export async function getAllCertificates(): Promise<Certificate[]> {
  const { loadSupabaseServerClientOrNull } = await import("@/data/_db");
  const supabase = await loadSupabaseServerClientOrNull();
  if (!supabase) return [...certificates];
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("issue_date", { ascending: false });
    if (error) { console.error("[certificates] Supabase error:", error.message); return [...certificates]; }
    if (!data || data.length === 0) return [...certificates];
    return (data as CertificateRow[]).map(normalize);
  } catch (err) { console.error("[certificates] fetch failed:", err); return [...certificates]; }
}

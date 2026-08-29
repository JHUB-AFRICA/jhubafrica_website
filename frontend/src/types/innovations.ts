export interface InnovationItem {
    id: string;
    title: string;
    sector: string;
    stage: "Concept" | "Prototype" | "Pilot" | "Market entry" | "Scale";
    need: string;
    problem: string;
    solution: string;
    description?: string;
    tagline?: string;
    traction?: string;
    impactEvidence?: string;
    beneficiaries?: string;
    mediaUrls?: string[];
    status?: string;
    slug?: string;
    coverImageUrl?: string;
    website?: string;
    projectLinks?: string;
    createdAt?: string;
    updatedAt?: string;
    teamMembers?: { name: string; role: string; email?: string; linkedinUrl?: string }[];
    sponsorships?: any[];
}

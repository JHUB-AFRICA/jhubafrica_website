export interface InnovationItem {
    id: string;
    title: string;
    sector: string;
    stage: "Concept" | "Prototype" | "Pilot" | "Market entry" | "Scale";
    need: string;
    problem: string;
    solution: string;
    status?: string;
    slug?: string;
    coverImageUrl?: string;
    teamMembers?: { name: string; role: string }[];
}
